import { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validate = () => {
    const { name, email, address, password } = form;

    if (name.length < 2 || name.length > 20) return 'Name must be between 2 and 20 characters.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
    if (address.length > 400) return 'Address cannot exceed 400 characters.';
    if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/.test(password))
      return 'Password must be 8–16 characters, with 1 uppercase & 1 special character.';

    return '';
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();

    if (errorMsg) {
      setError(errorMsg);
      setSuccess('');
    } else {
      setError('');

      try {
        const res = await fetch('http://localhost:5000/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, role: 'user' })
        });

        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setSuccess('');
        } else {
          setSuccess('Signup successful!');
          setForm({ name: '', email: '', address: '', password: '' });
        }
      } catch (err) {
        console.error('Signup failed:', err);
        setError('Something went wrong.');
        setSuccess('');
      }
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Signup</h2>
        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} style={inputStyle} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} style={inputStyle} />
          <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} style={inputStyle} />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />

          <button type="submit" style={buttonStyle}>Register</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Already have an account? <Link to="/" style={{ color: '#007bff' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

// ✅ Styles
const pageStyle = {
  height: '100vh',
  width: '255%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg,rgb(221, 228, 227),rgb(225, 226, 231))',
  padding: '1rem',
};

const cardStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  maxWidth: '400px',
  width: '100%',
  
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1rem',
  color: '#333',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '15px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
};

const errorStyle = {
  color: '#d9534f',
  textAlign: 'center',
  marginBottom: '1rem',
};

const successStyle = {
  color: 'green',
  textAlign: 'center',
  marginBottom: '1rem',
};

export default Signup;
