import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

const emptyArticle = {
  title: '',
  relatedMovieId: '',
  summary: '',
  content: ''
};

function ArticleEditor({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { articles, movies, addArticle, updateArticle } = useAppData();
  const existing = edit ? articles.find((article) => article.id === id) : null;
  const [form, setForm] = useState(() => existing
    ? {
      title: existing.title,
      relatedMovieId: existing.relatedMovieId || '',
      summary: existing.summary,
      content: existing.content
    }
    : emptyArticle);
  const [error, setError] = useState('');

  if (edit && !existing) {
    return (
      <main className="content portal-content author-content">
        <section className="empty-state"><h1>Article not found</h1><p>This article is not in the demo library.</p><Link className="button button-primary" to="/author/articles">Back to Articles</Link></section>
      </main>
    );
  }

  const saveArticle = (event, status) => {
    event.preventDefault();
    const articleData = {
      title: form.title.trim(),
      relatedMovieId: form.relatedMovieId ? Number(form.relatedMovieId) : '',
      summary: form.summary.trim(),
      content: form.content.trim(),
      status
    };
    if (!articleData.title || !articleData.summary || !articleData.content) {
      setError('Complete the title, summary, and article content.');
      return;
    }

    if (edit) updateArticle(id, articleData);
    else addArticle(articleData);
    navigate('/author/articles', {
      state: { message: `Article ${status === 'Published' ? 'published' : 'saved as draft'}.` }
    });
  };

  const saveDraft = (event) => saveArticle(event, 'Draft');
  const publish = (event) => saveArticle(event, 'Published');
  const handleSubmit = (event) => saveArticle(event, existing?.status || 'Draft');

  return (
    <main className="content portal-content author-content">
      <Link className="back-link" to="/author/articles">← Back to Articles</Link>
      <header className="page-header editor-page-header">
        <div><span className="eyebrow">EDITORIAL STUDIO</span><h1>{edit ? 'Edit article' : 'Create article'}</h1><p>Write an original story for the MyMovieApp community.</p></div>
        {edit && <span className={`status-pill ${existing.status === 'Published' ? 'status-enabled' : 'status-draft'}`}>{existing.status}</span>}
      </header>
      <p className="demo-data-notice author-notice">Articles are proposed demo content. No article API is connected.</p>
      <form className="admin-panel article-editor" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="article-title">Article title</label>
          <input id="article-title" value={form.title} maxLength="160" placeholder="Give your story a clear title" onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </div>
        <div className="form-field">
          <label htmlFor="article-movie">Related movie <span className="optional-label">Optional</span></label>
          <select id="article-movie" value={form.relatedMovieId} onChange={(event) => setForm({ ...form, relatedMovieId: event.target.value })}>
            <option value="">No related movie</option>
            {movies.map((movie) => <option key={movie.id} value={movie.id}>{movie.title}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="article-summary">Summary</label>
          <textarea id="article-summary" rows="3" maxLength="300" placeholder="A short introduction to your article" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} required />
          <span className="field-hint">{form.summary.length}/300 characters</span>
        </div>
        <div className="form-field">
          <label htmlFor="article-content">Article content</label>
          <textarea id="article-content" className="article-content-input" rows="12" maxLength="20000" placeholder="Start writing your article..." value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} required />
          <span className="field-hint">{form.content.length}/20,000 characters</span>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="form-actions article-form-actions">
          <button className="button button-secondary" type="button" onClick={saveDraft}>Save Draft</button>
          <button className="button button-primary" type="button" onClick={publish}>Publish</button>
          {edit && <button className="button button-quiet" type="submit">Save Changes</button>}
        </div>
      </form>
    </main>
  );
}

export default ArticleEditor;
