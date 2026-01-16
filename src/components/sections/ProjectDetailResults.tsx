import React from 'react';
import { ProjectResult } from '../../data/projects';

interface ProjectDetailResultsProps {
  results: ProjectResult[];
}

const ProjectDetailResults: React.FC<ProjectDetailResultsProps> = ({ results }) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/3355fed9-9be5-4c30-a353-6450cdb51e60',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProjectDetailResults.tsx',message:'project-detail results render',data:{resultsCount:results.length,labels:results.map((result) => result.label)},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
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
