/**
 * Splits a project name intelligently for display
 * "CommerceFlow" becomes ["COMMERCE", "FLOW"]
 * "My Project" becomes ["MY", "PROJECT"]
 */
export const getDisplayName = (projectName: string): [string, string] => {
  try {
    // Normalize separators/punctuation so display-name splitting is stable.
    // Example: "2DU - Task Management System" -> ["2DU", "Task Management System"]
    const normalizedProjectName = projectName
      .replace(/[-–—:]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // If it contains spaces, split on spaces
    if (normalizedProjectName.includes(' ')) {
      const parts = normalizedProjectName.toUpperCase().split(' ');
      return (parts.length >= 2 ? [parts[0], parts.slice(1).join(' ')] : [parts[0], '']) as [string, string];
    }
    
    // Split camelCase/PascalCase words (e.g., "CommerceFlow" -> ["COMMERCE", "FLOW"])
    // Match capital letters followed by lowercase letters
    const words = normalizedProjectName.match(/[A-Z][a-z]*/g) || [normalizedProjectName];
    if (words.length > 1) {
      return [words[0].toUpperCase(), words.slice(1).join('').toUpperCase()] as [string, string];
    }
    
    // If single word, return as is
    return [words[0].toUpperCase(), ''] as [string, string];
  } catch (error) {
    return [projectName.toUpperCase(), ''];
  }
};

/**
 * Normalizes "COMING* SOON*" variants to "COMING SOON" for display
 * Keeps unique identifiers internally but displays cleanly
 */
export const normalizeComingSoon = (parts: [string, string]): [string, string] => {
  // Check if first part starts with "COMING" and second part starts with "SOON"
  if (parts[0].startsWith('COMING') && parts[1].startsWith('SOON')) {
    return ['COMING', 'SOON'];
  }
  return parts;
};

/**
 * Formats time display - always shows current time
 */
export const formatDisplayTime = (
  _hoveredProject: { year: number } | null,
  currentTime: Date
): string => {
  try {
    return currentTime.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    return '00:00:00';
  }
};
