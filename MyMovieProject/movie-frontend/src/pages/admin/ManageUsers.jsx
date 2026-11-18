import { useMemo, useState } from 'react';
import { useAppData } from '../../hooks/useAppData';

function ManageUsers() {
  const { users, reviews, updateUser } = useAppData();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const selectedUser = users.find((user) => user.id === selectedId);
  const filteredUsers = useMemo(() => users.filter((user) => (
    `${user.userName} ${user.email}`.toLowerCase().includes(query.toLowerCase())
  )), [users, query]);

  const changeRole = (user, role) => {
    updateUser(user.id, { role });
    setMessage(`${user.userName}'s demo role changed to ${role}.`);
  };

  const toggleEnabled = (user) => {
    updateUser(user.id, { enabled: !user.enabled });
    setMessage(`${user.userName} is now ${user.enabled ? 'disabled' : 'enabled'} in this demo.`);
  };

  return (
    <main className="content portal-content">
      <header className="page-header">
        <div><span className="eyebrow">PEOPLE</span><h1>Manage users</h1><p>Review demo accounts and preview role-management controls.</p></div>
        <span className="result-count">{users.length} accounts</span>
      </header>
      <p className="demo-data-notice">Demo only: role changes and account status are local UI state. They do not grant API access.</p>
      {message && <p className="success-message" role="status">{message}</p>}
      {selectedUser && (
        <section className="admin-panel user-detail-panel">
          <div className="admin-panel-heading">
            <div><span className="eyebrow">ACCOUNT DETAILS</span><h2>{selectedUser.userName}</h2></div>
            <button className="icon-button" aria-label="Close user details" onClick={() => setSelectedId(null)}>×</button>
          </div>
          <dl className="user-detail-grid">
            <div><dt>Email</dt><dd>{selectedUser.email}</dd></div>
            <div><dt>Demo role</dt><dd>{selectedUser.role}</dd></div>
            <div><dt>Joined</dt><dd>{new Date(selectedUser.joinedAt).toLocaleDateString()}</dd></div>
            <div><dt>Reviews</dt><dd>{reviews.filter((review) => review.userId === selectedUser.id).length}</dd></div>
            <div><dt>Status</dt><dd>{selectedUser.enabled ? 'Enabled (demo)' : 'Disabled (demo)'}</dd></div>
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
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><strong>{user.userName}</strong></td>
                  <td>{user.email}</td>
                  <td><label className="visually-hidden" htmlFor={`role-${user.id}`}>Change role for {user.userName}</label><select className="table-select" id={`role-${user.id}`} value={user.role} onChange={(event) => changeRole(user, event.target.value)}><option>User</option><option>Author</option><option>Admin</option></select></td>
                  <td><span className={`status-pill${user.enabled ? ' status-enabled' : ' status-disabled'}`}>{user.enabled ? 'Enabled' : 'Disabled'}</span></td>
                  <td className="table-secondary">{new Date(user.joinedAt).toLocaleDateString()}</td>
                  <td><div className="table-actions"><button className="table-action" onClick={() => setSelectedId(user.id)}>View</button><button className="table-action" onClick={() => toggleEnabled(user)}>{user.enabled ? 'Disable' : 'Enable'}</button></div></td>
                </tr>
              ))}
              {!filteredUsers.length && <tr><td colSpan="6" className="table-empty">No users match your search.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default ManageUsers;
