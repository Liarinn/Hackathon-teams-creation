import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectAPI } from '../services/apiClient';

export default function Project() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectAPI.getProjectById(id);
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
        // Fallback mock data
        setProject({
          projectId: id,
          projectName: `Project ${id}`,
          minNrParticipants: 3,
          maxNrParticipants: 7,
          formQuestions: [
            { questionNumber: 1, questionType: 'TEXT', question: 'Motivation letter' },
            { questionNumber: 2, questionType: 'CHECKBOX', question: 'Skills you have' },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="loading">Loading project...</div>;
  if (error) return <div className="error-message">Error loading project: {error}</div>;
  if (!project) return <div className="loading">Project not found</div>;

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
          {(project.formQuestions || project.questions || []).map((q) => (
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