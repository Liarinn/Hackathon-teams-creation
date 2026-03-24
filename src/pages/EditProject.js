import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: '',
    minNrParticipants: '',
    maxNrParticipants: '',
    questions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: real GET /api/projects/{id}
    setTimeout(() => {
      setForm({
        projectName: `Project ${id} (loaded)`,
        minNrParticipants: '2',
        maxNrParticipants: '5',
        questions: [
          { questionNumber: 1, questionType: 'text', question: 'Tell us about yourself' },
          { questionNumber: 2, questionType: 'file', question: 'Upload CV' },
        ],
      });
      setLoading(false);
    }, 700);
  }, [id]);

  // ... same addQuestion, updateQuestion, removeQuestion as in NewProject

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: PUT / PATCH request
    console.log('Updating project', id, form);
    alert('Project updated (mock)');
    navigate('/projects');
  };

  if (loading) return <div className="loading">Loading project...</div>;

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">Edit Project</h1>

        <form onSubmit={handleSubmit} className="form-edit-project">
          {/* almost identical form content as NewProject */}
          {/* ... copy-paste fields, questions loop, buttons ... */}
        </form>
      </div>
    </main>
  );
}