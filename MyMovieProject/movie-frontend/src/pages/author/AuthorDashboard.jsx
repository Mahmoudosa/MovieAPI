import { Link } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';

function AuthorDashboard() {
  const { articles, authorProfile, movies } = useAppData();
  const published = articles.filter((article) => article.status === 'Published').length;
  const drafts = articles.filter((article) => article.status === 'Draft').length;
  const recentArticles = [...articles].sort(
    (first, second) => new Date(second.updatedAt) - new Date(first.updatedAt)
  ).slice(0, 4);

  return (
    <main className="content portal-content author-content">
      <header className="page-header">
        <div><span className="eyebrow">EDITORIAL STUDIO</span><h1>Welcome, {authorProfile.userName}</h1><p>Shape your next idea into a story for movie fans.</p></div>
        <div className="form-actions">
          <Link className="button button-secondary" to="/author/movies">＋ Add Movie</Link>
          <Link className="button button-primary" to="/author/articles/new">＋ Create Article</Link>
        </div>
      </header>
      <p className="demo-data-notice author-notice">Proposed frontend feature: articles are local demo content. The backend has no confirmed article model or endpoint.</p>
      <section className="admin-stat-grid author-stat-grid">
        <div className="admin-stat-card"><span className="admin-stat-icon">▤</span><span className="admin-stat-value">{articles.length}</span><span className="admin-stat-label">Total articles</span></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">◉</span><span className="admin-stat-value">{published}</span><span className="admin-stat-label">Published</span></div>
        <div className="admin-stat-card"><span className="admin-stat-icon">✎</span><span className="admin-stat-value">{drafts}</span><span className="admin-stat-label">Drafts</span></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><span className="eyebrow">YOUR WRITING</span><h2>Recent articles</h2></div>
          <Link className="text-link" to="/author/articles">View all →</Link>
        </div>
        <div className="article-list">
          {recentArticles.map((article) => {
            const movie = movies.find((item) => item.id === Number(article.relatedMovieId));
            return (
              <article className="article-row" key={article.id}>
                <div className="article-row-main"><h3>{article.title}</h3><p>{article.summary}</p><small>{movie ? `Related to ${movie.title} · ` : ''}Updated {new Date(article.updatedAt).toLocaleDateString()}</small></div>
                <span className={`status-pill ${article.status === 'Published' ? 'status-enabled' : 'status-draft'}`}>{article.status}</span>
                <Link className="table-action" to={`/author/articles/${article.id}/edit`}>Edit</Link>
              </article>
            );
          })}
          {!articles.length && <div className="table-empty">No articles yet. Create your first story.</div>}
        </div>
      </section>
    </main>
  );
}

export default AuthorDashboard;
