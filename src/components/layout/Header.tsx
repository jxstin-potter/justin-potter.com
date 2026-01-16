import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { DURATION, EASING } from '../../utils/animations';
import ScrambleText from '../animations/ScrambleText';

interface HeaderProps {
  onNavigate?: (view: 'main' | 'about' | 'contact' | 'archive') => void;
  activeView?: 'main' | 'about' | 'contact' | 'archive';
  delayUntilProjects?: boolean;
  welcomeTransitionComplete?: boolean;
}

const Header = ({
  onNavigate,
  activeView = 'main',
  delayUntilProjects = false,
  welcomeTransitionComplete = true,
}: HeaderProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isCommerceflowRoute = location.pathname === '/projects/commerceflow';
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null);
  // Track retrigger keys for logo and nav items to force rescramble
  const [logoRetriggerKey, setLogoRetriggerKey] = useState(0);
  const navItemRetriggerKeysRef = useRef<Record<string, number>>({});
  const lastHoveredNavItemRef = useRef<string | null>(null);
  const introScrambleTriggeredRef = useRef(false);
  const introScrambleActive = welcomeTransitionComplete && !introScrambleTriggeredRef.current;

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'hidden'; // Always hidden
    }
    return () => {
      document.body.style.overflow = 'hidden';
    };
  }, [isMenuOpen]);

  const navItems = [
    { name: 'Work', view: 'main' as const, label: 'Projects' },
    { name: 'Info', view: 'about' as const, label: 'About' },
    { name: 'Archive', view: 'archive' as const, label: 'Archive' }
  ];

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      transition: {
        duration: DURATION.normal,
        staggerChildren: 0.05,
        staggerDirection: -1,
        ease: EASING,
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: DURATION.normal,
        staggerChildren: 0.1,
        delayChildren: 0.1,
        ease: EASING,
      }
    }
  };

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: 20,
      transition: {
        duration: DURATION.normal,
        ease: EASING,
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DURATION.normal,
        ease: EASING,
      }
    }
  };

  const handleNavClick = (view: 'main' | 'about' | 'contact' | 'archive') => {
    setIsMenuOpen(false);
    if (onNavigate) {
      onNavigate(view);
    }
  };

  // Track nav item hover changes to trigger rescramble
  useEffect(() => {
    if (hoveredNavItem) {
      // If hovering a different nav item, increment retrigger key for that item
      if (lastHoveredNavItemRef.current !== hoveredNavItem) {
        navItemRetriggerKeysRef.current[hoveredNavItem] = 
          (navItemRetriggerKeysRef.current[hoveredNavItem] || 0) + 1;
        lastHoveredNavItemRef.current = hoveredNavItem;
        // Also trigger logo rescramble when hovering nav items
        setLogoRetriggerKey(prev => prev + 1);
      }
    } else {
      lastHoveredNavItemRef.current = null;
    }
  }, [hoveredNavItem]);

  // Track logo hover changes - only rescramble when starting to hover (true)
  const prevLogoHoveredRef = useRef(false);
  useEffect(() => {
    // Only increment when transitioning from not hovered to hovered
    if (isLogoHovered && !prevLogoHoveredRef.current) {
      setLogoRetriggerKey(prev => prev + 1);
    }
    prevLogoHoveredRef.current = isLogoHovered;
  }, [isLogoHovered]);

  useEffect(() => {
    if (welcomeTransitionComplete && !introScrambleTriggeredRef.current) {
      setLogoRetriggerKey(prev => prev + 1);
      navItems.forEach((item) => {
        navItemRetriggerKeysRef.current[item.name] =
          (navItemRetriggerKeysRef.current[item.name] || 0) + 1;
      });
      introScrambleTriggeredRef.current = true;
    }
    if (!welcomeTransitionComplete) {
      introScrambleTriggeredRef.current = false;
    }
  }, [welcomeTransitionComplete, navItems]);

  return (
    <>
      <motion.header
        initial={delayUntilProjects ? { y: -40, opacity: 0 } : false}
        animate={
          delayUntilProjects && !welcomeTransitionComplete
            ? { y: -40, opacity: 0 }
            : { y: 0, opacity: 1 }
        }
        transition={{ duration: DURATION.fast, ease: EASING }}
        className={`site-header${isCommerceflowRoute ? ' site-header-commerceflow' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1002,
          backgroundColor: 'transparent',
          transition: 'all var(--motion-duration-normal) var(--motion-ease-standard)'
        }}
      >
        <div style={{ width: '100%', margin: '0', padding: '0' }}>
          <nav 
            role="navigation"
            aria-label="Main navigation"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '0',
              paddingBottom: 'var(--spacing-sm)',
              paddingRight: 'var(--header-right-padding)',
              paddingLeft: '0',
              width: '100%'
            }}
          >
            {/* Logo/Home Link */}
            <motion.a
              href="#"
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING }}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
              onClick={(e) => {
                e.preventDefault();
                if (onNavigate) {
                  onNavigate('main');
                }
                setIsMenuOpen(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (onNavigate) {
                    onNavigate('main');
                  }
                  setIsMenuOpen(false);
                }
              }}
              className="nav-link"
              aria-label="Home - Justin Potter Portfolio"
              role="button"
              tabIndex={0}
              style={{
                fontSize: '0.7rem',
                fontWeight: '400',
                color: 'var(--primary-white)',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                paddingLeft: 'var(--header-left-padding)',
                marginLeft: '0',
                marginTop: 'calc(var(--header-top-padding) + 0.5rem)',
              }}
            >
              <span className="nav-bracket">[</span>
              <ScrambleText
                text="Justin Potter"
                isHovered={isLogoHovered}
                scrambleDuration={450}
                preserveSpaces={true}
                retriggerKey={logoRetriggerKey}
              />
              <span className="nav-bracket">]</span>
            </motion.a>

            {/* Navigation Links - Hidden on mobile, shown on desktop */}
            <div 
              className="desktop-nav"
              style={{
                display: 'flex',
                gap: 'calc(var(--spacing-xl) + 1.5rem)',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 'calc(var(--header-top-padding) + 0.5rem)',
                transform: 'translateX(-4.3rem)'
              }}
            >
              {navItems.map((item) => {
                const isActive = activeView === item.view;
                const isHovered = hoveredNavItem === item.name || introScrambleActive;
                return (
                  <motion.a
                    key={item.name}
                    href="#"
                    onMouseEnter={() => setHoveredNavItem(item.name)}
                    onMouseLeave={() => setHoveredNavItem(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item.view);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleNavClick(item.view);
                      }
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: DURATION.fast, ease: EASING }}
                    className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={isActive ? 'page' : undefined}
                    role="link"
                    tabIndex={0}
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: '400',
                      color: 'var(--primary-white)',
                      textDecoration: 'none',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      opacity: 1,
                      cursor: 'pointer'
                    }}
                  >
                    <span 
                      className={`nav-bracket ${isActive ? 'nav-bracket-active' : ''}`}
                      style={isActive ? { 
                        color: 'var(--lime-green)',
                        fontWeight: 500
                      } : {}}
                    >
                      [
                    </span>
                    <ScrambleText
                      text={item.name}
                      isHovered={isHovered}
                      scrambleDuration={450}
                      preserveSpaces={true}
                      retriggerKey={navItemRetriggerKeysRef.current[item.name] || 0}
                    />
                    <span 
                      className={`nav-bracket ${isActive ? 'nav-bracket-active' : ''}`}
                      style={isActive ? { 
                        color: 'var(--lime-green)',
                        fontWeight: 500
                      } : {}}
                    >
                      ]
                    </span>
                  </motion.a>
                );
              })}
            </div>

            {/* Mobile Menu Button - Transforms to X when menu is open */}
            <motion.button
              className="mobile-menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsMenuOpen(!isMenuOpen);
                }
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                marginRight: 'var(--header-left-padding)',
                marginTop: 'var(--header-top-padding)',
                zIndex: 1002,
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                minWidth: '44px',
                minHeight: '44px',
                position: 'relative',
                touchAction: 'manipulation'
              }}
            >
              <motion.span
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 8 : 0
                }}
                transition={{ duration: DURATION.fast, ease: EASING }}
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'var(--primary-white)',
                  display: 'block'
                }}
              />
              <motion.span
                animate={{
                  opacity: isMenuOpen ? 0 : 1
                }}
                transition={{ duration: DURATION.fast, ease: EASING }}
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'var(--primary-white)',
                  display: 'block'
                }}
              />
              <motion.span
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -8 : 0
                }}
                transition={{ duration: DURATION.fast, ease: EASING }}
                style={{
                  width: '20px',
                  height: '2px',
                  backgroundColor: 'var(--primary-white)',
                  display: 'block'
                }}
              />
            </motion.button>
          </nav>
        </div>
      </motion.header>

      {/* Overlay Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.normal, ease: EASING }}
              onClick={(e) => {
                // Only close if clicking directly on backdrop, not on menu content
                if (e.target === e.currentTarget) {
                  setIsMenuOpen(false);
                }
              }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(20px)',
                zIndex: 999,
                cursor: 'pointer'
              }}
            />

            {/* Menu Content */}
            <motion.div
              id="mobile-menu"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={(e) => e.stopPropagation()}
              role="menu"
              aria-label="Mobile navigation menu"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1001,
                padding: 'var(--spacing-xl)',
                pointerEvents: 'auto'
              }}
            >
              {/* Navigation Items */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-lg)',
                alignItems: 'center'
              }}>
                {navItems.map((item, index) => {
                  const isActive = activeView === item.view;
                  const menuItem = (
                    <motion.div
                      key={item.name}
                      variants={itemVariants}
                      style={{ textAlign: 'center' }}
                    >
                      <motion.a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.view);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleNavClick(item.view);
                          } else if (e.key === 'Escape') {
                            setIsMenuOpen(false);
                          }
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          x: 10
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: DURATION.fast, ease: EASING }}
                        role="menuitem"
                        aria-label={`Navigate to ${item.label}`}
                        aria-current={isActive ? 'page' : undefined}
                        tabIndex={0}
                        style={{
                          fontSize: 'clamp(2rem, 6vw, 4rem)',
                          fontWeight: 400,
                          color: 'var(--primary-white)',
                          textDecoration: 'none',
                          letterSpacing: '0.05em',
                          display: 'block',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <span style={{ opacity: 0.3 }}>[</span>
                        {item.name}
                        <span style={{ opacity: 0.3 }}>]</span>
                      </motion.a>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: DURATION.fast, delay: 0.3 + index * 0.1, ease: EASING }}
                        style={{
                          fontSize: '0.875rem',
                          color: 'var(--primary-white)',
                          marginTop: '0.5rem',
                          fontWeight: 300,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase'
                        }}
                      >
                        {item.label}
                      </motion.p>
                    </motion.div>
                  );
                  return menuItem;
                })}
              </div>

              {/* Footer Info in Menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.6, ease: EASING }}
                style={{
                  position: 'absolute',
                  bottom: 'var(--spacing-lg)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  color: 'var(--primary-white)',
                  fontWeight: 300,
                  letterSpacing: '0.05em'
                }}
              >
                <p style={{ margin: 0 }}>
                  Portfolio 2K26
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
