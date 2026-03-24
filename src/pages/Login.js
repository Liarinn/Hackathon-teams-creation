import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/login - save token, redirect
    console.log('Login attempt:', form);
    
    setTimeout(() => navigate('/projects'), 800);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="auth-container">
          <h1 className="title-1">Log In</h1>
          <p className="auth-subtitle">Access your projects and manage applications</p>

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

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '24px' }}>
              Log In
            </button>

            <p className="auth-link">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}