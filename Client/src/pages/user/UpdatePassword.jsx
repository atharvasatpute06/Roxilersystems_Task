import { useState } from 'react';

const UpdatePassword = ({ userId }) => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage('✅ Password updated successfully!');
      }
    } catch (error) {
      console.error('Update failed:', error);
      setMessage('Something went wrong.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '290%',
      background: 'linear-gradient(to right, #f1f7ff, #e4ecf8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        padding: '2rem 3rem',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        margintop: '200px',
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#003366' }}>Update Password</h2>

        {message && (
          <p style={{ color: message.includes('successfully') ? 'green' : 'red', marginBottom: '1rem' }}>
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          <button type="submit" style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#0077cc',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
