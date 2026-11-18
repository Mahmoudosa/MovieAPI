import { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';

const emptyCategory = { name: '', description: '' };

function ManageCategories() {
  const { categories, movies, addCategory, updateCategory, deleteCategory } = useAppData();
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCategory);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyCategory);
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name, description: category.description });
    setShowForm(true);
    setMessage('');
    setError('');
  };

  const saveCategory = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    if (categories.some((category) => category.name.toLowerCase() === name.toLowerCase() && category.id !== editingId)) {
      setError('A category with this name already exists.');
      return;
    }
    const changes = { name, description: form.description.trim() };
    if (editingId) updateCategory(editingId, changes);
    else addCategory(changes);
    setShowForm(false);
    setEditingId(null);
    setMessage(editingId ? 'Category updated.' : 'Category created.');
    setError('');
  };

  const removeCategory = (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    if (!deleteCategory(category.id)) {
      setError('This category is assigned to movies. Reassign or remove those movies first.');
      setMessage('');
      return;
    }
    setError('');
    setMessage('Category deleted.');
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">TAXONOMY</span><h1>Manage categories</h1><p>Keep movie genres and collection labels organized.</p></div>
        <button className="button button-primary" onClick={openAdd}>＋ Add Category</button>
      </header>
      <p className="demo-data-notice">Demo only: category changes are saved in this browser and shared with the movie screens.</p>
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      {showForm && (
        <form className="admin-panel admin-form" onSubmit={saveCategory}>
          <div className="admin-panel-heading"><div><span className="eyebrow">{editingId ? 'UPDATE CATEGORY' : 'NEW CATEGORY'}</span><h2>{editingId ? 'Edit category' : 'Add category'}</h2></div><button className="icon-button" type="button" aria-label="Close form" onClick={() => setShowForm(false)}>×</button></div>
          <div className="admin-form-grid">
            <div><label htmlFor="category-name">Name</label><input id="category-name" value={form.name} maxLength="80" onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
            <div><label htmlFor="category-description">Description</label><textarea id="category-description" rows="3" maxLength="300" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /></div>
          </div>
          <div className="form-actions"><button className="button button-primary" type="submit">{editingId ? 'Save Changes' : 'Add Category'}</button><button className="button button-quiet" type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
        </form>
      )}
      <section className="admin-category-grid">
        {categories.map((category) => {
          const assignedCount = movies.filter((movie) => movie.categoryId === category.id).length;
          return (
            <article className="admin-category-card" key={category.id}>
              <div className="category-card-top"><span className="admin-stat-icon">◫</span><span className="table-pill">{assignedCount} movies</span></div>
              <h2>{category.name}</h2>
              <p>{category.description || 'No description provided.'}</p>
              <div className="form-actions"><button className="button button-secondary" onClick={() => openEdit(category)}>Edit</button><button className="button button-danger-quiet" onClick={() => removeCategory(category)}>Delete</button></div>
            </article>
          );
        })}
        {!categories.length && <div className="empty-state"><h2>No categories yet</h2><p>Create a category to organize movies.</p></div>}
      </section>
    </main>
  );
}

export default ManageCategories;
