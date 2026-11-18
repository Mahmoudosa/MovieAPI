import { useEffect, useState } from 'react';
import AppDataContext from './AppDataContextValue';
import {
  defaultAuthorProfile,
  mockArticles,
  mockCategories,
  mockReviews,
  mockUsers
} from '../data/demoManagementData';

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

  const addToWatchlist = (movieId) => {
    setWatchlistIds((current) => (
      current.includes(movieId) ? current : [...current, movieId]
    ));
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlistIds((current) => current.filter((id) => id !== movieId));
  };

  const addReview = ({ movieId, rating, comment }) => {
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

  const updateReview = (reviewId, changes) => {
    setReviews((current) => current.map((review) => (
      review.id === reviewId
        ? { ...review, ...changes, rating: Number(changes.rating) }
        : review
    )));
  };

  const deleteReview = (reviewId) => {
    setReviews((current) => current.filter((review) => review.id !== reviewId));
  };

  const addMovie = (movieData) => {
    const movie = {
      ...movieData,
      id: Math.max(0, ...movieList.map((item) => item.id)) + 1,
      rating: 0,
      addedAt: new Date().toISOString()
    };
    setMovieList((current) => [...current, movie]);
    return movie;
  };

  const updateMovie = (movieId, changes) => {
    setMovieList((current) => current.map((movie) => (
      movie.id === movieId ? { ...movie, ...changes } : movie
    )));
  };

  const deleteMovie = (movieId) => {
    setMovieList((current) => current.filter((movie) => movie.id !== movieId));
    setWatchlistIds((current) => current.filter((id) => id !== movieId));
    setReviews((current) => current.filter((review) => review.movieId !== movieId));
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

  const value = {
    movies: movieList,
    setMovies: setMovieList,
    categories,
    users,
    watchlistIds,
    watchlist: movieList.filter((movie) => watchlistIds.includes(movie.id)),
    reviews,
    profile,
    setProfile,
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
