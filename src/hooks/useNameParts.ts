import { useState, useEffect, useRef } from "react";
import { ProjectData } from "../types";
import { getDisplayName, normalizeComingSoon } from "../utils/helpers";

interface UseNamePartsReturn {
  targetNameParts: [string, string];
  retriggerKey: number;
  setTargetNameParts: (parts: [string, string]) => void;
}

export const useNameParts = (
  hoveredProject: ProjectData | null,
  initialParts: [string, string],
): UseNamePartsReturn => {
  const [targetNameParts, setTargetNameParts] =
    useState<[string, string]>(initialParts);
  const [retriggerKey, setRetriggerKey] = useState<number>(0);

  // Track last raw name parts (before normalization) to detect changes between unique identifiers
  const lastNamePartsRef = useRef<[string, string]>(["JUSTIN", "POTTER"]);
  // Track last normalized parts for comparison
  const lastNormalizedPartsRef = useRef<[string, string]>(["JUSTIN", "POTTER"]);

  // Update target name parts when hoveredProject changes
  // This is separate from the base text to allow smooth transitions
  useEffect(() => {
    if (!hoveredProject) {
      // Reset to base name when no project is hovered
      const baseParts: [string, string] = ["JUSTIN", "POTTER"];
      if (
        lastNamePartsRef.current[0] !== baseParts[0] ||
        lastNamePartsRef.current[1] !== baseParts[1]
      ) {
        setTargetNameParts(baseParts);
        lastNamePartsRef.current = baseParts;
        lastNormalizedPartsRef.current = baseParts;
      }
      return;
    }

    try {
      const rawParts = getDisplayName(hoveredProject.title);
      // Normalize for display (removes extra letters from COMING* SOON* variants)
      const newParts = normalizeComingSoon(rawParts);
      // Compare raw parts (before normalization) to detect changes between unique identifiers
      // This ensures COMINGA vs COMINGB are detected as different, triggering rescramble
      const rawPartsChanged =
        lastNamePartsRef.current[0] !== rawParts[0] ||
        lastNamePartsRef.current[1] !== rawParts[1];
      const normalizedPartsChanged =
        lastNormalizedPartsRef.current[0] !== newParts[0] ||
        lastNormalizedPartsRef.current[1] !== newParts[1];

      if (rawPartsChanged) {
        // Raw parts changed (different unique identifier) - always update and retrigger
        // Set normalized parts for display (shows "COMING SOON" without extra letters)
        setTargetNameParts(newParts);
        // If normalized parts are the same but raw parts changed, force retrigger with key
        // This ensures rescramble when moving between COMING SOON cards
        if (!normalizedPartsChanged) {
          setRetriggerKey((prev) => prev + 1);
        }
        // Store both raw and normalized parts for comparison
        lastNamePartsRef.current = rawParts;
        lastNormalizedPartsRef.current = newParts;
      } else {
        // Raw parts are the same but hoveredProject changed (shouldn't happen with unique names)
        // Force retrigger by incrementing retriggerKey - this will be passed to ScrambleText
        // Increment retrigger key to force ScrambleText to detect change and retrigger
        setRetriggerKey((prev) => prev + 1);
        lastNamePartsRef.current = rawParts;
        lastNormalizedPartsRef.current = newParts;
      }
    } catch (error) {
      const baseParts: [string, string] = ["JUSTIN", "POTTER"];
      if (
        lastNamePartsRef.current[0] !== baseParts[0] ||
        lastNamePartsRef.current[1] !== baseParts[1]
      ) {
        setTargetNameParts(baseParts);
        lastNamePartsRef.current = baseParts;
      }
    }
  }, [hoveredProject]);

  return {
    targetNameParts,
    retriggerKey,
    setTargetNameParts,
  };
};
