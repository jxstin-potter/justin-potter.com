import React from 'react';
import { motion } from 'framer-motion';
import { DURATION, EASING } from '../utils/animations';

interface FooterProps {
  showFooter?: boolean;
}

const Footer = ({ showFooter = false }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: showFooter ? 1 : 0,
        y: showFooter ? 0 : 20
      }}
      transition={{ duration: DURATION.normal, ease: EASING }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        backgroundColor: 'transparent',
        padding: '0.5rem var(--spacing-md)',
        paddingBottom: '1rem',
        pointerEvents: showFooter ? 'auto' : 'none',
        visibility: showFooter ? 'visible' : 'hidden',
        height: showFooter ? 'auto' : '76px',
        overflow: 'hidden',
        zIndex: 10
      }}
      onAnimationComplete={() => {
        // Animation complete
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        padding: '0 0.5rem',
        paddingBottom: '0',
        display: 'flex',
        alignItems: 'center',
        minHeight: '1.5rem'
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <p style={{
            color: 'var(--primary-white)',
            fontSize: '0.75rem',
            margin: 0,
            fontWeight: 300,
            letterSpacing: '0.05em'
          }}>
            © {currentYear}
          </p>
          <span style={{
            color: 'var(--medium-grey)',
            fontSize: '0.75rem'
          }}>•</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // Add imprint/privacy modal or page navigation here
            }}
            style={{
              color: 'var(--primary-white)',
              fontSize: '0.75rem',
              fontWeight: 300,
              letterSpacing: '0.05em',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--lime-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--primary-white)';
            }}
          >
            Imprint & Data Privacy
          </a>
        </div>
        <p style={{
          position: 'absolute',
          left: 'calc(0.5rem + 320px * 3 + 1rem * 3)',
          color: 'var(--medium-grey)',
          fontSize: '0.75rem',
          margin: 0,
          fontWeight: 300,
          letterSpacing: '0.05em',
          fontFamily: 'var(--font-mono)'
        }}>
          Design & Development by Justin Potter
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
