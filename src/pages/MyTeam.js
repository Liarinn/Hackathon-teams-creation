import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { teamAPI } from '../services/apiClient';

export default function MyTeam() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await teamAPI.getProjectTeams(projectId);
        setTeamData(data);
      } catch (err) {
        console.error('Error fetching team:', err);
        setError(err.message);
        // Fallback to mock data
        setTeamData({
          projectId,
          projectName: `Project ${projectId}`,
          teamName: 'My Team',
          status: 'Accepted',
          members: [
            { name: 'You', role: 'Member' },
            { name: 'Teammate 1', role: 'Member' },
          ],
          ideaTitle: 'Project idea',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [projectId]);

  if (loading) {
    return <div className="loading">Loading your team...</div>;
  }

  if (error) {
    return (
      <main className="section">
        <div className="container">
          <p className="error-message">Error loading team: {error}</p>
          <button onClick={() => navigate('/my-applications')} className="btn">Back to Applications</button>
        </div>
      </main>
    );
  }

  if (!teamData) {
    return (
      <main className="section">
        <div className="container">
          <p className="loading">Team not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">My Team</h1>
        <p className="dashboard-subtitle">{teamData.projectName}</p>

        <div className="team-card">
          <div className="team-header">
            <h2>Team: {teamData.teamName}</h2>
            <span className="status-accepted">Accepted</span>
          </div>

          {teamData.ideaTitle && (
            <div className="idea-box">
              <strong>Project Idea:</strong> {teamData.ideaTitle}
            </div>
          )}

          <h3>Team Members</h3>
          <div className="team-members-list">
            {teamData.members.map((member, index) => (
              <div key={index} className="team-member-item">
                <span>{member.name}</span>
                <span className="member-role">{member.role}</span>
              </div>
            ))}
          </div>
        </div>

        <button 
          className="btn-outline" 
          onClick={() => navigate('/my-applications')}
          style={{ marginTop: '30px' }}
        >
          Back to My Applications
        </button>
      </div>
    </main>
  );
}