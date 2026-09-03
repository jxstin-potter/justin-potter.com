import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectBySlug } from "../data/projects";
import ProjectDetailHero from "../components/sections/ProjectDetailHero";
import ProjectDetailInfo from "../components/sections/ProjectDetailInfo";
import OptimizedImage from "../components/common/OptimizedImage";
import {
  limpHomepage,
  limpMenu,
  limpDeliveries,
  limpBottomPage,
  limpBefore,
} from "../data/images";

const limprimerieGalleryImages = [
  { image: limpHomepage, label: "Homepage" },
  {
    image: limpDeliveries,
    label: "Deliveries",
    objectPosition: "center 100%",
  },
  { image: limpMenu, label: "Menu" },
  { image: limpBottomPage, label: "Bottom page" },
];

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = useMemo(
    () => (slug ? getProjectBySlug(slug) : undefined),
    [slug],
  );

  const projectSlug = project?.slug ?? "";
  const isCommerceflow = projectSlug === "keyvault" || projectSlug === "2du";
  const showCommerceflowStackImages = projectSlug === "2du";
  const limprimerieGallery =
    projectSlug === "limprimerie-bakery" ? limprimerieGalleryImages : undefined;
  const isLimprimerieCaseStudy = projectSlug === "limprimerie-bakery";

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

  return (
    <section
      className={`project-detail${isCommerceflow ? " project-detail-commerceflow" : ""}`}
    >
      <ProjectDetailHero
        title={project.title}
        role={project.role}
        summary={project.summary}
        description={project.description}
        image={project.image}
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
                  {...limpBefore}
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
