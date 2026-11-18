import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

const blankMovie = { title: '', director: '', releaseYear: '', categoryId: '' };

function ManageMovies() {
  const { movies, categories, addMovie, updateMovie, deleteMovie } = useAppData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(() => (
    searchParams.has('new')
      ? { ...blankMovie, categoryId: categories[0]?.id || '' }
      : blankMovie
  ));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const visibleMovies = useMemo(() => movies.filter((movie) => {
    const matchesText = `${movie.title} ${movie.director}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || movie.categoryId === Number(categoryFilter);
    return matchesText && matchesCategory;
  }), [movies, query, categoryFilter]);

  const startAdd = () => {
    setEditingId(null);
    setForm({ ...blankMovie, categoryId: categories[0]?.id || '' });
    setMessage('');
    setError('');
    setSearchParams({ new: '1' });
  };

  const startEdit = (movie) => {
    setEditingId(movie.id);
    setForm({
      title: movie.title,
      director: movie.director,
      releaseYear: String(movie.releaseYear),
      categoryId: String(movie.categoryId || '')
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

  const saveMovie = (event) => {
    event.preventDefault();
    const year = Number(form.releaseYear);
    const category = categories.find((item) => item.id === Number(form.categoryId));
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
      description: editingId
        ? movies.find((movie) => movie.id === editingId)?.description || ''
        : '',
      icon: editingId ? movies.find((movie) => movie.id === editingId)?.icon || '✦' : '✦',
      posterTone: editingId ? movies.find((movie) => movie.id === editingId)?.posterTone || 'violet' : 'violet'
    };

    if (editingId) {
      updateMovie(editingId, movieData);
      setMessage('Movie changes saved.');
    } else {
      addMovie(movieData);
      setMessage('Movie added to the demo collection.');
    }
    setError('');
    closeForm();
  };

  const removeMovie = (movie) => {
    if (!window.confirm(`Delete "${movie.title}" from the demo collection?`)) return;
    deleteMovie(movie.id);
    setMessage('Movie deleted.');
    setError('');
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">CATALOG MANAGEMENT</span><h1>Manage movies</h1><p>Add, update, and remove movies from the shared demo collection.</p></div>
        <button className="button button-primary" onClick={startAdd}>＋ Add Movie</button>
      </header>
      <p className="demo-data-notice">Demo only: changes are stored in this browser and are not sent to the API.</p>
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
            <div><label htmlFor="movie-category">Category</label><select id="movie-category" value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required><option value="">Select a category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></div>
          </div>
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId ? 'Save Changes' : 'Add Movie'}</button><button className="button button-quiet" type="button" onClick={closeForm}>Cancel</button></div>
        </form>
      )}

      <section className="admin-panel">
        <div className="admin-toolbar">
          <div><span className="eyebrow">MOVIE CATALOG</span><h2>{movies.length} movies</h2></div>
          <div className="admin-toolbar-filters">
            <label className="visually-hidden" htmlFor="admin-movie-search">Search movies</label>
            <input id="admin-movie-search" type="search" placeholder="Search title or director" value={query} onChange={(event) => setQuery(event.target.value)} />
            <label className="visually-hidden" htmlFor="admin-movie-category">Filter by category</label>
            <select id="admin-movie-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
          </div>
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead><tr><th>ID</th><th>Title</th><th>Director</th><th>Year</th><th>Category</th><th>Actions</th></tr></thead>
            <tbody>
              {visibleMovies.map((movie) => (
                <tr key={movie.id}>
                  <td className="table-secondary">#{movie.id}</td>
                  <td><strong>{movie.title}</strong></td>
                  <td>{movie.director}</td>
                  <td>{movie.releaseYear}</td>
                  <td><span className="table-pill">{movie.categoryName}</span></td>
                  <td><div className="table-actions"><button className="table-action" onClick={() => startEdit(movie)}>Edit</button><button className="table-action danger" onClick={() => removeMovie(movie)}>Delete</button></div></td>
                </tr>
              ))}
              {!visibleMovies.length && <tr><td colSpan="6" className="table-empty">No movies match your search or category.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ManageMovies;
