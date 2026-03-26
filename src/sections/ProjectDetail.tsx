import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectBySlug } from '../data/projects';
import ProjectDetailHero from '../components/sections/ProjectDetailHero';
import ProjectDetailInfo from '../components/sections/ProjectDetailInfo';

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = useMemo(
    () => (slug ? getProjectBySlug(slug) : undefined),
    [slug]
  );

  if (!project) {
    return (
      <section className="project-detail project-detail-empty">
        <div className="project-detail-empty-content">
          <p className="project-detail-title">Project not found</p>
          <p className="project-detail-summary">
            The project you are looking for does not exist yet.
          </p>
          <button type="button" onClick={() => navigate('/')} className="project-detail-link">
            Back to Work
          </button>
        </div>
      </section>
    );
  }

  const isCommerceflow = project.slug === 'commerceflow' || project.slug === '2du';
  const showCommerceflowStackImages = project.slug === '2du';

  return (
    <section
      className={`project-detail${isCommerceflow ? ' project-detail-commerceflow' : ''}`}
    >
      <ProjectDetailHero
        title={project.title}
        role={project.role}
        summary={project.summary}
        description={project.description}
        imageUrl={project.imageUrl}
        isCommerceflow={isCommerceflow}
        showCommerceflowStackImages={showCommerceflowStackImages}
        placeholderCount={showCommerceflowStackImages ? 3 : 4}
      >
        <ProjectDetailInfo
          year={project.year}
          services={project.services}
          liveUrl={project.liveUrl}
          awards={isCommerceflow ? undefined : project.awards}
        />
      </ProjectDetailHero>
    </section>
  );
};

export default ProjectDetail;
