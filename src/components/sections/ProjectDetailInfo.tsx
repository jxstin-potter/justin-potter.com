import React from 'react';

interface ProjectDetailInfoProps {
  year: number;
  services: string[];
  liveUrl: string;
  awards?: string[];
}

const ProjectDetailInfo: React.FC<ProjectDetailInfoProps> = ({
  year,
  services,
  liveUrl,
  awards,
}) => {
  return (
    <section className="project-detail-info">
      <div className="project-detail-info-card">
        <p className="project-detail-label">Year</p>
        <p className="project-detail-value">{year}</p>
      </div>
      <div className="project-detail-info-card">
        <p className="project-detail-label">Services</p>
        <div className="project-detail-list">
          {services.map((service) => (
            <p key={service} className="project-detail-value">
              {service}
            </p>
          ))}
        </div>
      </div>
      <div className="project-detail-info-card">
        <p className="project-detail-label">Live site</p>
        <a
          className="project-detail-link"
          href={liveUrl}
          target={liveUrl === '#' ? undefined : '_blank'}
          rel={liveUrl === '#' ? undefined : 'noopener noreferrer'}
        >
          {liveUrl === '#' ? 'Coming soon' : 'Visit website'}
        </a>
      </div>
      {awards && (
        <div className="project-detail-info-card">
          <p className="project-detail-label">Awards</p>
          <div className="project-detail-list">
            {awards.length ? (
              awards.map((award) => (
                <p key={award} className="project-detail-value">
                  {award}
                </p>
              ))
            ) : (
              <p className="project-detail-value">—</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetailInfo;
