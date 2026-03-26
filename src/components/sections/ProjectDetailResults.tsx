import React from "react";
import { ProjectResult } from "../../data/projects";

interface ProjectDetailResultsProps {
  results: ProjectResult[];
}

const ProjectDetailResults: React.FC<ProjectDetailResultsProps> = ({
  results,
}) => {
  return (
    <section className="project-detail-results">
      <p className="project-detail-section-title">Results</p>
      <div className="project-detail-results-grid">
        {results.map((result) => (
          <div key={result.label} className="project-detail-results-card">
            <p className="project-detail-results-value">{result.value}</p>
            <p className="project-detail-label">{result.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectDetailResults;
