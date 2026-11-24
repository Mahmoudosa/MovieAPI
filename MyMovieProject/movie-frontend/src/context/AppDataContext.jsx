import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppDataContext from './AppDataContextValue';
import { useAuth } from '../hooks/useAuth';
import {
  defaultAuthorProfile,
  mockArticles,
  mockCategories,
  mockReviews,
  mockUsers
} from '../data/demoManagementData';
import { getCategories } from '../services/categoryService';
import { createMovie as createApiMovie, deleteMovie as deleteApiMovie, getMovies, updateMovie as updateApiMovie } from '../services/movieService';
import { createReview as createApiReview, deleteReview as deleteApiReview, getReviews, updateReview as updateApiReview } from '../services/reviewService';
import { createWatchlistItem, deleteWatchlistItem, getWatchlists } from '../services/watchlistService';

const storageKeys = {
  watchlist: 'mymovieapp-watchlist',
  reviews: 'mymovieapp-reviews',
  profile: 'mymovieapp-profile',
  movies: 'mymovieapp-admin-movies',
  categories: 'mymovieapp-admin-categories',
  users: 'mymovieapp-admin-users',
  articles: 'mymovieapp-author-articles',
  authorProfile: 'mymovieapp-author-profile'
};

const defaultProfile = {
  userName: 'Movie Fan',
  email: 'fan@example.com'
};

function mapMovie(movie) {
  return {
    id: Number(movie.id ?? movie.Id),
    title: movie.title ?? movie.Title ?? '',
    director: movie.director ?? movie.Director ?? '',
    releaseYear: Number(movie.releaseYear ?? movie.ReleaseYear ?? 0),
    categoryId: Number(movie.categoryId ?? movie.CategoryId ?? 0),
    categoryName: movie.categoryName ?? movie.CategoryName ?? '',
    description: movie.description ?? movie.Description ?? '',
    ownerUserId: Number(movie.ownerUserId ?? movie.OwnerUserId) || null,
    rating: Number(movie.rating ?? movie.Rating ?? 0),
    addedAt: movie.addedAt ?? movie.AddedAt ?? '',
    icon: movie.icon ?? '✦',
    posterTone: movie.posterTone ?? 'violet'
  };
}

function mapCategory(category) {
  return {
    id: Number(category.id ?? category.Id),
    name: category.name ?? category.Name ?? '',
    description: category.description ?? category.Description ?? ''
  };
}

function mapReview(review) {
  return {
    id: review.id ?? review.Id,
    rating: Number(review.rating ?? review.Rating ?? 0),
    comment: review.comment ?? review.Comment ?? '',
    movieId: Number(review.movieId ?? review.MovieId),
    movieTitle: review.movieTitle ?? review.MovieTitle ?? '',
    userId: Number(review.userId ?? review.UserId),
    userName: review.userName ?? review.UserName ?? '',
    createdAt: review.createdAt ?? review.CreatedAt ?? ''
  };
}

function mapWatchlist(item) {
  return {
    id: item.id ?? item.Id,
    movieId: Number(item.movieId ?? item.MovieId),
    userId: Number(item.userId ?? item.UserId),
    isWatched: Boolean(item.isWatched ?? item.IsWatched),
    movieTitle: item.movieTitle ?? item.MovieTitle ?? ''
  };
}

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage.`, error);
    return fallback;
  }
}

function usePersistentState(key, fallback) {
  const [value, setValue] = useState(() => readStorage(key, fallback));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Could not save ${key} to localStorage.`, error);
    }
  }, [key, value]);

  return [value, setValue];
}

