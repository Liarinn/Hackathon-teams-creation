import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ParticipantList() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [noTeam, setNoTeam] = useState([]);
  const [withTeam, setWithTeam] = useState([]);

  useEffect(() => {
    // Mock
    setNoTeam([
      { name: "Andrei Vasile", surname: "", team: "" },
      { name: "Cristina Marin", surname: "", team: "" },
    ]);
    setWithTeam([
      { name: "Anna", surname: "Popescu", team: "Quantum Builders" },
      { name: "Ion", surname: "Rusu", team: "Quantum Builders" },
      { name: "Alexandru", surname: "Munteanu", team: "Code Horizon" },
    ]);
  }, [projectId]);

  const allParticipants = [...noTeam, ...withTeam];

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">Project Participants</h1>

        <div className="tabs-row">
          <button
            className="tab-btn"
            onClick={() => navigate(`/participants/${projectId}`)}
          >
            Teams
          </button>
          <button className="tab-btn active">Participants</button>
          <button className="tab-btn">Create Teams</button>
        </div>

        <div className="participants-table">
          <div className="table-header">
            <div>#</div>
            <div>Name</div>
            <div>Team</div>
          </div>

          {allParticipants.map((p, index) => (
            <div
              key={index}
              className={`table-row ${!p.team ? 'no-team-row' : ''}`}
            >
              <div>{index + 1}</div>
              <div>{p.name} {p.surname}</div>
              <div className={!p.team ? 'no-team-cell' : ''}>
                {p.team || '—'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}