import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, projectAPI } from '../services/apiClient';

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
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectAPI.getProjectById(projectId);
        setProject(data);

        // Initialize answers based on project questions
        const initialAnswers = (data.formQuestions || []).map((q) => ({
          questionNumber: q.questionNumber,
          questionType: q.questionType,
          question: q.question,
          possibleAnswers: q.possibleAnswers || [],
          answer: q.questionType === 'CHECKBOX' ? [] : '',
        }));

        setFormData(prev => ({ ...prev, answers: initialAnswers }));
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message);
        // Fallback mock data
        setProject({
          projectId: projectId,
          projectName: `Project ${projectId}`,
          teamsPreformed: false,
          formQuestions: [
            { 
              questionNumber: 1, 
              questionType: 'TEXT', 
              question: 'Motivation letter',
              possibleAnswers: []
            },
            { 
              questionNumber: 2, 
              questionType: 'CHECKBOX', 
              question: 'Skills you have',
              possibleAnswers: ['JavaScript', 'React', 'Node.js', 'Python']
            },
          ],
        });

        const initialAnswers = [
          { questionNumber: 1, questionType: 'TEXT', question: 'Motivation letter', possibleAnswers: [], answer: '' },
          { questionNumber: 2, questionType: 'CHECKBOX', question: 'Skills you have', possibleAnswers: ['JavaScript', 'React', 'Node.js', 'Python'], answer: [] }
        ];
        setFormData(prev => ({ ...prev, answers: initialAnswers }));
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionNumber, value) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(a =>
        a.questionNumber === questionNumber ? { ...a, answer: value } : a
      )
    }));
  };

  const handleCheckboxChange = (questionNumber, option) => {
    setFormData(prev => ({
      ...prev,
      answers: prev.answers.map(a => {
        if (a.questionNumber === questionNumber) {
          const currentAnswers = Array.isArray(a.answer) ? a.answer : [];
          return {
            ...a,
            answer: currentAnswers.includes(option)
              ? currentAnswers.filter(item => item !== option)
              : [...currentAnswers, option]
          };
        }
        return a;
      })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Normalize answers: CHECKBOX arrays → pipe-separated string,
      // drop fields the backend doesn't expect (possibleAnswers).
      const questionsAnswers = formData.answers.map((a) => ({
        questionNumber: a.questionNumber,
        questionType: a.questionType,
        question: a.question,
        answer: Array.isArray(a.answer) ? a.answer.join('|') : (a.answer ?? ''),
      }));

      const applicationData = {
        projectId: Number(projectId),       // backend expects a number, not "1"
        firstName: formData.firstName,
        lastName: formData.lastName,
        joinExistentTeam: false,            // Type A: solo applicant, no team yet
        questionsAnswers,
      };

      // Type B (pre-formed teams) — include team info
      if (!isTypeA) {
        applicationData.teamName = formData.teamName || null;
        applicationData.teammates = formData.teammates?.filter(
          t => t.firstName?.trim() && t.lastName?.trim()
        ) ?? [];
      }

      await applicationAPI.submitApplication(applicationData);
      navigate('/my-applications');
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
            {formData.answers.map((q, idx) => (
              <div key={q.questionNumber} className="question-item">
                <label className="question-label">{q.question}</label>
                
                {q.questionType === 'TEXT' && (
                  <input
                    type="text"
                    className="form-input"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}

                {q.questionType === 'TEXTAREA' && (
                  <textarea
                    className="form-input"
                    rows={5}
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
                    placeholder="Enter your answer"
                  />
                )}

                {q.questionType === 'FILE' && (
                  <input
                    type="file"
                    className="form-input"
                    onChange={(e) => handleAnswerChange(q.questionNumber, e.target.files[0])}
                  />
                )}

                {q.questionType === 'CHECKBOX' && (
                  <div className="checkbox-group">
                    {(q.possibleAnswers && q.possibleAnswers.length > 0) ? (
                      q.possibleAnswers.map((option) => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={Array.isArray(q.answer) && q.answer.includes(option)}
                            onChange={() => handleCheckboxChange(q.questionNumber, option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    ) : (
                      <p style={{ color: '#999', fontStyle: 'italic' }}>No options available for this question</p>
                    )}
                  </div>
                )}

                {q.questionType === 'RADIO' && (
                  <div className="checkbox-group">
                    {(q.possibleAnswers && q.possibleAnswers.length > 0) ? (
                      q.possibleAnswers.map((option) => (
                        <label key={option} className="checkbox-label">
                          <input
                            type="radio"
                            name={`question-${q.questionNumber}`}
                            value={option}
                            checked={q.answer === option}
                            onChange={() => handleAnswerChange(q.questionNumber, option)}
                          />
                          <span>{option}</span>
                        </label>
                      ))
                    ) : (
                      <p style={{ color: '#999', fontStyle: 'italic' }}>No options available for this question</p>
                    )}
                  </div>
                )}

                {q.questionType === 'DROPDOWN' && (
                  <select
                    className="form-input"
                    value={q.answer}
                    onChange={(e) => handleAnswerChange(q.questionNumber, e.target.value)}
                  >
                    <option value="">Select an option</option>
                    {(q.possibleAnswers && q.possibleAnswers.length > 0) ? (
                      q.possibleAnswers.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))
                    ) : null}
                  </select>
                )}
              </div>
            ))}
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