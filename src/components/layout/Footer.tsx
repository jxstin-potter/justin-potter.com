import React from "react";
import { motion } from "framer-motion";
import { DURATION, EASING } from "../../utils/animations";

interface FooterProps {
  showFooter?: boolean;
}

const Footer = ({ showFooter = false }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  return (
    <motion.footer
      className="site-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: showFooter ? 1 : 0,
        y: showFooter ? 0 : 20,
      }}
      transition={{ duration: DURATION.normal, ease: EASING }}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        backgroundColor: "transparent",
        padding: "0.5rem var(--spacing-md)",
        paddingBottom: "1rem",
        pointerEvents: showFooter ? "auto" : "none",
        visibility: showFooter ? "visible" : "hidden",
        height: showFooter ? "auto" : "76px",
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      <div
        className="site-footer-inner"
        style={{
          position: "relative",
          width: "100%",
          padding: "0 0.5rem",
          paddingBottom: "0",
          display: "flex",
          alignItems: "center",
          minHeight: "1.5rem",
        }}
      >
        <div
          className="site-footer-meta"
          style={{
            display: "flex",
            gap: "calc(var(--spacing-md) + 16.8rem)",
            alignItems: "center",
            flexWrap: "wrap",
            transform: "translateX(-0.75rem)",
          }}
        >
          <p
            className="site-footer-year"
            style={{
              color: "var(--primary-white)",
              fontSize: "0.75rem",
              margin: 0,
              fontWeight: 300,
              letterSpacing: "0.05em",
            }}
          >
            © {currentYear}
          </p>
          <button
            onClick={() => {
              // Add imprint/privacy modal or page navigation here
            }}
            style={{
              color: "var(--primary-white)",
              fontSize: "0.75rem",
              fontWeight: 300,
              letterSpacing: "0.05em",
              textDecoration: "none",
              transition:
                "color var(--motion-duration-fast) var(--motion-ease-standard)",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
              fontFamily: "inherit",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.color = "var(--lime-green)";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.color = "var(--primary-white)";
            }}
          >
            Imprint & Data Privacy
          </button>
        </div>
        <p
          className="footer-credit"
          style={{
            position: "absolute",
            left: "calc(0.5rem + 320px * 3 + 1rem * 3.2)",
            color: "var(--medium-grey)",
            fontSize: "0.75rem",
            margin: 0,
            fontWeight: 300,
            letterSpacing: "0.05em",
            fontFamily: "var(--font-mono)",
          }}
        >
          Design & Development by Justin Potter
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
