import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/apiClient';

export default function MyApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    if (savedRole !== 'participant') {
      navigate('/dashboard');
      return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await applicationAPI.getMyApplications();
        setApplications(Array.isArray(data) ? data : data.applications || []);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.message);
        // Fallback to empty applications
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Accepted': return 'status-accepted';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <p className="loading">Loading your applications...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="title-1">My Applications</h1>
          <p className="dashboard-subtitle">Track the status of your project applications</p>
        </div>

        {loading ? (
          <p className="loading">Loading your applications...</p>
        ) : error ? (
          <p className="error-message">Error loading applications. Please try again later.</p>
        ) : applications.length === 0 ? (
          <p className="loading">No applications yet. <Link to="/projects">Browse projects</Link></p>
        ) : (
          <div className="applications-grid">
            {applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <h3 className="application-title">{app.projectName}</h3>
                  <span className={`status-badge ${getStatusClass(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="application-meta">
                  <p><strong>Type:</strong> {app.registrationType === 'A' ? 'Idea-based (A)' : 'Team Registration (B)'}</p>
                  <p><strong>Date Applied:</strong> {app.dateApplied}</p>
                  {app.hasTeam && <p><strong>Team:</strong> {app.teamName}</p>}
                </div>

                <div className="application-actions">
                  {/* My Team button on the LEFT - same style as View Project */}
                  {app.hasTeam && (
                    <Link to={`/my-team/${app.projectId}`} className="btn">
                      My Team
                    </Link>
                  )}

                  {/* View Project button on the RIGHT */}
                  <Link to={`/project/${app.projectId}`} className="btn">
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}