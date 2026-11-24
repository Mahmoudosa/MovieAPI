import { Link } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';

function AuthorDashboard() {
  const { catalogMovies, apiLoading, apiError } = useAppData();
  const { user, isAuthenticated } = useAuth();
  const authorMovies = isAuthenticated
    ? catalogMovies.filter((movie) => movie.ownerUserId === user.id)
    : [];
  const hasAuthorAccess = isAuthenticated && user?.role === 'Author';
  const recentMovies = [...authorMovies]
    .sort((first, second) => second.id - first.id)
    .slice(0, 5);

  return (
    <main className="content portal-content author-content">
      <header className="page-header">
        <div><span className="eyebrow">MOVIE STUDIO</span><h1>Manage movies</h1><p>Create movies and manage your movies.</p></div>
        <div className="form-actions">
          <Link className="button button-secondary" to="/author/movies">Manage Movies</Link>
          <Link className="button button-primary" to="/author/movies?new=1">＋ Add Movie</Link>
        </div>
      </header>
      {!hasAuthorAccess && (
        <p className="demo-data-notice author-notice" role="status">
          Sign in with an Author account to manage your movies.
          {!isAuthenticated && <> <Link to="/login">Go to login</Link>.</>}
          {isAuthenticated && <> Your current role is {user.role}.</>}
        </p>
      )}
      {apiLoading && <p className="muted-copy" role="status">Loading movies from the database…</p>}
      {apiError && <p className="error-message" role="alert">{apiError}</p>}
      <section className="admin-stat-grid author-stat-grid">
        <div className="admin-stat-card"><span className="admin-stat-icon">▣</span><span className="admin-stat-value">{authorMovies.length}</span><span className="admin-stat-label">Your movies</span></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div><span className="eyebrow">DATABASE</span><h2>Your movies</h2></div>
          <Link className="text-link" to="/author/movies">Manage movies →</Link>
        </div>
        <div className="article-list">
          {recentMovies.map((movie) => (
            <article className="article-row" key={movie.id}>
              <div className="article-row-main">
                <h3>{movie.title}</h3>
                <p>{movie.director} · {movie.releaseYear} · {movie.categoryName}</p>
              </div>
              <Link className="table-action" to="/author/movies">Manage</Link>
            </article>
          ))}
          {!apiLoading && !apiError && !authorMovies.length && (
            <div className="table-empty">You haven't created any movies yet. Add your first movie.</div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AuthorDashboard;
