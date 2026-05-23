import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiClient';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(form.username, form.password);
      const token = response.Token;          
      if (token) {
        // Store token and user info
        localStorage.setItem('token', token);
        
        // Extract role from JWT token (assuming it's in the payload)
        // For now, store the response role or deduce it from token
        const roles = response.roles || [];
        const role = roles[0]?.toLowerCase() || 'participant';
        localStorage.setItem('role', role);
        localStorage.setItem('username', form.username);
        
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="auth-wrapper">
          <h1 className="title-1">Log In</h1>

          <div className="auth-card">
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>

              {error && <p className="error-message">{error}</p>}

              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', marginTop: '24px' }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="auth-link">
              Don't have an account? <a href="/signup">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}