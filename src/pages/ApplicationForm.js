import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI } from '../services/apiClient';

export default function ApplicationForm() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    teamName: '',
    teammates: [{ firstName: '', lastName: '' }],
    answers: [],
  });

  useEffect(() => {
    setTimeout(() => {
      const projectsData = {
        p1: { 
          projectId: 'p1', 
          projectName: 'AI for Social Good 2026', 
          teamsPreformed: false,
          existingIdeas: [
            { id: 'idea1', title: 'AI Chatbot for Education', author: 'Maria I.' },
            { id: 'idea2', title: 'Smart Waste Management', author: 'Alex P.' }
          ]
        },
        p2: { 
          projectId: 'p2', 
          projectName: 'Sustainable City Challenge', 
          teamsPreformed: true 
        },
        p3: { 
          projectId: 'p3', 
          projectName: 'Open Source Education Platform', 
          teamsPreformed: false,
          existingIdeas: [
            { id: 'idea3', title: 'Interactive Learning Platform', author: 'Elena D.' }
          ]
        }
      };

      const currentProject = projectsData[projectId] || projectsData.p1;

      setProject(currentProject);

      const initialAnswers = [
        { questionNumber: 1, questionType: 'text', answer: '' },
        { questionNumber: 2, questionType: 'file', answer: '' }
      ];

      setFormData(prev => ({ ...prev, answers: initialAnswers }));
      setLoading(false);
    }, 500);
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        projectId: projectId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        questionsAnswers: formData.answers,
      };

      // For Type B, add team info
      if (!isTypeA) {
        applicationData.teamName = formData.teamName;
      }

      await applicationAPI.submitApplication(applicationData);
      navigate(isTypeA ? '/my-applications' : '/my-applications');
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !project) return <div className="loading">Loading application form...</div>;

  const isTypeA = !project.teamsPreformed;

  return (
    <main className="section">
      <div className="container">
        <div className="application-header">
          <h1 className="title-1">Apply to {project.projectName}</h1>
          <p>Type: {isTypeA ? 'A - Idea-based Registration' : 'B - Team Registration'}</p>
        </div>

        <form onSubmit={handleSubmit} className="application-form">

          {/* Personal Info */}
          <div className="form-section">
            <h2 className="title-2">Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>
          </div>

          {/* Type A: Idea Selection - Application happens after form submission */}

          {/* Type B: Team Registration */}
          {!isTypeA && (
            <div className="form-section">
              <h2 className="title-2">Team Registration</h2>
              <div className="form-group">
                <label>Team Name (optional)</label>
                <input type="text" name="teamName" value={formData.teamName} onChange={handleInputChange} />
              </div>
              {/* Teammates section for Type B - you can keep or simplify */}
            </div>
          )}

          {/* Questions */}
          <div className="form-section">
            <h2 className="title-2">Application Questions</h2>
            {/* Your existing questions rendering code */}
          </div>

          {error && <p className="error-message" style={{ marginBottom: '20px' }}>{error}</p>}

          <button type="submit" className="btn" style={{ marginTop: '40px', width: '100%' }} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </main>
  );
}