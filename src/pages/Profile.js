import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: '',
    role: 'participant',
    skills: [],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    const savedUsername = localStorage.getItem('username');
    
    if (savedRole !== 'participant') {
      navigate('/dashboard');
    }

    // Initialize with saved data from localStorage
    setProfile(prev => ({
      ...prev,
      username: savedUsername || 'User',
      role: savedRole || 'participant'
    }));
  }, [navigate]);

  const toggleEdit = async () => {
    if (isEditing) {
      // TODO: Save profile to backend
      setLoading(true);
      try {
        console.log('Profile saved:', profile);
        // Uncomment when backend endpoint is available:
        // await authAPI.updateProfile(profile);
        // alert('Profile updated successfully!');
      } catch (err) {
        console.error('Error saving profile:', err);
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <main className="section">
      <div className="container">
        <div className="auth-wrapper">
          <h1 className="title-1">My Profile</h1>

          <div className="auth-card profile-card">
            <div className="profile-header">
              <h2>{profile.username}</h2>
              <span className="role-badge">
                {profile.role === 'participant' ? 'Participant' : 'Organizer'}
              </span>
            </div>

            <div className="profile-section">
              <label>Username</label>
              <p className="profile-info">{profile.username}</p>
            </div>

            <div className="profile-section">
              <label>Role</label>
              <p className="profile-info">{profile.role === 'participant' ? 'Participant' : 'Organizer'}</p>
            </div>

            <div className="profile-section">
              <label>Skills</label>
              
              <div className="skills-container">
                {profile.skills.map((skill, index) => (
                  <div key={index} className="skill-tag">
                    {skill}
                    {isEditing && (
                      <button
                        className="skill-remove"
                        onClick={() => removeSkill(skill)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <div className="add-skill-row">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add new skill..."
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <button type="button" className="btn-outline small" onClick={addSkill}>
                    Add
                  </button>
                </div>
              )}
            </div>

            <button onClick={toggleEdit} className="btn" style={{ width: '100%', marginTop: '32px' }}>
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}