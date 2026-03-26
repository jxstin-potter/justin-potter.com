import React, {
  useState,
  useEffect,
  useRef,
  Suspense,
  lazy,
  useMemo,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./styles/globals.css";
import Header from "./components/layout/Header";
import MainContent from "./sections/MainContent";
import { useWelcomeTransition } from "./hooks/useWelcomeTransition";
import LoadingFallback from "./components/common/LoadingFallback";
import { DURATION, EASING } from "./utils/animations";
import {
  WELCOME_SCRAMBLE_TIMEOUT,
  WELCOME_HIDE_DELAY,
  FOCUS_DELAY,
} from "./utils/constants";

// Lazy load sections for code splitting
const About = lazy(() => import("./sections/About"));
const Contact = lazy(() => import("./sections/Contact"));
const Archive = lazy(() => import("./sections/Archive"));
const ProjectDetail = lazy(() => import("./sections/ProjectDetail"));

// Shared main container styles
const mainContainerStyle: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  overflowX: "hidden",
  position: "relative",
  height: "100%",
  zIndex: 1,
  backgroundColor: "transparent",
};

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [shouldScramble, setShouldScramble] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isProjectDetail = location.pathname.startsWith("/projects");
  const activeView = useMemo(() => {
    if (location.pathname.startsWith("/about")) return "about";
    if (location.pathname.startsWith("/contact")) return "contact";
    if (location.pathname.startsWith("/archive")) return "archive";
    if (location.pathname.startsWith("/projects")) return "main";
    return "main";
  }, [location.pathname]);

  // Welcome transition logic (shared across header + main)
  const { targetNameParts: welcomeTargetNameParts, welcomeTransitionComplete } =
    useWelcomeTransition(showWelcome, shouldScramble);

  // Ref to store the active main element (React-friendly approach)
  // Falls back to querySelector if ref is null (defensive, handles edge cases)
  const mainElementRef = useRef<HTMLElement | null>(null);

  // Trigger scramble after delay (MainContent handles the timing)
  useEffect(() => {
    if (!showWelcome || activeView !== "main" || isProjectDetail) return;

    // Trigger scramble after delay
    const timeoutId = setTimeout(() => {
      setShouldScramble(true);
      // Hide welcome state after scramble completes
      setTimeout(() => {
        setShowWelcome(false);
      }, WELCOME_HIDE_DELAY);
    }, WELCOME_SCRAMBLE_TIMEOUT);

    // Allow immediate skip on user interaction
    const hideWelcome = () => {
      setShouldScramble(true);
      setTimeout(() => {
        setShowWelcome(false);
      }, WELCOME_HIDE_DELAY);
    };

    const events = ["click", "keydown", "scroll", "touchstart"];
    events.forEach((event) => {
      window.addEventListener(event, hideWelcome, { once: true });
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, hideWelcome);
      });
    };
  }, [showWelcome, activeView, isProjectDetail, shouldScramble]);

  useEffect(() => {
    if ((activeView !== "main" || isProjectDetail) && showWelcome) {
      setShowWelcome(false);
    }
  }, [activeView, isProjectDetail, showWelcome]);

  // Optimized scroll handler with requestAnimationFrame throttling
  useEffect(() => {
    if (isProjectDetail) {
      return;
    }
    // Only apply custom scroll on desktop (non-touch devices)
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      return; // Let native touch scrolling work on mobile
    }

    let rafId: number | null = null;
    let velocity = 0;
    let activeElement: HTMLElement | null = null;
    const maxVelocity = 60;
    const friction = 0.86;

    const stepScroll = () => {
      if (!activeElement) {
        rafId = null;
        return;
      }
      const maxScroll = activeElement.scrollHeight - activeElement.clientHeight;
      const nextScroll = Math.min(
        Math.max(activeElement.scrollTop + velocity, 0),
        maxScroll,
      );
      activeElement.scrollTop = nextScroll;
      velocity *= friction;
      if (Math.abs(velocity) < 0.1) {
        velocity = 0;
        rafId = null;
        return;
      }
      rafId = requestAnimationFrame(stepScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      // Use ref first (React way), fallback to querySelector for safety
      const mainElement =
        mainElementRef.current || document.querySelector("main");
      // Only intercept vertical scrolling, allow horizontal scrolling for project cards
      if (mainElement && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const target = e.target as HTMLElement;
        // Check if we're in a horizontally scrollable container (project cards)
        const horizontalScrollContainer = target.closest(
          '[style*="overflow-x"]',
        );
        if (
          horizontalScrollContainer &&
          horizontalScrollContainer.scrollWidth >
            horizontalScrollContainer.clientWidth
        ) {
          // Allow horizontal scrolling to work normally
          return;
        }

        if (mainElement.contains(target)) {
          const scrollHeight = mainElement.scrollHeight;
          const clientHeight = mainElement.clientHeight;
          const canScroll = scrollHeight > clientHeight;
          if (!canScroll) {
            return; // Don't prevent default if can't scroll
          }
          e.preventDefault();
          activeElement = mainElement;
          velocity = Math.max(
            Math.min(velocity + e.deltaY * 0.35, maxVelocity),
            -maxVelocity,
          );

          if (rafId === null) {
            rafId = requestAnimationFrame(stepScroll);
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [location.pathname, isProjectDetail]);

  // Callback ref to update mainElementRef when main elements mount/unmount
  // This works seamlessly with AnimatePresence - ref updates automatically
  const setMainRef = (element: HTMLElement | null) => {
    mainElementRef.current = element;
    // Focus management for accessibility - focus main content on route change
    if (element) {
      // Use setTimeout to ensure focus happens after animation starts
      setTimeout(() => {
        element.focus();
        // Scroll to top of main content
        element.scrollTop = 0;
      }, FOCUS_DELAY);
    }
  };

  const handleNavigate = (view: "main" | "about" | "contact" | "archive") => {
    switch (view) {
      case "about":
        navigate("/about");
        break;
      case "contact":
        navigate("/contact");
        break;
      case "archive":
        navigate("/archive");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div
      className="App"
      id="top"
      style={{
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: "-40px",
          left: 0,
          background: "var(--primary-white)",
          color: "var(--primary-black)",
          padding: "8px 16px",
          textDecoration: "none",
          zIndex: 10000,
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
        }}
        onFocus={(e) => {
          e.currentTarget.style.top = "0";
        }}
        onBlur={(e) => {
          e.currentTarget.style.top = "-40px";
        }}
      >
        Skip to main content
      </a>
      {/* Persistent Background Grid */}
      <div
        className="background-grid"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      <Header
        onNavigate={handleNavigate}
        activeView={activeView}
        delayUntilProjects={activeView === "main" && !isProjectDetail}
        welcomeTransitionComplete={welcomeTransitionComplete}
      />

      {/* Content Container with smooth transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.main
                id="main-content"
                key="main"
                ref={setMainRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING }}
                style={mainContainerStyle}
                tabIndex={-1}
                aria-label="Main content - Portfolio projects"
              >
                <MainContent
                  shouldScrambleFromWelcome={shouldScramble}
                  welcomeTransitionComplete={welcomeTransitionComplete}
                  welcomeTargetNameParts={welcomeTargetNameParts}
                />
              </motion.main>
            }
          />
          <Route
            path="/about"
            element={
              <motion.main
                key="about"
                ref={setMainRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING }}
                style={mainContainerStyle}
                tabIndex={-1}
                aria-label="About section"
              >
                <Suspense fallback={null}>
                  <About />
                </Suspense>
              </motion.main>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.main
                key="contact"
                ref={setMainRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING }}
                style={mainContainerStyle}
                tabIndex={-1}
                aria-label="Contact section"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <Contact />
                </Suspense>
              </motion.main>
            }
          />
          <Route
            path="/archive"
            element={
              <motion.main
                key="archive"
                ref={setMainRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING }}
                style={mainContainerStyle}
                tabIndex={-1}
                aria-label="Archive section"
              >
                <Suspense fallback={null}>
                  <Archive />
                </Suspense>
              </motion.main>
            }
          />
          <Route
            path="/projects/portfolio-site"
            element={<Navigate to="/projects/2du" replace />}
          />
          <Route
            path="/projects/:slug"
            element={
              <motion.main
                key="project-detail"
                ref={setMainRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.normal, ease: EASING }}
                style={mainContainerStyle}
                tabIndex={-1}
                aria-label="Project details"
              >
                <Suspense fallback={<LoadingFallback />}>
                  <ProjectDetail />
                </Suspense>
              </motion.main>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
