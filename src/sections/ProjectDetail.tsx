import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import ProjectDetailHero from "../components/sections/ProjectDetailHero";
import ProjectDetailInfo from "../components/sections/ProjectDetailInfo";
import OptimizedImage from "../components/common/OptimizedImage";
import limpHomepageImage from "../assets/limp-homepage.jpg";
import limpMenuImage from "../assets/limp-menu.jpg";
import limpDeliveriesImage from "../assets/limp-deliveries.png";
import limpBottomPageImage from "../assets/limp-btmpage.jpg";
import limpBeforeImage from "../assets/before-limp.png";

const limprimerieGalleryImages = [
  { src: limpHomepageImage, label: "Homepage" },
  { src: limpDeliveriesImage, label: "Deliveries" },
  { src: limpMenuImage, label: "Menu" },
  { src: limpBottomPageImage, label: "Bottom page" },
];

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = useMemo(
    () => (slug ? getProjectBySlug(slug) : undefined),
    [slug],
  );

  if (!project) {
    return (
      <section className="project-detail project-detail-empty">
        <div className="project-detail-empty-content">
          <p className="project-detail-title">Project not found</p>
          <p className="project-detail-summary">
            The project you are looking for does not exist yet.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="project-detail-link"
          >
            Back to Work
          </button>
        </div>
      </section>
    );
  }

  const isCommerceflow =
    project.slug === "commerceflow" || project.slug === "2du";
  const showCommerceflowStackImages = project.slug === "2du";
  const limprimerieGallery =
    project.slug === "limprimerie-bakery" ? limprimerieGalleryImages : undefined;
  const isLimprimerieCaseStudy = project.slug === "limprimerie-bakery";

  return (
    <section
      className={`project-detail${isCommerceflow ? " project-detail-commerceflow" : ""}`}
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
        galleryImages={limprimerieGallery}
      >
        <ProjectDetailInfo
          year={project.year}
          services={project.services}
          liveUrl={project.liveUrl}
        />
      </ProjectDetailHero>

      {isLimprimerieCaseStudy && (
        <section className="project-case-study">
          <p className="project-detail-section-title">Case Study</p>
          <div className="project-case-study-grid">
            <article className="project-case-study-card">
              <p className="project-case-study-kicker">Before redesign</p>
              <h2 className="project-case-study-heading">
                Legacy layout lacked hierarchy and conversion clarity
              </h2>
              <p className="project-case-study-copy">
                The previous Limprimerie experience made key actions harder to
                find. Product categories, menu items, and ordering touchpoints
                competed for attention, which increased friction for first-time
                visitors.
              </p>
              <div className="project-case-study-image">
                <OptimizedImage
                  src={limpBeforeImage}
                  alt="Limprimerie website before redesign"
                  priority={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>
            </article>

            <article className="project-case-study-card">
              <p className="project-case-study-kicker">Redesign approach</p>
              <h2 className="project-case-study-heading">
                Built around a cleaner user journey
              </h2>
              <p className="project-case-study-copy">
                The new direction prioritizes browsing flow: discover products,
                evaluate quickly, and order without guesswork. Information
                hierarchy, spacing, and content rhythm were reworked to make the
                menu feel intuitive and easier to scan.
              </p>
              <p className="project-case-study-copy">
                Outcome: a calmer visual system, stronger readability, and a
                more natural path from landing to checkout.
              </p>
            </article>
          </div>
        </section>
      )}
    </section>
  );
};

export default ProjectDetail;
