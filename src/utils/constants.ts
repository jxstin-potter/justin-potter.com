/**
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

// Coming Soon Project Configuration
export const COMING_SOON_PROJECT_IDS = { min: 4, max: 5 } as const;

// Coming soon project name mapping - unique identifiers for animation retriggering
export const COMING_SOON_NAMES: Record<number, string> = {
  4: "COMINGC SOONC",
  5: "COMINGD SOOND",
} as const;

// Timing Constants (in milliseconds)
export const HOVER_RESET_DELAY = 100;
export const WELCOME_SCRAMBLE_DELAY = 80; // Brief pause before scramble
export const WELCOME_TRANSITION_DELAY = 300; // Allow scramble to settle

// Interaction Constants
export const DRAG_MULTIPLIER = 2;

// Scroll Performance Constants
export const SCROLL_THROTTLE_MS = 16; // ~60fps

// Welcome Screen Timing (from App.tsx)
export const WELCOME_SCRAMBLE_TIMEOUT = 900; // ms
export const WELCOME_HIDE_DELAY = 300; // ms
export const FOCUS_DELAY = 100; // ms for focus management
