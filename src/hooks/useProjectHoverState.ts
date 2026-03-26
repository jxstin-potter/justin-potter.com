import { useState, useRef, useCallback, useEffect } from "react";
import { ProjectData } from "../types";
import { ProjectSummary } from "../data/projects";
import {
  HOVER_RESET_DELAY,
  COMING_SOON_PROJECT_IDS,
  COMING_SOON_NAMES,
} from "../utils/constants";

interface UseProjectHoverStateReturn {
  hoveredProject: ProjectData | null;
  hoveredCardId: number | null;
  handleProjectMouseEnter: (project: ProjectSummary) => void;
  handleProjectMouseLeave: () => void;
}

export const useProjectHoverState = (
  onProjectHover?: (project: ProjectData | null) => void,
): UseProjectHoverStateReturn => {
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(
    null,
  );
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cardHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get project data with coming soon handling
  const getProjectData = useCallback((project: ProjectSummary): ProjectData => {
    const isComingSoon =
      project.id >= COMING_SOON_PROJECT_IDS.min &&
      project.id <= COMING_SOON_PROJECT_IDS.max;
    return {
      title: isComingSoon ? COMING_SOON_NAMES[project.id] : project.title,
      role: project.role,
      year: isComingSoon ? 2026 : project.year,
    };
  }, []);

  // Optimized project hover enter handler
  const handleProjectMouseEnter = useCallback(
    (project: ProjectSummary) => {
      // Clear any pending timeout to prevent reset when quickly moving between cards
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      if (cardHoverTimeoutRef.current) {
        clearTimeout(cardHoverTimeoutRef.current);
        cardHoverTimeoutRef.current = null;
      }

      const projectData = getProjectData(project);
      const isDifferentCard = hoveredCardId !== project.id;

      // Set card hover state immediately for visual feedback
      setHoveredCardId(project.id);

      // Check if it's the same card with the same data - skip update in that case
      const isSameCardAndData =
        !isDifferentCard &&
        hoveredProject &&
        hoveredProject.title === projectData.title &&
        hoveredProject.role === projectData.role &&
        hoveredProject.year === projectData.year;

      if (isSameCardAndData) {
        return; // Same card and same data - don't retrigger
      }

      // Handle different card with same title/year (e.g., COMING SOON projects)
      if (
        isDifferentCard &&
        hoveredProject &&
        hoveredProject.title === projectData.title &&
        hoveredProject.role === projectData.role &&
        hoveredProject.year === projectData.year
      ) {
        // Temporarily clear to force animation retrigger
        setHoveredProject(null);
        // Use requestAnimationFrame for better performance than setTimeout(0)
        requestAnimationFrame(() => {
          setHoveredProject(projectData);
        });
      } else {
        // Different project data or first hover - update immediately
        setHoveredProject(projectData);
      }
    },
    [hoveredCardId, hoveredProject, getProjectData],
  );

  // Optimized project hover leave handler
  const handleProjectMouseLeave = useCallback(() => {
    // Delay card hover reset to avoid flicker between cards
    if (cardHoverTimeoutRef.current) {
      clearTimeout(cardHoverTimeoutRef.current);
    }
    cardHoverTimeoutRef.current = setTimeout(() => {
      setHoveredCardId(null);
      cardHoverTimeoutRef.current = null;
    }, HOVER_RESET_DELAY);

    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Reset hovered project with delay to allow smooth transitions
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredProject(null);
      hoverTimeoutRef.current = null;
    }, HOVER_RESET_DELAY);
  }, []);

  // Cleanup hover timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (cardHoverTimeoutRef.current) {
        clearTimeout(cardHoverTimeoutRef.current);
      }
    };
  }, []);

  // Notify parent of hover changes
  useEffect(() => {
    if (onProjectHover) {
      onProjectHover(hoveredProject);
    }
  }, [hoveredProject, onProjectHover]);

  return {
    hoveredProject,
    hoveredCardId,
    handleProjectMouseEnter,
    handleProjectMouseLeave,
  };
};
