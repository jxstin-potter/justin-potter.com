import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/globals.css";
import Header from "./components/Header";
import MainContent from "./sections/MainContent";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Archive from "./sections/Archive";
import { ProjectData } from "./types";
import { DURATION, EASING } from "./utils/animations";

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
  const [activeView, setActiveView] = useState<
    "main" | "about" | "contact" | "archive"
  >("main");
  const [hoveredProject, setHoveredProject] = useState<ProjectData | null>(
    null
  );
  const [showWelcome, setShowWelcome] = useState(true);
  const [shouldScramble, setShouldScramble] = useState(false);

  // Trigger scramble after delay (MainContent handles the timing)
  useEffect(() => {
    if (!showWelcome) return;

    // Trigger scramble after 3 seconds
    const timeoutId = setTimeout(() => {
      setShouldScramble(true);
      // Hide welcome state after scramble completes
      setTimeout(() => {
        setShowWelcome(false);
      }, 600);
    }, 3000);

    // Allow immediate skip on user interaction
    const hideWelcome = () => {
      setShouldScramble(true);
      setTimeout(() => {
        setShowWelcome(false);
      }, 600);
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
  }, [showWelcome]);

  // Slow down scroll speed for smoother, slower scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const mainElement = document.querySelector("main");
      // Only intercept vertical scrolling, allow horizontal scrolling for project cards
      if (mainElement && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const target = e.target as HTMLElement;
        // Check if we're in a horizontally scrollable container (project cards)
        const horizontalScrollContainer = target.closest(
          '[style*="overflow-x"]'
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
          const maxScroll = scrollHeight - clientHeight;
          const currentScroll = mainElement.scrollTop;
          const remainingScroll = maxScroll - currentScroll;

          // If scrolling down and one notch should reach bottom
          if (e.deltaY > 0 && remainingScroll > 0) {
            // One mini notch should take us to bottom - slower scroll speed
            const scrollSpeed = Math.max(
              (remainingScroll / Math.abs(e.deltaY)) * 0.8,
              0.6
            );
            const scrollAmount = e.deltaY * scrollSpeed;
            // Ensure we don't overshoot
            const finalScroll = Math.min(scrollAmount, remainingScroll);
            mainElement.scrollBy({
              top: finalScroll,
              behavior: "smooth",
            });
          } else {
            // Scrolling up - use slower behavior
            const scrollSpeed = 1.2;
            const scrollAmount = e.deltaY * scrollSpeed;
            mainElement.scrollBy({
              top: scrollAmount,
              behavior: "smooth",
            });
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeView]);

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
      />

      <Header onNavigate={setActiveView} activeView={activeView} showWelcome={showWelcome} />

      {/* Content Container with smooth transitions */}
      <AnimatePresence mode="wait">
        {activeView === "main" && (
          <motion.main
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASING }}
            style={mainContainerStyle}
          >
            <MainContent 
              onProjectHover={setHoveredProject} 
              shouldScrambleFromWelcome={shouldScramble}
              showWelcome={showWelcome}
            />
          </motion.main>
        )}

        {activeView === "about" && (
          <motion.main
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASING }}
            style={mainContainerStyle}
          >
            <About />
          </motion.main>
        )}

        {activeView === "contact" && (
          <motion.main
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASING }}
            style={mainContainerStyle}
          >
            <Contact />
          </motion.main>
        )}

        {activeView === "archive" && (
          <motion.main
            key="archive"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.normal, ease: EASING }}
            style={mainContainerStyle}
          >
            <Archive />
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
