import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/apiClient';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    role: '', // 'participant' or 'organizer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.role) {
      setError("Please select your role (Participant or Organizer)");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        UserName: form.username,
        Password: form.password,
        ...(form.role === 'participant' && { Email: form.email }),
      };

      const response = await authAPI.signup(form.role, userData);
      
      if (response) {
        // If signup returns a token, auto-login
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', form.role);
          localStorage.setItem('username', form.username);
          navigate('/dashboard');
        } else {
          // Otherwise, redirect to login
          alert('Account created successfully! Please log in.');
          navigate('/login');
        }
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section">
      <div className="container">
        <div className="auth-wrapper">
          <h1 className="title-1">Create Account</h1>

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

              {form.role === 'participant' && (
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="role-selection">
                <div className="role-options">
                  <div
                    className={`role-box ${form.role === 'participant' ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, role: 'participant' })}
                  >
                    Participant
                  </div>
                  <div
                    className={`role-box ${form.role === 'organizer' ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, role: 'organizer' })}
                  >
                    Organizer
                  </div>
                </div>
              </div>

              {error && <p className="error-message">{error}</p>}

              <button 
                type="submit" 
                className="btn" 
                style={{ width: '100%', marginTop: '32px' }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-link">
              Already have an account? <a href="/login">Log In</a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}