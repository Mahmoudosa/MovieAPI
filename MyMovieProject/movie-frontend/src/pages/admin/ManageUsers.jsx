import { useEffect, useMemo, useState } from 'react';
import { useAppData } from '../../hooks/useAppData';
import { useAuth } from '../../hooks/useAuth';
import { getUsers, updateUserRole } from '../../services/userService';

function ManageUsers() {
  const { reviews } = useAppData();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingUserId, setSavingUserId] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    getUsers({ signal: controller.signal })
      .then((result) => {
        setUsers((result ?? []).map((user) => ({
          id: user.id ?? user.Id,
          userName: user.userName ?? user.UserName ?? '',
          email: user.email ?? user.Email ?? '',
          role: user.role ?? user.Role ?? 'User'
        })));
        setError('');
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const selectedUser = users.find((user) => user.id === selectedId);
  const filteredUsers = useMemo(() => users.filter((user) => (
    `${user.userName} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  )), [users, query]);

  const changeRole = async (user, role) => {
    setSavingUserId(user.id);
    setError('');
    setMessage('');
    try {
      const updated = await updateUserRole(user.id, role);
      const savedRole = updated?.role ?? updated?.Role ?? role;
      setUsers((current) => current.map((item) => (
        item.id === user.id ? { ...item, role: savedRole } : item
      )));
      setMessage(`${user.userName}'s role was updated to ${savedRole}.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">PEOPLE</span><h1>Manage users</h1><p>Admins can assign User, Author, or Admin roles to other accounts.</p></div>
        <span className="result-count">{users.length} accounts</span>
      </header>
      <p className="muted-copy">Your own Admin role cannot be removed from this screen.</p>
      {loading && <p className="muted-copy" role="status">Loading registered users…</p>}
      {error && <p className="error-message" role="alert">{error}</p>}
      {message && <p className="success-message" role="status">{message}</p>}
      {selectedUser && (
        <section className="admin-panel user-detail-panel">
          <div className="admin-panel-heading">
            <div><span className="eyebrow">ACCOUNT DETAILS</span><h2>{selectedUser.userName}</h2></div>
            <button className="icon-button" aria-label="Close user details" onClick={() => setSelectedId(null)}>×</button>
          </div>
          <dl className="user-detail-grid">
            <div><dt>Email</dt><dd>{selectedUser.email}</dd></div>
            <div><dt>Role</dt><dd>{selectedUser.role}</dd></div>
            <div><dt>Reviews</dt><dd>{reviews.filter((review) => review.userId === selectedUser.id).length}</dd></div>
          </dl>
        </section>
      )}
      <section className="admin-panel">
        <div className="admin-toolbar">
          <div><span className="eyebrow">USER DIRECTORY</span><h2>{filteredUsers.length} matching users</h2></div>
          <label className="visually-hidden" htmlFor="user-search">Search username or email</label>
          <input className="toolbar-search" id="user-search" type="search" placeholder="Search username or email" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="table-scroll">
          <table className="admin-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan="4" className="table-empty" role="status">Loading users…</td></tr>}
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.userName}</strong></td>
                  <td>{user.email}</td>
                  <td><label className="visually-hidden" htmlFor={`role-${user.id}`}>Change role for {user.userName}</label><select className="table-select" id={`role-${user.id}`} value={user.role} disabled={savingUserId === user.id || Number(currentUser?.id) === Number(user.id)} onChange={(event) => changeRole(user, event.target.value)}><option>User</option><option>Author</option><option>Admin</option></select></td>
                  <td><div className="table-actions"><button className="table-action" onClick={() => setSelectedId(user.id)}>View</button></div></td>
                </tr>
              ))}
              {!loading && !error && !filteredUsers.length && <tr><td colSpan="4" className="table-empty">No users match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ManageUsers;
