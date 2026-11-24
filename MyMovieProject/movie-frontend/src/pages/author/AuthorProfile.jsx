import { useState } from 'react';
import { useAppData } from '../../hooks/useAppData';

function AuthorProfile() {
  const { authorProfile, setAuthorProfile, catalogMovies } = useAppData();
  const [form, setForm] = useState(authorProfile);
  const [message, setMessage] = useState('');

  const saveProfile = (event) => {
    event.preventDefault();
    setAuthorProfile({
      userName: form.userName.trim(),
      email: form.email.trim(),
      biography: form.biography.trim()
    });
    setMessage('Author demo profile saved on this device.');
  };

  return (
    <main className="content portal-content author-content">
      <header className="page-header">
        <div><span className="eyebrow">MOVIE STUDIO</span><h1>Author profile</h1><p>Manage your demo author identity and biography.</p></div>
        <span className="result-count">{catalogMovies.length} movies</span>
      </header>
      <p className="demo-data-notice author-notice">Profile details are saved on this device. Your account role is controlled by the backend.</p>
      <section className="profile-summary panel author-profile-summary">
        <div className="profile-avatar author-avatar" aria-hidden="true">{form.userName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</div>
        <div><span className="eyebrow">DEMO AUTHOR</span><h2>{form.userName}</h2><p>{form.email}</p><p className="author-bio">{form.biography || 'No biography added yet.'}</p></div>
      </section>
      <section className="admin-panel author-profile-form">
        <div className="admin-panel-heading"><div><span className="eyebrow">YOUR DETAILS</span><h2>Edit profile</h2></div></div>
        <form className="admin-form-fields" onSubmit={saveProfile}>
          <div className="form-field"><label htmlFor="author-username">Username</label><input id="author-username" value={form.userName} minLength="2" maxLength="40" onChange={(event) => setForm({ ...form, userName: event.target.value })} required /></div>
          <div className="form-field"><label htmlFor="author-email">Email</label><input id="author-email" type="email" value={form.email} maxLength="254" onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
          <div className="form-field"><label htmlFor="author-biography">Biography</label><textarea id="author-biography" rows="5" maxLength="500" value={form.biography} onChange={(event) => setForm({ ...form, biography: event.target.value })} placeholder="Tell readers a little about yourself." /></div>
          {message && <p className="success-message" role="status">{message}</p>}
          <button className="button button-primary" type="submit">Save Profile</button>
        </form>
      </section>
    </main>
  );
}

export default AuthorProfile;
