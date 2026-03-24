import { Link } from 'react-router-dom';
import './style.css';

export default function ProjectCard({ project, onEdit }) {
  const hasParticipantRange =
    project.minNrParticipants !== undefined &&
    project.maxNrParticipants !== undefined;

  return (
    <div className="project-card">
      <h3 className="project-card__title">{project.projectName}</h3>

      {hasParticipantRange && (
        <div className="project-card__meta">
          <p className="project-participants">
            Participants: {project.minNrParticipants} – {project.maxNrParticipants}
          </p>
          <Link
            to={`/project/${project.projectId}`}
            className="project-detail-link"
          >
            View details
          </Link>
        </div>
      )}

      <div className="project-card__actions">
        <Link
          to={`/participants/${project.projectId}`}
          className="btn"
        >
          View participants
        </Link>

        <button className="btn-outline" onClick={() => onEdit(project.projectId)}>
          Edit
        </button>
      </div>
    </div>
  );
}