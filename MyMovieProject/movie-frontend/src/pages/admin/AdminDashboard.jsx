import { Link } from 'react-router-dom';
import { mockRecentActivity } from '../../data/demoManagementData';
import { useAppData } from '../../hooks/useAppData';

function AdminDashboard() {
  const { movies, users, reviews, categories } = useAppData();
  const stats = [
    { label: 'Total movies', value: movies.length, icon: '▤', link: '/admin/movies' },
    { label: 'Registered users', value: users.length, icon: '♙', link: '/admin/users' },
    { label: 'Total reviews', value: reviews.length, icon: '✎', link: '/admin/reviews' },
    { label: 'Categories', value: categories.length, icon: '◫', link: '/admin/categories' }
  ];
  const recentMovies = [...movies].sort(
    (first, second) => new Date(second.addedAt) - new Date(first.addedAt)
  ).slice(0, 4);

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div>
          <span className="eyebrow">OVERVIEW</span>
          <h1>Admin dashboard</h1>
          <p>Monitor the demo collection and manage its content.</p>
        </div>
        <span className="demo-only-tag">DEVELOPMENT DEMO</span>
      </header>

      <section className="admin-stat-grid" aria-label="Collection statistics">
        {stats.map((stat) => (
          <Link className="admin-stat-card" to={stat.link} key={stat.label}>
            <span className="admin-stat-icon" aria-hidden="true">{stat.icon}</span>
            <span className="admin-stat-value">{stat.value}</span>
            <span className="admin-stat-label">{stat.label}</span>
            <span className="admin-stat-link">Manage →</span>
          </Link>
        ))}
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div><span className="eyebrow">COLLECTION</span><h2>Recently added movies</h2></div>
            <Link className="text-link" to="/admin/movies">View all →</Link>
          </div>
          {recentMovies.length ? (
            <div className="admin-recent-list">
              {recentMovies.map((movie) => (
                <div className="admin-recent-row" key={movie.id}>
                  <span className={`mini-poster poster-${movie.posterTone || 'violet'}`} aria-hidden="true">
                    {movie.icon || '✦'}
                  </span>
                  <span className="admin-recent-title"><strong>{movie.title}</strong><small>{movie.director}</small></span>
                  <span className="table-secondary">{movie.releaseYear}</span>
                </div>
              ))}
            </div>
          ) : <p className="table-empty">No movies have been added.</p>}
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div><span className="eyebrow">ACTIVITY</span><h2>Recent user activity</h2></div>
            <span className="demo-only-tag">MOCK</span>
          </div>
          <div className="activity-list">
            {mockRecentActivity.map((activity) => (
              <div className="activity-row" key={activity.id}>
                <span className="activity-icon" aria-hidden="true">{activity.icon}</span>
                <span><strong>{activity.label}</strong><small>{activity.time}</small></span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-panel quick-actions">
        <div className="admin-panel-heading">
          <div><span className="eyebrow">SHORTCUTS</span><h2>Quick management actions</h2></div>
        </div>
        <div className="quick-action-grid">
          <Link className="quick-action-card" to="/admin/movies?new=1"><span>＋</span><strong>Add a movie</strong><small>Create a collection entry</small></Link>
          <Link className="quick-action-card" to="/admin/categories"><span>◫</span><strong>Manage categories</strong><small>Organize your collection</small></Link>
          <Link className="quick-action-card" to="/admin/reviews"><span>✎</span><strong>Review moderation</strong><small>Review community feedback</small></Link>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;
