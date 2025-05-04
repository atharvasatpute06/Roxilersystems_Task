import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [storeSearch, setStoreSearch] = useState('');
  const [userSortField, setUserSortField] = useState(null);
  const [storeSortField, setStoreSortField] = useState(null);
  const [userSortAsc, setUserSortAsc] = useState(true);
  const [storeSortAsc, setStoreSortAsc] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const loadAllData = async () => {
    try {
      const resUsers = await fetch('http://localhost:5000/api/users');
      const usersData = await resUsers.json();
      setUsers(usersData);
      setStats(prev => ({ ...prev, users: usersData.length }));

      const resStores = await fetch('http://localhost:5000/api/stores');
      const storesData = await resStores.json();
      setStores(storesData);
      setStats(prev => ({ ...prev, stores: storesData.length }));

      setStats(prev => ({ ...prev, ratings: 25 })); // placeholder
    } catch (err) {
      console.error('❌ Failed to load data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newUser = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      address: formData.get('address'),
      role: formData.get('role')
    };

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert('✅ User added!');
        e.target.reset();
        loadAllData();
      }
    } catch (err) {
      console.error('Add user error:', err);
      alert('Something went wrong.');
    }
  };

  const handleUserSort = (field) => {
    const asc = field === userSortField ? !userSortAsc : true;
    const sorted = [...users].sort((a, b) =>
      asc ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field])
    );
    setUsers(sorted);
    setUserSortField(field);
    setUserSortAsc(asc);
  };

  const handleStoreSort = (field) => {
    const asc = field === storeSortField ? !storeSortAsc : true;
    const sorted = [...stores].sort((a, b) => {
      if (typeof a[field] === 'number') return asc ? a[field] - b[field] : b[field] - a[field];
      return asc ? a[field].localeCompare(b[field]) : b[field].localeCompare(a[field]);
    });
    setStores(sorted);
    setStoreSortField(field);
    setStoreSortAsc(asc);
  };

  const filteredUsers = users.filter(u =>
    Object.values(u).some(val =>
      String(val).toLowerCase().includes(userSearch.toLowerCase())
    )
  );

  const filteredStores = stores.filter(s =>
    Object.values(s).some(val =>
      String(val).toLowerCase().includes(storeSearch.toLowerCase())
    )
  );

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh', color: '#222' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '28px' }}>Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#d9534f',
            color: '#fff',
            border: 'none',
            padding: '10px 16px',
            cursor: 'pointer',
            borderRadius: '6px'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', margin: '2rem 0' }}>
        <div style={statBoxStyle}>👤 <strong>{stats.users}</strong><br />Users</div>
        <div style={statBoxStyle}>🏪 <strong>{stats.stores}</strong><br />Stores</div>
        <div style={statBoxStyle}>⭐ <strong>{stats.ratings}</strong><br />Ratings</div>
      </div>

      <section style={cardSectionStyle}>
        <h2 style={cardTitleStyle}>Add New User</h2>
        <form onSubmit={handleAddUser} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <input name="name" placeholder="Name" required style={inputStyle} />
          <input name="email" placeholder="Email" type="email" required style={inputStyle} />
          <input name="password" placeholder="Password" type="password" required style={inputStyle} />
          <input name="address" placeholder="Address" required style={inputStyle} />
          <select name="role" required style={inputStyle}>
            <option value="">Select Role</option>
            <option value="user">Normal User</option>
            <option value="store">Store Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            style={{
              ...inputStyle,
              backgroundColor: '#28a745',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            Add User
          </button>
        </form>
      </section>

      <section style={cardSectionStyle}>
        <h2 style={cardTitleStyle}>All Users</h2>
        <input
          placeholder="Search users..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
          style={searchStyle}
        />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th onClick={() => handleUserSort('name')}>Name</th>
              <th onClick={() => handleUserSort('email')}>Email</th>
              <th onClick={() => handleUserSort('address')}>Address</th>
              <th onClick={() => handleUserSort('role')}>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={cardSectionStyle}>
        <h2 style={cardTitleStyle}>All Stores</h2>
        <input
          placeholder="Search stores..."
          value={storeSearch}
          onChange={(e) => setStoreSearch(e.target.value)}
          style={searchStyle}
        />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th onClick={() => handleStoreSort('name')}>Name</th>
              <th onClick={() => handleStoreSort('email')}>Email</th>
              <th onClick={() => handleStoreSort('address')}>Address</th>
              <th onClick={() => handleStoreSort('rating')}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{s.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const statBoxStyle = {
  background: '#ffffff',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  minWidth: '150px',
  textAlign: 'center',
  fontSize: '18px',
  color: '#333'
};

const cardSectionStyle = {
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  marginBottom: '2rem'
};

const cardTitleStyle = {
  marginBottom: '1rem',
  fontSize: '20px',
  color: '#222'
};

const inputStyle = {
  padding: '10px',
  minWidth: '180px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const searchStyle = {
  width: '100%',
  padding: '8px',
  marginBottom: '1rem',
  borderRadius: '4px',
  border: '1px solid #aaa'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left'
};

export default AdminDashboard;
