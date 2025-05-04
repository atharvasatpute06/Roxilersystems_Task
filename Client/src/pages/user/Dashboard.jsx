import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userId = location.state?.userId;

  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    if (!userId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/stores/all-with-ratings?userId=${userId}`);
      const data = await res.json();
      if (Array.isArray(data)) setStores(data);
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [userId]);

  const handleRatingChange = async (storeId, newRating) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, storeId, rating: newRating }),
      });

      const data = await res.json();
      if (!data.error) {
        alert('Rating updated!');
        fetchStores();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Something went wrong.');
    }
  };

  const handlePasswordUpdate = () => {
    navigate('/user/update-password', { state: { userId } });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredStores = stores.filter((store) =>
    store.name?.toLowerCase().includes(search.toLowerCase()) ||
    store.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '120%',
      background: '#f0f4f8',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#333' }}>User Dashboard</h2>
        <div>
          <button onClick={handlePasswordUpdate} style={{
            marginRight: '1rem',
            padding: '0.5rem 1rem',
            background: '#0077cc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Change Password</button>
          <button onClick={handleLogout} style={{
            padding: '0.5rem 1rem',
            background: '#cc0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Logout</button>
        </div>
      </div>

      <input
        placeholder="Search store by name or address..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '0.6rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          color: '#333',
          fontSize: '1rem'
        }}
      />

      {loading ? (
        <p>Loading stores...</p>
      ) : filteredStores.length === 0 ? (
        <p>No stores found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: '#333'
          }}>
            <thead style={{ backgroundColor: '#0077cc', color: 'white' }}>
              <tr>
                <th style={{ padding: '12px' }}>Store Name</th>
                <th style={{ padding: '12px' }}>Address</th>
                <th style={{ padding: '12px' }}>Overall Rating</th>
                <th style={{ padding: '12px' }}>Your Rating</th>
                <th style={{ padding: '12px' }}>Rate</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id} style={{ textAlign: 'center' }}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{store.name}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{store.address}</td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {store.average_rating !== null ? Number(store.average_rating).toFixed(1) : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    {store.user_rating ?? '-'}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>
                    <select
                      value={store.user_rating ?? ''}
                      onChange={(e) => handleRatingChange(store.id, Number(e.target.value))}
                      style={{ padding: '0.4rem', borderRadius: '4px' }}
                    >
                      <option value="">--Rate--</option>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
