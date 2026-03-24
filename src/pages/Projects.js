import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/project-card/ProjectCard';
import '../styles/main.css'; // usually already global, but safe to keep

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call later
    // Example: fetch('/api/projects').then(...)
    setTimeout(() => {
      setProjects([
        {
          projectId: 'p1',
          projectName: 'AI for Social Good 2026',
          minNrParticipants: 3,
          maxNrParticipants: 6,
        },
        {
          projectId: 'p2',
          projectName: 'Sustainable City Challenge',
          minNrParticipants: 2,
          maxNrParticipants: 5,
        },
        {
          projectId: 'p3',
          projectName: 'Open Source Education Platform',
          // no min/max → won't show range
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const handleEditClick = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="projects-header">
          <h1 className="title-1">Projects</h1>
          <Link to="/new-project" className="btn">
            Create project
          </Link>
        </div>

        {loading ? (
          <p className="loading">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="empty">No projects created yet.</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.projectId}
                project={project}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}