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

// Contact identity
//
// Defined once and imported everywhere it appears. About and Contact
// previously each hardcoded their own copy and drifted apart, advertising two
// different email addresses and two different GitHub accounts at the same
// time. The JSON-LD block in public/index.html is static HTML and has to be
// kept in step by hand.
//
// The email is stored lowercase because local-parts are case-sensitive per
// RFC 5321; pages that show it in caps do so as a display choice.
export const CONTACT_EMAIL = "jxstinpotter@gmail.com";
export const GITHUB_URL = "https://github.com/jxstin-potter";
export const GITHUB_HANDLE = "/JXSTIN-POTTER";
export const LINKEDIN_URL = "https://www.linkedin.com/in/justin-mpotter/";
export const LINKEDIN_HANDLE = "/IN/JUSTIN-MPOTTER";
