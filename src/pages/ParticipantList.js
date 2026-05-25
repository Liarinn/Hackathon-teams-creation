import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { downloadParticipantsExcel } from '../utils/downloadParticipantsExcel';
import { dashboardAPI } from '../services/apiClient';

export default function ParticipantList() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [noTeam, setNoTeam] = useState([]);
  const [withTeam, setWithTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const data = await dashboardAPI.getParticipants(projectId);

        const withTeams    = Array.isArray(data?.participantsWithTeams)    ? data.participantsWithTeams    : [];
        const withoutTeams = Array.isArray(data?.participantsWithoutTeams) ? data.participantsWithoutTeams : [];

        setWithTeam(withTeams);
        setNoTeam(withoutTeams);
        setError(null);
      } catch (err) {
        console.error('Error fetching participants:', err);
        setError(err.message);
        setNoTeam([
          { firstName: 'Andrei',   lastName: 'Vasile', teamName: '' },
          { firstName: 'Cristina', lastName: 'Marin',  teamName: '' },
        ]);
        setWithTeam([
          { firstName: 'Anna',       lastName: 'Popescu',   teamName: 'Quantum Builders' },
          { firstName: 'Ion',        lastName: 'Rusu',      teamName: 'Quantum Builders' },
          { firstName: 'Alexandru',  lastName: 'Munteanu',  teamName: 'Code Horizon' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [projectId]);

  const allParticipants = [...noTeam, ...withTeam];

  const handleDownloadExcel = () => {
    downloadParticipantsExcel(allParticipants, projectId);
  };

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="title-1">Project Participants</h1>
          <button
            onClick={handleDownloadExcel}
            disabled={loading || allParticipants.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading || allParticipants.length === 0 ? 'not-allowed' : 'pointer',
              opacity: loading || allParticipants.length === 0 ? 0.5 : 1,
              fontSize: '14px',
            }}
          >
            {loading ? 'Loading...' : 'Download Excel'}
          </button>
        </div>

        <div className="tabs-row">
          <button
            className="tab-btn"
            onClick={() => navigate(`/participants/${projectId}`)}
          >
            Teams
          </button>
          <button className="tab-btn active">Participants</button>
          <button
            className="tab-btn"
            onClick={() => navigate(`/create-teams/${projectId}?returnTo=list`)}
          >
            Create Teams
          </button>
        </div>

        {error && <div style={{ color: 'red', margin: '10px 0' }}>Error: {error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>Loading participants...</div>
        ) : (
          <div className="participants-table">
            <div className="table-header">
              <div>#</div>
              <div>Name</div>
              <div>Team</div>
            </div>

            {allParticipants.map((p, index) => (
              <div
                key={index}
                className={`table-row ${!p.teamName ? 'no-team-row' : ''}`}
              >
                <div>{index + 1}</div>
                <div>{p.firstName} {p.lastName}</div>
                <div className={!p.teamName ? 'no-team-cell' : ''}>
                  {p.teamName || '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}