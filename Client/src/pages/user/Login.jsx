import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    const { email, password } = form;
    if (!email || !password) return 'All fields are required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) return setError(errorMsg);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.error) return setError(data.error);

      const { id, role } = data.user;
      if (role === 'admin') navigate('/admin/dashboard', { state: { userId: id } });
      else if (role === 'store') navigate('/store/dashboard', { state: { userId: id } });
      else navigate('/user/dashboard', { state: { userId: id } });
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>Login</h2>
        {error && <p style={errorStyle}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />
          <button type="submit" style={buttonStyle}>Login</button>
        </form>

        <button onClick={goToSignup} style={linkButtonStyle}>
          Don’t have an account? Signup
        </button>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  minHeight: '100vh',
  width: '190vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(to right,rgb(189, 192, 206),rgb(207, 202, 212))',
  padding: '1rem',
};

const cardStyle = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: '400px',
  alignItems: 'center',
  marginBottom: '100px',
};

const titleStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#333',
};

const errorStyle = {
  color: '#d9534f',
  textAlign: 'center',
  marginBottom: '1rem',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '1rem',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px',
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

const linkButtonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'transparent',
  color: '#007bff',
  border: 'none',
  textAlign: 'center',
  marginTop: '1rem',
  cursor: 'pointer',
  fontSize: '14px',
};

export default Login;
