import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/auth/register
    console.log('Sign up attempt:', form);
    setTimeout(() => navigate('/login'), 800);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="auth-container">
          <h1 className="title-1">Sign Up</h1>
          <p className="auth-subtitle">Create an account to start managing projects</p>

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

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '24px' }}>
              Create Account
            </button>

            <p className="auth-link">
              Already have an account? <a href="/login">Log In</a>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}