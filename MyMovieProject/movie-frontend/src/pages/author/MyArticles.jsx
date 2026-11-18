import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

function MyArticles() {
  const { articles, movies, deleteArticle } = useAppData();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [message, setMessage] = useState('');
  const visibleArticles = useMemo(() => articles.filter((article) => {
    const matchesText = `${article.title} ${article.summary}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === 'all' || article.status === status;
    return matchesText && matchesStatus;
  }).sort((first, second) => new Date(second.updatedAt) - new Date(first.updatedAt)), [articles, query, status]);

  const removeArticle = (article) => {
    if (!window.confirm(`Delete article "${article.title}"?`)) return;
    deleteArticle(article.id);
    setMessage('Article deleted from local demo content.');
  };

  return (
    <main className="content portal-content author-content">
      <header className="page-header">
        <div><span className="eyebrow">EDITORIAL STUDIO</span><h1>My Articles</h1><p>Manage your drafts and published stories.</p></div>
        <Link className="button button-primary" to="/author/articles/new">＋ Create Article</Link>
      </header>
      <p className="demo-data-notice author-notice">Demo content is saved in this browser only.</p>
      {location.state?.message && <p className="success-message" role="status">{location.state.message}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      <section className="admin-panel">
        <div className="admin-toolbar">
          <div><span className="eyebrow">ARTICLE LIBRARY</span><h2>{visibleArticles.length} articles</h2></div>
          <div className="admin-toolbar-filters">
            <label className="visually-hidden" htmlFor="article-search">Search articles</label>
            <input id="article-search" type="search" placeholder="Search articles" value={query} onChange={(event) => setQuery(event.target.value)} />
            <label className="visually-hidden" htmlFor="article-status">Filter article status</label>
            <select id="article-status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">All statuses</option><option>Draft</option><option>Published</option></select>
          </div>
        </div>
        <div className="article-list">
          {visibleArticles.map((article) => {
            const relatedMovie = movies.find((movie) => movie.id === Number(article.relatedMovieId));
            return (
              <article className="article-row" key={article.id}>
                <div className="article-row-main">
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <small>{relatedMovie ? `Related to ${relatedMovie.title} · ` : 'No related movie · '}Updated {new Date(article.updatedAt).toLocaleDateString()}</small>
                </div>
                <span className={`status-pill ${article.status === 'Published' ? 'status-enabled' : 'status-draft'}`}>{article.status}</span>
                <div className="table-actions">
                  <Link className="table-action" to={`/author/articles/${article.id}/edit`}>Edit</Link>
                  <button className="table-action danger" onClick={() => removeArticle(article)}>Delete</button>
                </div>
              </article>
            );
          })}
          {!visibleArticles.length && <div className="empty-state article-empty"><h2>No matching articles</h2><p>Adjust your search or create a new article.</p><Link className="button button-primary" to="/author/articles/new">Create Article</Link></div>}
        </div>
      </section>
    </main>
  );
}

export default MyArticles;
