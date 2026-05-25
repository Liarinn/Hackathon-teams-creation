import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { dashboardAPI, teamAPI } from '../services/apiClient';
import { downloadParticipantsExcel } from '../utils/downloadParticipantsExcel';

export default function CreateTeams() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('view'); // 'view', 'manual', 'auto'

  // Determine return page from query params
  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo') || 'teams'; // default to teams

  const [allParticipantsData, setAllParticipantsData] = useState([]);
  const [existingTeams, setExistingTeams] = useState([]);
  const [unassignedParticipants, setUnassignedParticipants] = useState([]);

  const [teamSize, setTeamSize] = useState(3);
  const [manualTeams, setManualTeams] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [currentTeamBuild, setCurrentTeamBuild] = useState([]);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [participantsData, teamsData] = await Promise.all([
        dashboardAPI.getParticipants(projectId),
        dashboardAPI.getTeams(projectId),
      ]);

      const withTeams    = Array.isArray(participantsData?.participantsWithTeams)    ? participantsData.participantsWithTeams    : [];
      const withoutTeams = Array.isArray(participantsData?.participantsWithoutTeams) ? participantsData.participantsWithoutTeams : [];

      const allParticipants = [...withTeams, ...withoutTeams];
      setAllParticipantsData(allParticipants);
      setExistingTeams(teamsData || []);

      // Calculate unassigned participants (those without a team)
      const unassigned = withoutTeams;
      setUnassignedParticipants(unassigned);
      setManualTeams([]);
      setSelectedParticipants({});
      setError(null);
    } catch (err) {
      console.error('Error loading teams data:', err);
      setError(err.message);
      // Fallback data
      setAllParticipantsData([
        { firstName: 'Andrei',       lastName: 'Vasile',    teamName: '' },
        { firstName: 'Cristina',     lastName: 'Marin',     teamName: '' },
        { firstName: 'Anna',         lastName: 'Popescu',   teamName: 'Quantum Builders' },
        { firstName: 'Ion',          lastName: 'Rusu',      teamName: 'Quantum Builders' },
        { firstName: 'Alexandru',    lastName: 'Munteanu',  teamName: 'Code Horizon' },
      ]);
      setExistingTeams([]);
      setUnassignedParticipants([
        { firstName: 'Andrei',   lastName: 'Vasile' },
        { firstName: 'Cristina', lastName: 'Marin' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleParticipantSelection = (participantId) => {
    setSelectedParticipants(prev => ({
      ...prev,
      [participantId]: !prev[participantId],
    }));
  };

  const addParticipantToCurrentTeam = (participantId) => {
    if (!currentTeamBuild.includes(participantId)) {
      setCurrentTeamBuild([...currentTeamBuild, participantId]);
    }
  };

  const removeParticipantFromCurrentTeam = (participantId) => {
    setCurrentTeamBuild(currentTeamBuild.filter(id => id !== participantId));
  };

  const completeTeamFormation = () => {
    if (currentTeamBuild.length === 0) {
      setError('Please select at least one participant for the team');
      return;
    }

    const newTeam = {
      id: Date.now(),
      members: currentTeamBuild.map(id => {
        const p = unassignedParticipants.find(participant => 
          (participant.id || participant.applicantId) === id
        );
        return p;
      }).filter(Boolean),
    };

    setManualTeams([...manualTeams, newTeam]);
    setCurrentTeamBuild([]);
    setError(null);
  };

  const removeTeamFromManualList = (teamId) => {
    setManualTeams(manualTeams.filter(team => team.id !== teamId));
  };

  const handleAutoCreateTeams = async () => {
    try {
      setSubmitting(true);
      setError(null);
      await dashboardAPI.autoCreateTeams(projectId);
      await loadData();
      setMode('view');
    } catch (err) {
      console.error('Error auto-creating teams:', err);
      setError(err.message || 'Failed to auto-create teams');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateManualTeams = async () => {
    try {
      setSubmitting(true);
      setError(null);

      for (const team of manualTeams) {
        await teamAPI.createTeam(projectId, {
          projectId: projectId,
          ideaTitle: `Team ${new Date().getTime()}`,
          roles: [],
          members: team.members.map(m => ({
            id: m.id || m.applicantId,
            firstName: m.firstName,
            lastName: m.lastName,
          })),
        });
      }

      await loadData();
      setMode('view');
      setManualTeams([]);
    } catch (err) {
      console.error('Error creating manual teams:', err);
      setError(err.message || 'Failed to create teams');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="section">
        <div className="container">
          <p className="loading">Loading teams data...</p>
        </div>
      </main>
    );
  }

  const handleDownloadExcel = () => {
    downloadParticipantsExcel(allParticipantsData, projectId);
  };

  return (
    <main className="section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className="title-1">Project Participants</h1>
          <button
            onClick={handleDownloadExcel}
            disabled={loading || allParticipantsData.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading || allParticipantsData.length === 0 ? 'not-allowed' : 'pointer',
              opacity: loading || allParticipantsData.length === 0 ? 0.5 : 1,
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
          <button
            className="tab-btn"
            onClick={() => navigate(`/participants/${projectId}/list`)}
          >
            Participants
          </button>
          <button className="tab-btn active">Create Teams</button>
        </div>

        {error && (
          <div className="error-message" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fee', borderRadius: '4px', color: '#c00' }}>
            {error}
          </div>
        )}

        {/* Existing Pre-formed Teams */}
        {existingTeams.length > 0 && (
          <div className="teams-section" style={{ marginBottom: '40px' }}>
            <h2 className="title-2">Pre-formed Teams (From Applications)</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              These teams were automatically created when participants selected each other during the application process.
            </p>
            <div className="teams-grid">
              {existingTeams.map((team, idx) => (
                <div key={team.id || idx} className="team-card">
                  <h3 style={{ marginTop: 0, marginBottom: '15px' }}>{team.ideaTitle || `Team ${idx + 1}`}</h3>
                  <ul style={{ margin: '0', paddingLeft: '20px' }}>
                    {(team.members || []).map((member, midx) => (
                      <li key={midx} className="team-member">
                        {member.firstName} {member.lastName}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mode Selection */}
        {mode === 'view' && (
          <div className="mode-selection" style={{ marginBottom: '40px' }}>
            <div>
              <h2 className="title-2">Unassigned Participants: {unassignedParticipants.length}</h2>
              {unassignedParticipants.length > 0 ? (
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                  <button
                    className="btn"
                    onClick={() => setMode('manual')}
                    style={{ flex: 1 }}
                  >
                    Manually Group Participants
                  </button>
                  <button
                    className="btn"
                    onClick={() => setMode('auto')}
                    style={{ flex: 1, backgroundColor: '#4CAF50' }}
                  >
                    Auto-Create Teams
                  </button>
                </div>
              ) : (
                <p style={{ color: '#666', marginTop: '10px' }}>
                  All participants are already assigned to teams.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Manual Team Creation */}
        {mode === 'manual' && unassignedParticipants.length > 0 && (
          <div className="manual-teams-section">
            <h2 className="title-2">Manually Create Teams</h2>

            {/* Current Team Building */}
            <div className="question-item" style={{ marginBottom: '30px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Build a Team ({currentTeamBuild.length} member{currentTeamBuild.length !== 1 ? 's' : ''})</h3>
              {currentTeamBuild.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Selected Members:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {currentTeamBuild.map(participantId => {
                      const p = unassignedParticipants.find(
                        participant => (participant.id || participant.applicantId) === participantId
                      );
                      return (
                        <div
                          key={participantId}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                            borderRadius: '4px',
                          }}
                        >
                          <span>
                            {p?.firstName} {p?.lastName}
                          </span>
                          <button
                            onClick={() => removeParticipantFromCurrentTeam(participantId)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '18px',
                              padding: 0,
                              lineHeight: 1,
                            }}
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <button
                className="btn"
                onClick={completeTeamFormation}
                disabled={currentTeamBuild.length === 0}
                style={{
                  backgroundColor: currentTeamBuild.length === 0 ? '#ccc' : '#4CAF50',
                  marginTop: '15px',
                }}
              >
                Complete Team
              </button>
            </div>

            {/* Available Participants */}
            <div style={{ marginBottom: '30px' }}>
              <h3>Available Participants</h3>
              <div className="participants-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {unassignedParticipants.map(participant => {
                  const id = participant.id || participant.applicantId;
                  const isInCurrentTeam = currentTeamBuild.includes(id);
                  const isInExistingTeam = manualTeams.some(team =>
                    team.members.some(m => (m.id || m.applicantId) === id)
                  );

                  if (isInExistingTeam) return null;

                  return (
                    <div
                      key={id}
                      onClick={() => addParticipantToCurrentTeam(id)}
                      style={{
                        padding: '15px',
                        backgroundColor: isInCurrentTeam ? 'var(--accent)' : 'var(--project-card-bg)',
                        color: isInCurrentTeam ? 'white' : 'var(--text-color)',
                        border: `1px solid ${isInCurrentTeam ? 'var(--accent)' : 'var(--black-border)'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={(e) => {
                        if (!isInCurrentTeam) {
                          e.currentTarget.style.backgroundColor = '#f0f0f0';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isInCurrentTeam) {
                          e.currentTarget.style.backgroundColor = 'var(--project-card-bg)';
                        }
                      }}
                    >
                      <p style={{ margin: 0, fontWeight: 500 }}>
                        {participant.firstName} {participant.lastName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Preview of Teams to be Created */}
            {manualTeams.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h3>Teams to Create ({manualTeams.length})</h3>
                {manualTeams.map((team, idx) => (
                  <div key={team.id} className="team-card" style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Team {idx + 1} ({team.members.length} members)</p>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {team.members.map((member, midx) => (
                            <li key={midx} className="team-member">
                              {member.firstName} {member.lastName}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <button
                        onClick={() => removeTeamFromManualList(team.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '24px',
                          color: '#d32f2f',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn"
                onClick={handleCreateManualTeams}
                disabled={manualTeams.length === 0 || submitting}
                style={{ flex: 1, backgroundColor: manualTeams.length === 0 ? '#ccc' : '#4CAF50' }}
              >
                {submitting ? 'Creating...' : `Create ${manualTeams.length} Team${manualTeams.length !== 1 ? 's' : ''}`}
              </button>
              <button
                onClick={() => {
                  setMode('view');
                  setManualTeams([]);
                  setCurrentTeamBuild([]);
                }}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
            </div>
          </div>

        )}

        {/* Auto Create Teams */}
        {mode === 'auto' && unassignedParticipants.length > 0 && (
          <div className="manual-teams-section">
            <h2 className="title-2">Auto-Create Teams</h2>
            <div className="question-item" style={{ marginBottom: '30px' }}>
              <p style={{ marginBottom: '15px' }}>
                This will automatically create teams of {teamSize} members each from the unassigned participants.
              </p>
              <label style={{ display: 'block', marginBottom: '15px' }}>
                <span style={{ fontWeight: 500 }}>Team Size:</span>
                <input
                  type="number"
                  min="2"
                  max={unassignedParticipants.length}
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e.target.value) || 3)}
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    padding: '12px 16px',
                    borderRadius: '6px',
                    border: '1px solid var(--black-border)',
                    backgroundColor: 'var(--project-card-bg)',
                    color: 'var(--text-color)',
                    fontSize: '16px',
                  }}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn"
                onClick={handleAutoCreateTeams}
                disabled={submitting}
                style={{ flex: 1, backgroundColor: '#4CAF50' }}
              >
                {submitting ? 'Creating...' : `Create Teams of ${teamSize}`}
              </button>
              <button
                onClick={() => setMode('view')}
                style={{
                  padding: '12px 28px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
