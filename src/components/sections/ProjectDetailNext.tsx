import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectDetailData } from '../../data/projects';

interface ProjectDetailNextProps {
  projects: ProjectDetailData[];
}

const ProjectDetailNext: React.FC<ProjectDetailNextProps> = ({ projects }) => {
  return (
    <section className="project-detail-next">
      <p className="project-detail-section-title">Next project</p>
      <div className="project-detail-next-list">
        {projects.map((project) => (
          <Link
            key={project.slug}
            className="project-detail-next-link"
            to={`/projects/${project.slug}`}
          >
            {project.title}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ProjectDetailNext;
