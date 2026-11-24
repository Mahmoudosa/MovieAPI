import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import { searchMovies } from '../../services/movieService';

const blankMovie = {
  title: '',
  director: '',
  releaseYear: '',
  categoryId: '',
  description: ''
};

function ManageMovies({ mode = 'admin' }) {
  const {
    catalogCategories,
    apiLoading,
    apiError,
    addMovie,
    updateMovie,
    deleteMovie
  } = useAppData();
  const { isAuthenticated, user } = useAuth();
  const isAuthor = mode === 'author';
  const canManageMovies = isAuthenticated &&
    user?.role === (isAuthor ? 'Author' : 'Admin');
  const categories = isAuthenticated ? catalogCategories : [];
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewingMovie, setViewingMovie] = useState(null);
  const [searchResults, setSearchResults] = useState({
    items: [],
    totalCount: 0,
    totalPages: 0
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const requestSequence = useRef(0);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => (
    searchParams.has('new')
      ? { ...blankMovie, categoryId: categories[0]?.id || '' }
      : blankMovie
  ));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const normalizedQuery = query.trim();
  const isDebouncing = normalizedQuery !== debouncedQuery;
  const isSearchLoading = searchLoading || isDebouncing;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isAuthenticated || isDebouncing) return undefined;

    const controller = new AbortController();
    const requestId = ++requestSequence.current;
    let active = true;
    let correctingPage = false;
    const timer = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError('');
      try {
        const result = await searchMovies({
          search: debouncedQuery,
          categoryId: categoryFilter,
          page,
          pageSize: 20,
          signal: controller.signal
        });
        if (!active || requestId !== requestSequence.current) return;
        const totalPages = result?.totalPages ?? 0;
        if (page > Math.max(1, totalPages)) {
          correctingPage = true;
          setPage(Math.max(1, totalPages));
          return;
        }
        setSearchResults({
          items: result?.items ?? [],
          totalCount: result?.totalCount ?? 0,
          totalPages
        });
      } catch (requestError) {
        if (!active || requestError.name === 'AbortError') return;
        const errorMessage = requestError.status === 401
          ? 'Your session has expired or is not authorized. Please sign in again.'
          : requestError.status === 403
            ? `Your account does not have permission to access ${isAuthor ? 'author' : 'admin'} movie management.`
            : requestError.status === 503
              ? requestError.message || 'Movie search is currently disabled.'
              : requestError.message;
        setSearchError(errorMessage);
        setSearchResults({ items: [], totalCount: 0, totalPages: 0 });
      } finally {
        if (active && !correctingPage && requestId === requestSequence.current) {
          setSearchLoading(false);
        }
      }
    }, 0);

    return () => {
      active = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [
    isAuthenticated,
    isAuthor,
    isDebouncing,
    debouncedQuery,
    categoryFilter,
    page,
    refreshKey
  ]);

  const startAdd = () => {
    setViewingMovie(null);
    setEditingId(null);
    setForm({ ...blankMovie, categoryId: categories[0]?.id || '' });
    setMessage('');
    setError('');
    setSearchParams({ new: '1' });
  };

  const startEdit = (movie) => {
    setViewingMovie(null);
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      director: movie.director,
      releaseYear: String(movie.releaseYear),
      categoryId: String(movie.categoryId || ''),
      description: movie.description || ''
    });
    setMessage('');
    setError('');
    setSearchParams({});
  };

  const closeForm = () => {
    setEditingId(null);
    setForm(blankMovie);
    setSearchParams({});
  };

  const saveMovie = async (event) => {
    event.preventDefault();
    if (!canManageMovies) {
      setError(`Sign in with an ${isAuthor ? 'Author' : 'Admin'} account to manage movies.`);
      return;
    }
    const year = Number(form.releaseYear);
    const category = categories.find((item) => (
      item.id === Number(form.categoryId || categories[0]?.id)
    ));
    if (!category) {
      setError('Choose an existing category.');
      return;
    }
    if (!Number.isInteger(year) || year < 1888 || year > new Date().getFullYear() + 10) {
      setError('Enter a valid release year.');
      return;
    }

    const movieData = {
      title: form.title.trim(),
      director: form.director.trim(),
      releaseYear: year,
      categoryId: category.id,
      categoryName: category.name,
      description: form.description.trim(),
      icon: editingId ? searchResults.items.find((movie) => movie.id === editingId)?.icon || '✦' : '✦',
      posterTone: editingId ? searchResults.items.find((movie) => movie.id === editingId)?.posterTone || 'violet' : 'violet'
    };

    setError('');
    setMessage('');
    const saved = editingId
      ? await updateMovie(
        editingId,
        movieData,
        searchResults.items.find((movie) => movie.id === editingId)
      )
      : await addMovie(movieData);
    if (!saved) return;

    if (editingId) {
      setMessage('Movie changes saved to the database.');
    } else {
      setMessage('Movie added to the database.');
    }
    setViewingMovie(null);
    setRefreshKey((current) => current + 1);
    closeForm();
  };

  const removeMovie = async (movie) => {
    if (!canManageMovies) {
      setError(`Sign in with an ${isAuthor ? 'Author' : 'Admin'} account to manage movies.`);
      return;
    }
    if (!window.confirm(`Delete "${movie.title}" from the database?`)) return;
    const deleted = await deleteMovie(movie.id, movie);
    if (!deleted) return;
    if (searchResults.items.length === 1 && page > 1) {
      setPage((current) => current - 1);
    }
    setRefreshKey((current) => current + 1);
    if (viewingMovie?.id === movie.id) setViewingMovie(null);
    setMessage('Movie deleted from the database.');
    setError('');
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">CATALOG MANAGEMENT</span><h1>Manage movies</h1><p>{isAuthor ? 'Create and manage movies in the application database.' : 'Movies are loaded from and saved to the application database.'}</p></div>
        <button className="button button-primary" onClick={startAdd} disabled={!canManageMovies || apiLoading}>＋ Add Movie</button>
      </header>
      {!isAuthenticated && (
        <p className="demo-data-notice">
          Sign in with an {isAuthor ? 'Author' : 'Admin'} account to manage database movies. <Link to="/login">Go to login</Link>.
        </p>
      )}
      {isAuthenticated && !canManageMovies && (
        <p className="demo-data-notice" role="status">
          This page requires an {isAuthor ? 'Author' : 'Admin'} account. Your current role is {user?.role || 'User'}.
        </p>
      )}
      {apiLoading && <p className="muted-copy" role="status">Loading categories and account data…</p>}
      {apiError && <p className="error-message" role="alert">{apiError}</p>}
      {searchError && <p className="error-message" role="alert">{searchError}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}

      {(searchParams.has('new') || editingId !== null) && (
        <form className="admin-panel admin-form" onSubmit={saveMovie}>
          <div className="admin-panel-heading">
            <div><span className="eyebrow">{editingId ? 'UPDATE ENTRY' : 'NEW ENTRY'}</span><h2>{editingId ? 'Edit movie' : 'Add movie'}</h2></div>
            <button type="button" className="icon-button" aria-label="Close form" onClick={closeForm}>×</button>
          </div>
          <div className="admin-form-grid">
            <div><label htmlFor="movie-title">Title</label><input id="movie-title" value={form.title} maxLength="100" onChange={(event) => setForm({ ...form, title: event.target.value })} required /></div>
            <div><label htmlFor="movie-director">Director</label><input id="movie-director" value={form.director} maxLength="100" onChange={(event) => setForm({ ...form, director: event.target.value })} required /></div>
            <div><label htmlFor="movie-year">Release year</label><input id="movie-year" type="number" min="1888" max={new Date().getFullYear() + 10} value={form.releaseYear} onChange={(event) => setForm({ ...form, releaseYear: event.target.value })} required /></div>
            <div><label htmlFor="movie-category">Category</label><select id="movie-category" value={form.categoryId || categories[0]?.id || ''} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
            <div className="form-span"><label htmlFor="movie-description">Description (optional)</label><textarea id="movie-description" rows="4" maxLength="2000" placeholder="Add a short description of the movie" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          </div>
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId ? 'Save Changes' : 'Add Movie'}</button><button className="button button-quiet" type="button" onClick={closeForm}>Cancel</button></div>
        </form>
      )}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div><span className="eyebrow">MOVIE CATALOG</span><h2>{searchResults.totalCount} movies</h2></div>
          <div className="admin-toolbar-filters">
            <label className="visually-hidden" htmlFor="admin-movie-search">Search movies</label>
            <input id="admin-movie-search" type="search" placeholder="Search movie titles" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); setViewingMovie(null); }} />
            <label className="visually-hidden" htmlFor="admin-movie-category">Filter by category</label>
            <select id="admin-movie-category" value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); setViewingMovie(null); }}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
          </div>
        </div>
        {viewingMovie && (
          <div className="movie-detail-panel" role="region" aria-label={`${viewingMovie.title} details`}>
            <div className="admin-panel-heading">
              <div><span className="eyebrow">MOVIE DETAILS</span><h3>{viewingMovie.title}</h3></div>
              <button type="button" className="icon-button" aria-label="Close movie details" onClick={() => setViewingMovie(null)}>×</button>
            </div>
            <dl className="movie-detail-grid">
              <div><dt>Director</dt><dd>{viewingMovie.director}</dd></div>
              <div><dt>Release year</dt><dd>{viewingMovie.releaseYear}</dd></div>
              <div><dt>Category</dt><dd>{viewingMovie.categoryName}</dd></div>
              <div className="movie-detail-description"><dt>Description</dt><dd>{viewingMovie.description || 'No description available.'}</dd></div>
            </dl>
          </div>
        )}
        <div className="table-scroll">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Title</th><th>Director</th><th>Year</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {isSearchLoading && <tr><td colSpan="6" className="table-empty" role="status">Loading movies…</td></tr>}
              {!isSearchLoading && searchResults.items.map((movie) => (
                <tr key={movie.id}>
                  <td className="table-secondary">#{movie.id}</td>
                  <td><strong>{movie.title}</strong></td>
                  <td>{movie.director}</td>
                  <td>{movie.releaseYear}</td>
                  <td><span className="table-pill">{movie.categoryName}</span></td>
                  <td><div className="table-actions"><button className="table-action" onClick={() => setViewingMovie(movie)}>View</button><button className="table-action" onClick={() => startEdit(movie)} disabled={!canManageMovies}>Edit</button><button className="table-action danger" onClick={() => removeMovie(movie)} disabled={!canManageMovies}>Delete</button></div></td>
                </tr>
              ))}
              {!isSearchLoading && isAuthenticated && !searchError && !searchResults.items.length && <tr><td colSpan="6" className="table-empty">No movies match your search or category.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="movie-pagination">
          <p>{searchResults.totalCount} matching movies · Page {page} of {searchResults.totalPages}</p>
          <div>
            <button className="button button-quiet" type="button" onClick={() => { setPage((current) => Math.max(1, current - 1)); setViewingMovie(null); }} disabled={page <= 1 || isSearchLoading}>Previous</button>
            <button className="button button-quiet" type="button" onClick={() => { setPage((current) => current + 1); setViewingMovie(null); }} disabled={page >= searchResults.totalPages || isSearchLoading}>Next</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ManageMovies;
