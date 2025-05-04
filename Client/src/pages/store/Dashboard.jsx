import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StoreDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const storeId = location.state?.userId;

  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState('0.0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchRatings = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/store/ratings/${storeId}`);
        const data = await res.json();

        if (data.ratings) setRatings(data.ratings);
        if (data.average) setAverage(data.average);
      } catch (err) {
        console.error('Error fetching store ratings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [storeId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handlePasswordUpdate = () => {
    navigate('/store/update-password', { state: { userId: storeId } });
  };

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '150%',
      background: 'linear-gradient(to right, #f9f9f9, #e9f0f7)',
      padding: '2rem 4rem',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#222'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '2rem', color: '#003366' }}>Store Owner Dashboard</h2>
        <div>
          <button
            onClick={handlePasswordUpdate}
            style={{
              marginRight: '1rem',
              padding: '0.6rem 1.2rem',
              background: '#0056b3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Update Password
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.6rem 1.2rem',
              background: '#d9534f',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{
        background: '#fff',
        padding: '1.5rem 2rem',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#0077cc' }}>⭐ Average Rating: {average}</h3>

        <h3 style={{ marginBottom: '1rem' }}>Ratings Received</h3>
        {loading ? (
          <p>Loading...</p>
        ) : ratings.length === 0 ? (
          <p>No ratings received yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #ccc',
              fontSize: '1rem',
              backgroundColor: '#fff'
            }}>
              <thead style={{ backgroundColor: '#0077cc', color: '#fff' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Rating</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{r.user}</td>
                    <td style={{ padding: '12px' }}>{r.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDashboard;
