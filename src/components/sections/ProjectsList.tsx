import React, { memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsContainerVariants } from "../../utils/animations";
import ProjectCard from "../common/ProjectCard";
import { COMING_SOON_PROJECT_IDS } from "../../utils/constants";
import { useDragScroll } from "../../hooks/useDragScroll";
import { ProjectSummary } from "../../data/projects";

interface ProjectsListProps {
  projects: ProjectSummary[];
  welcomeTransitionComplete: boolean;
  hoveredCardId: number | null;
  onProjectMouseEnter: (project: ProjectSummary) => void;
  onProjectMouseLeave: () => void;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  welcomeTransitionComplete,
  hoveredCardId,
  onProjectMouseEnter,
  onProjectMouseLeave,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { handleContainerMouseDown, handleTouchStart } = useDragScroll();

  return (
    <AnimatePresence>
      {welcomeTransitionComplete && (
        <motion.div
          variants={projectsContainerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            flexShrink: 0,
            paddingTop: "calc(var(--spacing-xl) + 4rem)",
            paddingBottom: "var(--spacing-sm)",
            paddingLeft: 0,
            paddingRight: 0,
            boxSizing: "border-box",
          }}
        >
          {/* Horizontal Scrollable Projects Container */}
          <motion.div
            ref={containerRef}
            className="projects-scroll-container"
            role="region"
            aria-label="Portfolio projects"
            aria-live="polite"
            style={{
              display: "flex",
              overflowX: "auto",
              overflowY: "hidden",
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              cursor: "grab",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              paddingBottom: "0",
              justifyContent: "flex-start",
              alignItems: "flex-end",
              gap: "var(--spacing-md)",
              touchAction: "pan-x",
            }}
            onMouseDown={handleContainerMouseDown}
            onTouchStart={handleTouchStart}
            onMouseLeave={onProjectMouseLeave}
          >
            {/* Projects List */}
            <div
              role="list"
              aria-label="Project cards"
              style={{
                display: "flex",
                gap: "1rem",
                minWidth: "max-content",
                alignItems: "flex-end",
                justifyContent: "center",
                margin: "0 auto",
                marginTop: "calc(4.5rem + 3px)",
              }}
            >
              {projects.map((project, index) => {
                const isHovered = hoveredCardId === project.id;
                const isAnyCardHovered = hoveredCardId !== null;
                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    isHovered={isHovered}
                    isAnyCardHovered={isAnyCardHovered}
                    onProjectMouseEnter={onProjectMouseEnter}
                    comingSoonIds={COMING_SOON_PROJECT_IDS}
                  />
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ProjectsList);
