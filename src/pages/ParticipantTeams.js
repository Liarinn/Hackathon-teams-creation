import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ParticipantTeams() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [noTeamParticipants, setNoTeamParticipants] = useState([]);

  useEffect(() => {
    // Mock data – replace with real API call
    setTeams([
      { id: 1, name: "Quantum Builders", members: ["Anna Popescu", "Ion Rusu", "Maria Ionescu"] },
      { id: 2, name: "Code Horizon", members: ["Alexandru Munteanu", "Elena Dumitru"] },
    ]);
    setNoTeamParticipants([
      "Andrei Vasile",
      "Cristina Marin",
      "Mihai Popa",
    ]);
  }, [projectId]);

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">Project Participants</h1>

        <div className="tabs-row">
          <button className="tab-btn active">Teams</button>
          <button
            className="tab-btn"
            onClick={() => navigate(`/participants/${projectId}/list`)}
          >
            Participants
          </button>
          <button className="tab-btn">Create Teams</button>
        </div>

        <div className="teams-grid">
          {teams.map((team, index) => (
            <div key={team.id} className="team-card">
              <div className="team-number">#{index + 1}</div>
              <h3 className="team-name">{team.name}</h3>
              <div className="team-members">
                {team.members.map((member, i) => (
                  <div key={i} className="team-member">{member}</div>
                ))}
              </div>
            </div>
          ))}

          <div className="team-card no-team">
            <div className="team-name no-team-title">Participants without team</div>
            <div className="team-members">
              {noTeamParticipants.map((p, i) => (
                <div key={i} className="team-member no-team-member">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}