import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectCard from '../components/project-card/ProjectCard';
import { projectAPI } from '../services/apiClient';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await projectAPI.getAllProjects();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        // Fallback to mock data for demo
        setProjects([
          {
            projectId: 'p1',
            projectName: 'AI for Social Good 2026',
            registrationType: 'A',
            minNrParticipants: 3,
            maxNrParticipants: 6,
          },
          {
            projectId: 'p2',
            projectName: 'Sustainable City Challenge',
            registrationType: 'B',
            minNrParticipants: 2,
            maxNrParticipants: 5,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleEditClick = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  return (
    <main className="section">
      <div className="container">
        <div className="projects-header">
          <h1 className="title-1">My Projects</h1>
          <Link to="/new-project" className="btn">
            Create project
          </Link>
        </div>

        {loading ? (
          <p className="loading">Loading projects...</p>
        ) : error ? (
          <p className="error-message">Error loading projects. Showing cached data.</p>
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