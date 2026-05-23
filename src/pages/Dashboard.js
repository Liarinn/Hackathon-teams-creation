import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('User');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username') || 'User';

    if (!savedRole) {
      navigate('/login');
      return;
    }

    setRole(savedRole);
    setUsername(savedUsername);
  }, [navigate]);

  if (!role) {
    return (
      <main className="section">
        <div className="container">
          <p className="loading">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="title-1">Welcome back, {username}!</h1>
          <p className="dashboard-subtitle">
            You are logged in as <strong>{role === 'organizer' ? 'Organizer' : 'Participant'}</strong>
          </p>
        </div>

        <div className="dashboard-cards">
          {role === 'organizer' ? (
            /* Organizer View */
            <>
              <div className="dashboard-card">
                <h2>My Projects</h2>
                <p>Manage your events, registration forms, and participant teams.</p>
                <Link to="/projects" className="btn">
                  Go to My Projects
                </Link>
              </div>

              <div className="dashboard-card">
                <h2>Create New Project</h2>
                <p>Start a new event and build your registration form.</p>
                <Link to="/new-project" className="btn">
                  Create Project
                </Link>
              </div>
            </>
          ) : (
            /* Participant View */
            <>
              <div className="dashboard-card">
                <h2>My Applications</h2>
                <p>Track the events you have applied to and their status.</p>
                <Link to="/my-applications" className="btn">
                  View My Applications
                </Link>
              </div>

              <div className="dashboard-card">
                <h2>My Profile</h2>
                <p>Update your information and skills.</p>
                <Link to="/profile" className="btn">
                  Edit Profile
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}