export function AppDataProvider({ children, movies }) {
  const { isAuthenticated, user, token } = useAuth();
  const { pathname } = useLocation();
  const isMovieManagementPage = pathname === '/admin/movies' || pathname === '/author/movies';
  const [movieList, setMovieList] = usePersistentState(storageKeys.movies, movies);
  const [categories, setCategories] = usePersistentState(storageKeys.categories, mockCategories);
  const [users, setUsers] = usePersistentState(storageKeys.users, mockUsers);
  const [watchlistIds, setWatchlistIds] = usePersistentState(
    storageKeys.watchlist,
    []
  );
  const [reviews, setReviews] = usePersistentState(storageKeys.reviews, mockReviews);
  const [profile, setProfile] = usePersistentState(
    storageKeys.profile,
    defaultProfile
  );
  const [articles, setArticles] = usePersistentState(storageKeys.articles, mockArticles);
  const [authorProfile, setAuthorProfile] = usePersistentState(
    storageKeys.authorProfile,
    defaultAuthorProfile
  );
  const [demoRole, setDemoRole] = useState('User');
  const [apiState, setApiState] = useState({
    token: null,
    pathname: null,
    data: null,
    error: ''
  });
  const apiStateRef = useRef(apiState);

  useEffect(() => {
    apiStateRef.current = apiState;
  }, [apiState]);

  useEffect(() => {
    let active = true;

    if (!isAuthenticated) return undefined;

    const currentApiState = apiStateRef.current;
    const currentData = currentApiState.token === token
      ? currentApiState.data
      : null;
    Promise.allSettled([
      isMovieManagementPage
        ? Promise.resolve(null)
        : currentData?.movies
          ? Promise.resolve(currentData.movies)
          : getMovies(),
      currentData?.categories
        ? Promise.resolve(currentData.categories)
        : getCategories(),
      isMovieManagementPage
        ? Promise.resolve(null)
        : currentData?.reviews
          ? Promise.resolve(currentData.reviews)
          : getReviews(),
      isMovieManagementPage
        ? Promise.resolve(null)
        : currentData?.watchlists
          ? Promise.resolve(currentData.watchlists)
          : getWatchlists()
    ]).then((results) => {
      if (!active) return;

      const [movieResult, categoryResult, reviewResult, watchlistResult] = results;
      const nextData = {
        movies: movieResult.status === 'fulfilled'
          ? movieResult.value?.map(mapMovie) ?? null
          : null,
        categories: categoryResult.status === 'fulfilled'
          ? categoryResult.value?.map(mapCategory) ?? null
          : null,
        reviews: reviewResult.status === 'fulfilled'
          ? reviewResult.value?.map(mapReview) ?? null
          : null,
        watchlists: watchlistResult.status === 'fulfilled'
          ? watchlistResult.value?.map(mapWatchlist) ?? null
          : null
      };
      const failures = results
        .filter((result) => result.status === 'rejected')
        .map((result) => result.reason.message);
      setApiState({
        token,
        pathname,
        data: nextData,
        error: failures.join(' ')
      });
    });

    return () => {
      active = false;
    };
  }, [isAuthenticated, token, pathname, isMovieManagementPage]);

  const apiData = isAuthenticated && apiState.token === token &&
    apiState.pathname === pathname
    ? apiState.data
    : null;
  const apiLoading = isAuthenticated && apiData === null;
  const apiError = isAuthenticated && apiState.token === token ? apiState.error : '';

  const runApiAction = async (action) => {
    try {
      await action();
      setApiState((current) => (
        current.token === token ? { ...current, error: '' } : current
      ));
      return true;
    } catch (error) {
      const message = error.status === 401
        ? 'Your session has expired or is not authorized. Please sign in again.'
        : error.status === 403
          ? 'Your account does not have permission to perform this action.'
          : error.status === 503
            ? error.message || 'This feature is currently disabled.'
            : error.message;
      setApiState((current) => (
        current.token === token
          ? { ...current, error: message }
          : { ...current, token, error: message }
      ));
      return false;
    }
  };

  const addToWatchlist = async (movieId) => {
    if (isAuthenticated) {
      if (!apiData) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Please wait for your account data to finish loading.'
        }));
        return false;
      }
      if (!user?.id) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Your login token does not contain a user ID. Please sign in again.'
        }));
        return false;
      }
      return runApiAction(async () => {
        const item = await createWatchlistItem({
          movieId: Number(movieId),
          userId: user.id,
          isWatched: false
        });
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            watchlists: [...(current.data?.watchlists ?? []), mapWatchlist(item)]
          }
        }));
      });
    }
    setWatchlistIds((current) => (
      current.includes(movieId) ? current : [...current, movieId]
    ));
    return true;
  };

  const removeFromWatchlist = async (movieId) => {
    if (isAuthenticated) {
      const item = apiData?.watchlists?.find((entry) => entry.movieId === Number(movieId));
      if (!item) return false;
      return runApiAction(async () => {
        await deleteWatchlistItem(item.id);
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            watchlists: current.data.watchlists.filter((entry) => entry.id !== item.id)
          }
        }));
      });
    }
    setWatchlistIds((current) => current.filter((id) => id !== movieId));
    return true;
  };

  const addReview = async ({ movieId, rating, comment }) => {
    if (isAuthenticated) {
      if (!apiData) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Please wait for your account data to finish loading.'
        }));
        return false;
      }
      if (!user?.id) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Your login token does not contain a user ID. Please sign in again.'
        }));
        return false;
      }
      let savedReview;
      const succeeded = await runApiAction(async () => {
        savedReview = mapReview(await createApiReview({
          rating: Number(rating),
          comment: comment.trim(),
          movieId: Number(movieId),
          userId: user.id
        }));
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            reviews: [savedReview, ...(current.data?.reviews ?? [])]
          }
        }));
      });
      return succeeded ? savedReview : false;
    }
    const review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      movieId,
      userId: 1,
      userName: profile.userName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };
    setReviews((current) => [review, ...current]);
    return review;
  };

  const updateReview = async (reviewId, changes) => {
    if (isAuthenticated) {
      const review = apiData?.reviews?.find((entry) => entry.id === reviewId);
      if (!review || review.userId !== user?.id) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'You can only edit your own reviews.'
        }));
        return false;
      }
      let updatedReview;
      const succeeded = await runApiAction(async () => {
        updatedReview = mapReview(await updateApiReview(reviewId, {
          rating: Number(changes.rating),
          comment: changes.comment.trim(),
          movieId: review.movieId,
          userId: review.userId
        }));
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            reviews: current.data.reviews.map((entry) => (
              entry.id === reviewId ? updatedReview : entry
            ))
          }
        }));
      });
      return succeeded ? updatedReview : false;
    }
    setReviews((current) => current.map((review) => (
      review.id === reviewId
        ? { ...review, ...changes, rating: Number(changes.rating) }
        : review
    )));
  };

  const deleteReview = async (reviewId) => {
    if (isAuthenticated) {
      const review = apiData?.reviews?.find((entry) => entry.id === reviewId);
      if (!review || review.userId !== user?.id) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'You can only delete your own reviews.'
        }));
        return false;
      }
      return runApiAction(async () => {
        await deleteApiReview(reviewId);
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            reviews: current.data.reviews.filter((entry) => entry.id !== reviewId)
          }
        }));
      });
    }
    setReviews((current) => current.filter((review) => review.id !== reviewId));
    return true;
  };

  const addMovie = async (movieData) => {
    if (isAuthenticated) {
      if (!apiData?.categories) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Movie data is still loading. Please try again shortly.'
        }));
        return false;
      }

      let savedMovie;
      const succeeded = await runApiAction(async () => {
        const result = await createApiMovie({
          title: movieData.title,
          director: movieData.director,
          releaseYear: Number(movieData.releaseYear),
          categoryId: Number(movieData.categoryId),
          description: movieData.description
        });
        savedMovie = mapMovie({
          ...result,
          CategoryName: apiData.categories.find(
            (category) => category.id === Number(movieData.categoryId)
          )?.name ?? movieData.categoryName
        });
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            movies: current.data?.movies
              ? [...current.data.movies, savedMovie]
              : current.data?.movies
          }
        }));
      });
      return succeeded ? savedMovie : false;
    }

    const movie = {
      ...movieData,
      id: Math.max(0, ...movieList.map((item) => item.id)) + 1,
      rating: 0,
      addedAt: new Date().toISOString()
    };
    setMovieList((current) => [...current, movie]);
    return movie;
  };

  const updateMovie = async (movieId, changes, movieFromSearch) => {
    if (isAuthenticated) {
      const currentMovie = apiData?.movies?.find((movie) => movie.id === Number(movieId))
        ?? movieFromSearch;
      const category = apiData?.categories?.find(
        (item) => item.id === Number(changes.categoryId)
      );
      if (!currentMovie || !category) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'Choose a movie and an existing database category.'
        }));
        return false;
      }

      let updatedMovie;
      const succeeded = await runApiAction(async () => {
        const result = await updateApiMovie(movieId, {
          title: changes.title,
          director: changes.director,
          releaseYear: Number(changes.releaseYear),
          categoryId: Number(changes.categoryId),
          description: changes.description
        });
        updatedMovie = mapMovie({
          ...currentMovie,
          ...result,
          CategoryName: category.name
        });
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            movies: current.data.movies?.map((movie) => (
              movie.id === Number(movieId) ? updatedMovie : movie
            )) ?? current.data.movies
          }
        }));
      });
      return succeeded ? updatedMovie : false;
    }

    setMovieList((current) => current.map((movie) => (
      movie.id === movieId ? { ...movie, ...changes } : movie
    )));
    return true;
  };

  const deleteMovie = async (movieId, movieFromSearch) => {
    if (isAuthenticated) {
      if (!apiData?.movies?.some((movie) => movie.id === Number(movieId)) &&
          movieFromSearch?.id !== Number(movieId)) {
        setApiState((current) => ({
          ...current,
          token,
          error: 'The movie is not available in the database list.'
        }));
        return false;
      }
      return runApiAction(async () => {
        await deleteApiMovie(movieId);
        setApiState((current) => ({
          ...current,
          data: {
            ...current.data,
            movies: current.data.movies?.filter((movie) => movie.id !== Number(movieId))
              ?? current.data.movies,
            watchlists: current.data.watchlists?.filter((item) => item.movieId !== Number(movieId)),
            reviews: current.data.reviews?.filter((review) => review.movieId !== Number(movieId))
          }
        }));
      });
    }

    setMovieList((current) => current.filter((movie) => movie.id !== movieId));
    setWatchlistIds((current) => current.filter((id) => id !== movieId));
    setReviews((current) => current.filter((review) => review.movieId !== movieId));
    return true;
  };

  const addCategory = (categoryData) => {
    const category = {
      ...categoryData,
      id: Math.max(0, ...categories.map((item) => item.id)) + 1
    };
    setCategories((current) => [...current, category]);
    return category;
  };

  const updateCategory = (categoryId, changes) => {
    setCategories((current) => current.map((category) => (
      category.id === categoryId ? { ...category, ...changes } : category
    )));
    setMovieList((current) => current.map((movie) => (
      movie.categoryId === categoryId
        ? { ...movie, categoryName: changes.name }
        : movie
    )));
  };

  const deleteCategory = (categoryId) => {
    if (movieList.some((movie) => movie.categoryId === categoryId)) {
      return false;
    }
    setCategories((current) => current.filter((category) => category.id !== categoryId));
    return true;
  };

  const updateUser = (userId, changes) => {
    setUsers((current) => current.map((user) => (
      user.id === userId ? { ...user, ...changes } : user
    )));
  };

  const deleteAdminReview = (reviewId) => {
    setReviews((current) => current.filter((review) => review.id !== reviewId));
  };

  const addArticle = (articleData) => {
    const article = {
      ...articleData,
      id: `${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setArticles((current) => [article, ...current]);
    return article;
  };

  const updateArticle = (articleId, changes) => {
    setArticles((current) => current.map((article) => (
      article.id === articleId
        ? { ...article, ...changes, updatedAt: new Date().toISOString() }
        : article
    )));
  };

  const deleteArticle = (articleId) => {
    setArticles((current) => current.filter((article) => article.id !== articleId));
  };

  const catalogMovies = isAuthenticated ? apiData?.movies ?? [] : movieList;
  const catalogCategories = isAuthenticated ? apiData?.categories ?? [] : categories;
  const userReviews = isAuthenticated
    ? (apiData?.reviews ?? []).filter((review) => review.userId === user?.id)
    : reviews.filter((review) => review.userId === 1 || review.userName === profile.userName);
  const watchlistIdsForUser = isAuthenticated
    ? (apiData?.watchlists ?? []).map((item) => item.movieId)
    : watchlistIds;
  const activeProfile = isAuthenticated
    ? {
      ...profile,
      userName: user.userName || profile.userName,
      email: user.email || profile.email
    }
    : profile;

  const value = {
    movies: catalogMovies,
    catalogMovies,
    setMovies: setMovieList,
    categories: catalogCategories,
    catalogCategories,
    users,
    watchlistIds: watchlistIdsForUser,
    watchlist: catalogMovies.filter((movie) => watchlistIdsForUser.includes(movie.id)),
    reviews,
    catalogReviews: isAuthenticated ? apiData?.reviews ?? [] : reviews,
    userReviews,
    profile: activeProfile,
    setProfile,
    apiLoading,
    apiError,
    articles,
    authorProfile,
    setAuthorProfile,
    demoRole,
    setDemoRole,
    addToWatchlist,
    removeFromWatchlist,
    addReview,
    updateReview,
    deleteReview,
    addMovie,
    updateMovie,
    deleteMovie,
    addCategory,
    updateCategory,
    deleteCategory,
    updateUser,
    deleteAdminReview,
    addArticle,
    updateArticle,
    deleteArticle
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
