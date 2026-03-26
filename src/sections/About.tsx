import { motion } from 'framer-motion';
import { DURATION, EASING } from '../utils/animations';
import linkedinIcon from '../assets/linkedin.png';
import githubIcon from '../assets/github.png';
import Footer from '../components/layout/Footer';
import meImage from '../assets/me.png';

/**
 * About
 *
 * Renders the portfolio "Info" section, including:
 * - headline/title
 * - portrait image
 * - personal summary copy
 * - contact/social links
 * - footer
 */
const About = () => {
  /**
   * Primary contact email used in the social links collection.
   * Kept as a constant so it can be reused cleanly in the config below.
   */
  const email = 'Bjmpotter@gmail.com';

  /**
   * Data-driven social/contact links.
   * This keeps the UI easy to maintain and avoids repeating markup.
   */
  const socialLinks = [
    {
      name: 'Email',
      url: `mailto:${email}`,
      icon: null,
      primary: 'Email',
      secondary: email.toUpperCase(),
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/justin-mpotter/',
      icon: linkedinIcon,
      primary: 'LinkedIn',
      secondary: '/IN/JUSTIN-MPOTTER',
    },
    {
      name: 'GitHub',
      url: 'https://github.com/whitelight-whiteheat',
      icon: githubIcon,
      primary: 'GitHub',
      secondary: '/WHITELIGHT-WHITEHEAT',
    },
  ];

  return (
    <section
      id="about"
      className="about-section"
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
        position: 'relative',
      }}
    >
      <div className="about-container">
        {/* Section title positioned near the top-left of the layout grid. */}
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASING }}
          style={{
            position: 'absolute',
            top: 'calc(var(--header-top-padding) + 1.5rem + var(--spacing-lg))',
            left: 'var(--header-left-padding)',
            fontSize: 'clamp(4rem, 10vw, 8rem)',
            fontWeight: 700,
            color: 'var(--primary-white)',
            margin: 0,
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-primary)',
            textTransform: 'uppercase',
          }}
        >
          Info
        </motion.h1>

        {/* Portrait image anchored to the right side of the section. */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: DURATION.slow, delay: 0.15, ease: EASING }}
          style={{
            position: 'absolute',
            top: '110px',
            right: 'var(--header-right-padding)',
            width: 'clamp(240px, 24vw, 340px)',
            zIndex: 2,
          }}
        >
          <img
            src={meImage}
            alt="Justin Potter portrait"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'cover',
              borderRadius: '2px',
            }}
          />
        </motion.div>

        {/* Main text content wrapper aligned to the left column. */}
        <div
          className="about-content-wrapper"
          style={{
            width: 'calc(100% - var(--header-left-padding) - var(--projects-section-padding))',
            maxWidth: '800px',
            position: 'absolute',
            top: 'calc(var(--header-top-padding) + 1.5rem + var(--spacing-xl) + clamp(3rem, 8vw, 6rem) + var(--spacing-lg))',
            left: 'var(--header-left-padding)',
          }}
        >
          {/* Introductory copy block with entrance animation. */}
          <motion.div
            className="about-main-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.slow, delay: 0.1, ease: EASING }}
            style={{
              marginTop: 'calc(var(--spacing-xl) + var(--spacing-md))',
              marginBottom: 'var(--spacing-xl)',
              maxWidth: '600px',
            }}
          >
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.8,
                color: 'var(--primary-white)',
                marginBottom: 'var(--spacing-md)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              I'm Justin Potter, a front-end developer based in Brooklyn, NY.
              Originally from Arlington, Virginia, I'm passionate about creating
              digital experiences that stand out and drive meaningful results.
            </p>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.8,
                color: 'var(--primary-white)',
                marginBottom: 'var(--spacing-md)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              Specializing in front-end development, user-centered design, and
              modern web technologies. I create memorable experiences through
              clean code, intuitive interfaces, and thoughtful design.
            </p>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                lineHeight: 1.8,
                color: 'var(--primary-white)',
                marginBottom: 'var(--spacing-xl)',
                fontFamily: 'var(--font-primary)',
              }}
            >
              Available for freelance opportunities.
            </p>
          </motion.div>
        </div>

        {/* Social/contact block positioned in the lower-right area as a single unit. */}
        <motion.div
          className="about-social-links"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, delay: 0.2, ease: EASING }}
          style={{
            position: 'absolute',
            bottom: '80px',
            right: 'var(--header-right-padding)',
            textAlign: 'right',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            zIndex: 5,
          }}
        >
          {/* Two-column grid for contact items. */}
          <div
            className="social-links-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, auto)',
              gap: '2rem 9rem',
              alignItems: 'start',
              justifyItems: 'end',
            }}
          >
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target={social.name === 'Email' ? undefined : '_blank'}
                rel={social.name === 'Email' ? undefined : 'noopener noreferrer'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.normal,
                  delay: 0.3 + index * 0.1,
                  ease: EASING,
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'var(--primary-white)',
                  fontFamily: 'var(--font-primary)',
                  transition:
                    'opacity var(--motion-duration-fast) var(--motion-ease-standard)',
                  textAlign: 'right',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                {/* Primary row: icon + label + outbound indicator when needed. */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem',
                    justifyContent: 'flex-end',
                  }}
                >
                  {/* Render image icon for social platforms that use one. */}
                  {social.icon && (
                    <img
                      src={social.icon}
                      alt={social.name}
                      style={{
                        width: '12px',
                        height: '12px',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)',
                        opacity: '1',
                        transition:
                          'opacity var(--motion-duration-fast) var(--motion-ease-standard)',
                        pointerEvents: 'none',
                      }}
                    />
                  )}

                  {/* Render inline mail icon for the email item. */}
                  {!social.icon && social.name === 'Email' && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        opacity: '1',
                        pointerEvents: 'none',
                      }}
                    >
                      <rect
                        x="2"
                        y="2"
                        width="8"
                        height="8"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                      <path
                        d="M2 2L6 6L10 2"
                        stroke="white"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  )}

                  {/* Primary link label. */}
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      color: 'var(--primary-white)',
                    }}
                  >
                    {social.primary}
                  </span>

                  {/* Outbound icon shown only for external links. */}
                  {social.name !== 'Email' && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        opacity: '0.8',
                        pointerEvents: 'none',
                        marginLeft: '2px',
                      }}
                    >
                      <path
                        d="M1 9L9 1M9 1H3M9 1V7"
                        stroke="white"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </div>

                {/* Secondary line used for email address / profile path. */}
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 400,
                    letterSpacing: '0.02em',
                    color: 'var(--primary-white)',
                    opacity: '0.7',
                    lineHeight: '1.4',
                  }}
                >
                  {social.secondary}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Site footer rendered at the bottom of the section. */}
      <Footer showFooter={true} />
    </section>
  );
};

export default About;