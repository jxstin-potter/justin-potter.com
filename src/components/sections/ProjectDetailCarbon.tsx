import React from 'react';
import { ProjectCarbonFootprint } from '../../data/projects';

interface ProjectDetailCarbonProps {
  carbonFootprint: ProjectCarbonFootprint;
}

const ProjectDetailCarbon: React.FC<ProjectDetailCarbonProps> = ({ carbonFootprint }) => {
  return (
    <section className="project-detail-carbon">
      <p className="project-detail-section-title">Carbon Footprint</p>
      <div className="project-detail-carbon-card">
        <div>
          <p className="project-detail-carbon-value">
            {carbonFootprint.gramsCO2.toFixed(2)} g/CO2
          </p>
          <p className="project-detail-label">
            Cleaner than {carbonFootprint.cleanerThanPercent}% of web pages.
          </p>
        </div>
        <a
          className="project-detail-link"
          href={carbonFootprint.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Source: {carbonFootprint.sourceLabel}
        </a>
      </div>
    </section>
  );
};

export default ProjectDetailCarbon;
