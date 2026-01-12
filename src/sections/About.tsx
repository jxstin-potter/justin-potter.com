import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DURATION, EASING } from '../utils/animations';
import linkedinIcon from '../assets/linkedin.png';
import githubIcon from '../assets/github.png';
import Footer from '../components/Footer';

const About = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = 'Bjmpotter@gmail.com';
  
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/justin-mpotter/',
      icon: linkedinIcon
    },
    {
      name: 'GitHub',
      url: 'https://github.com/whitelight-whiteheat',
      icon: githubIcon
    }
  ];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  return (
    <section 
      id="about" 
      style={{ 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'auto',
        paddingTop: 'calc(var(--spacing-lg) + 80px)',
        paddingBottom: 'var(--spacing-xl)',
        paddingLeft: 'var(--projects-section-padding)',
        paddingRight: 'var(--projects-section-padding)',
        backgroundColor: 'transparent',
        position: 'relative'
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASING }}
        style={{
          position: 'absolute',
          top: 'calc(var(--header-top-padding) + 1.5rem + var(--spacing-xl))',
          left: 'var(--header-left-padding)',
          fontSize: 'clamp(3rem, 8vw, 6rem)',
          fontWeight: 700,
          color: 'var(--primary-white)',
          margin: 0,
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-primary)',
          textTransform: 'uppercase'
        }}
      >
        Info
      </motion.h1>
      <div style={{ 
        width: 'calc(100% - var(--header-left-padding) - var(--projects-section-padding))',
        maxWidth: '800px',
        position: 'absolute',
        top: 'calc(var(--header-top-padding) + 1.5rem + var(--spacing-xl) + clamp(3rem, 8vw, 6rem) + var(--spacing-lg))',
        left: 'var(--header-left-padding)'
      }}>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, delay: 0.1, ease: EASING }}
          style={{
            marginBottom: 'var(--spacing-xl)'
          }}
        >
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--primary-white)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-primary)'
          }}>
            I'm Justin Potter, a fullstack developer based in Brooklyn, NY.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--primary-white)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-primary)'
          }}>
            Originally from Arlington, Virginia and passionate about creating digital experiences that stand out and drive meaningful results.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--primary-white)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-primary)'
          }}>
            Specializing in fullstack development, user-centered design, and modern web technologies.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--primary-white)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-primary)'
          }}>
            Passionate about creating memorable experiences through clean code, intuitive interfaces, and thoughtful design.
          </p>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--primary-white)',
            marginBottom: 'var(--spacing-xl)',
            fontFamily: 'var(--font-primary)'
          }}>
            Available for freelance opportunities.
          </p>
        </motion.div>

      </div>

      {/* Email Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, delay: 0.2, ease: EASING }}
        style={{
          position: 'absolute',
          bottom: 'calc(var(--spacing-xl) + 6rem)',
          right: 'var(--header-right-padding)',
          textAlign: 'right'
        }}
      >
        <h3 style={{
          fontSize: '0.625rem',
          fontWeight: 400,
          color: 'var(--medium-grey)',
          margin: 0,
          marginBottom: '0.25rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-mono)'
        }}>
          Email
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <a
            href={`mailto:${email}`}
            style={{
              fontSize: '0.75rem',
              color: 'var(--primary-white)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--lime-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--primary-white)';
            }}
          >
            {email}
          </a>
          <button
            onClick={handleCopyEmail}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--medium-grey)',
              fontSize: '0.625rem',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              padding: '0.125rem 0.375rem',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--lime-green)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--medium-grey)';
            }}
          >
            {copiedEmail ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, delay: 0.3, ease: EASING }}
        style={{
          position: 'absolute',
          bottom: 'var(--spacing-xl)',
          right: 'var(--header-right-padding)'
        }}
      >
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-sm)',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}>
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: DURATION.normal, delay: 0.4 + index * 0.1, ease: EASING }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: DURATION.fast, ease: EASING }
              }}
              style={{
                textDecoration: 'none',
                color: 'var(--primary-white)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--lime-green)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--primary-white)';
              }}
            >
              {social.name}
            </motion.a>
          ))}
        </div>
      </motion.div>
      <Footer showFooter={true} />
    </section>
  );
};

export default About;
