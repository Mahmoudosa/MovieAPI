import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';

function Profile() {
  const { profile, setProfile, watchlist, userReviews } = useAppData();
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState(profile);
  const [message, setMessage] = useState('');

  const submitProfile = (event) => {
    event.preventDefault();
    setProfile({ userName: form.userName.trim(), email: form.email.trim() });
    setMessage('Your profile preferences have been saved on this device.');
  };

  return (
    <main className="content">
      <header className="page-header">
        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>My Profile</h1>
          <p>Manage your demo profile and see your collection at a glance.</p>
        </div>
      </header>

      <section className="profile-summary panel">
        <div className="profile-avatar" aria-hidden="true">
          {profile.userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
        </div>
        <div>
          <span className="eyebrow">{isAuthenticated ? 'SIGNED-IN ACCOUNT' : 'DEMO ACCOUNT'}</span>
          <h2>{profile.userName}</h2>
          <p>{profile.email}</p>
        </div>
      </section>

      <section className="profile-stats">
        <Link className="stat-card" to="/watchlist">
          <span className="stat-icon" aria-hidden="true">♡</span>
          <span className="stat-value">{watchlist.length}</span>
          <span className="stat-label">Movies saved</span>
        </Link>
        <Link className="stat-card" to="/my-reviews">
          <span className="stat-icon" aria-hidden="true">✎</span>
          <span className="stat-value">{userReviews.length}</span>
          <span className="stat-label">Reviews written</span>
        </Link>
      </section>

      <section className="panel profile-edit">
        <div className="section-heading">
          <div>
            <span className="eyebrow">LOCAL PROFILE PREFERENCES</span>
            <h2>Edit profile</h2>
          </div>
        </div>
        <form className="form-grid" onSubmit={submitProfile}>
          <div>
            <label htmlFor="profile-username">Username</label>
            <input
              id="profile-username"
              type="text"
              minLength="2"
              maxLength="40"
              value={form.userName}
              onChange={(event) => setForm({ ...form, userName: event.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="profile-email">Email</label>
            <input
              id="profile-email"
              type="email"
              maxLength="254"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          {message && <p className="success-message form-span" role="status">{message}</p>}
          <div className="form-span">
            <button className="button button-primary" type="submit">Save Changes</button>
          </div>
        </form>
        <p className="form-note">
          These preferences are saved only in this browser; the API does not yet
          provide an authenticated profile-editing endpoint.
        </p>
      </section>
    </main>
  );
}

export default Profile;
