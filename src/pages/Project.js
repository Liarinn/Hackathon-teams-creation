import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    // TODO: fetch single project
    setTimeout(() => {
      setProject({
        projectId: id,
        projectName: `Demo Project ${id}`,
        minNrParticipants: 3,
        maxNrParticipants: 7,
        questions: [
          { questionNumber: 1, questionType: 'text', question: 'Motivation letter' },
          { questionNumber: 2, questionType: 'checkbox', question: 'Skills you have' },
        ],
      });
    }, 400);
  }, [id]);

  if (!project) return <div className="loading">Loading...</div>;

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">{project.projectName}</h1>

        {(project.minNrParticipants || project.maxNrParticipants) && (
          <p style={{ fontSize: '1.2rem', margin: '0 0 32px' }}>
            Team size: {project.minNrParticipants || '?'} – {project.maxNrParticipants || '?'} members
          </p>
        )}

        <h2 className="title-2">Application Questions</h2>

        <ol className="question-list">
          {project.questions.map((q) => (
            <li key={q.questionNumber} className="question-list-item">
              <strong>{q.question}</strong>
              <span className="question-type">({q.questionType})</span>
            </li>
          ))}
        </ol>

        <a href={`/apply/${id}`} className="btn" style={{ marginTop: '40px' }}>
          Apply to this project →
        </a>
      </div>
    </main>
  );
}