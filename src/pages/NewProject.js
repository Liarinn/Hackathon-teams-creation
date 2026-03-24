import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NewProject() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    projectName: '',
    minNrParticipants: '',
    maxNrParticipants: '',
    questions: [],
  });

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionNumber: prev.questions.length + 1,
          questionType: 'text',
          question: '',
        },
      ],
    }));
  };

  const updateQuestion = (index, field, value) => {
    setForm((prev) => {
      const qs = [...prev.questions];
      qs[index] = { ...qs[index], [field]: value };
      return { ...prev, questions: qs };
    });
  };

  const removeQuestion = (index) => {
    setForm((prev) => {
      const qs = prev.questions
        .filter((_, i) => i !== index)
        .map((q, i) => ({ ...q, questionNumber: i + 1 }));
      return { ...prev, questions: qs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST to backend
    console.log('New project payload:', form);
    alert('Project created (mock)');
    navigate('/projects');
  };

  return (
    <main className="section">
      <div className="container">
        <h1 className="title-1">Create New Project</h1>

        <form onSubmit={handleSubmit} className="form-new-project">
          <div className="form-group">
            <label htmlFor="projectName">Project Name *</label>
            <input
              id="projectName"
              type="text"
              value={form.projectName}
              onChange={(e) => setForm({ ...form, projectName: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="min">Min Participants</label>
              <input
                id="min"
                type="number"
                min="1"
                value={form.minNrParticipants}
                onChange={(e) => setForm({ ...form, minNrParticipants: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="max">Max Participants</label>
              <input
                id="max"
                type="number"
                min="1"
                value={form.maxNrParticipants}
                onChange={(e) => setForm({ ...form, maxNrParticipants: e.target.value })}
              />
            </div>
          </div>

          <h2 className="title-2" style={{ margin: '48px 0 24px' }}>
            Application Form Questions
          </h2>

          {form.questions.map((q, idx) => (
            <div key={idx} className="question-item">
              <div className="question-header">
                <span>Question {q.questionNumber}</span>
                <button
                  type="button"
                  className="btn-outline small"
                  onClick={() => removeQuestion(idx)}
                >
                  Remove
                </button>
              </div>

              <div className="form-group">
                <label>Question text *</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(idx, 'question', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Type *</label>
                <select
                  value={q.questionType}
                  onChange={(e) => updateQuestion(idx, 'questionType', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="checkbox">Checkbox (multiple choice)</option>
                  <option value="file">File upload</option>
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn-outline"
            onClick={addQuestion}
            style={{ margin: '24px 0 40px' }}
          >
            + Add question
          </button>

          <button type="submit" className="btn">
            Create Project
          </button>
        </form>
      </div>
    </main>
  );
}