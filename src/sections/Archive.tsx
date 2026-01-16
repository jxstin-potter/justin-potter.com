import { motion } from 'framer-motion';
import project1Image from '../assets/landingpage.png';
import { DURATION, EASING } from '../utils/animations';
import Footer from '../components/layout/Footer';

const Archive = () => {

  const archiveProjects = [
    {
      id: 1,
      title: 'Dataspot',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024,
      description: 'Branding concept'
    },
    {
      id: 2,
      title: 'Malea Studio',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024,
      description: 'Website home page'
    },
    {
      id: 3,
      title: 'Intune',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2023,
      description: 'Concept poster'
    },
    {
      id: 4,
      title: 'PlanCo',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2022,
      description: 'Design Challenge'
    },
    {
      id: 5,
      title: 'Vantage Point',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2023,
      description: 'Promotional Flyer'
    },
    {
      id: 6,
      title: 'Dataspot',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024,
      description: 'Website concept'
    },
    {
      id: 7,
      title: 'Malea Studio',
      imageUrl: project1Image,
      liveUrl: '#',
      year: 2024,
      description: 'Website'
    }
  ];


  return (
    <section
      id="archive"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 'var(--spacing-xl)',
        paddingBottom: 'var(--spacing-xl)',
        paddingLeft: 'var(--projects-section-padding)',
        paddingRight: 'var(--projects-section-padding)',
        backgroundColor: 'transparent',
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: '1200px'
      }}>
        {/* Archive Header */}
        <motion.div
          className="archive-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.slow, ease: EASING }}
          style={{
            marginBottom: 'var(--spacing-xl)',
            textAlign: 'center',
            position: 'absolute',
            left: '50%',
            top: '44%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1
          }}
        >
          <h1 style={{
            fontSize: '90px',
            fontWeight: 700,
            color: 'var(--primary-white)',
            margin: 0,
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-primary)',
            textTransform: 'uppercase'
          }}>
            Archive
          </h1>
          <p style={{
            fontSize: '0.5rem',
            color: 'var(--medium-grey)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            margin: 0
          }}>
            Scroll to Discover
          </p>
        </motion.div>

        {/* Archive Projects - Alternating Left/Right Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-xl)',
          width: '100%'
        }}>
          {archiveProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            const alignLeft = isEven;

            return (
            <motion.div
              key={project.id}
              initial={{
                opacity: 0,
                x: alignLeft ? -100 : 100,
                y: 50
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                y: 0
              }}
              viewport={{
                once: false,
                margin: "-100px"
              }}
              transition={{
                duration: DURATION.slow,
                ease: EASING
              }}
              whileHover={{
                scale: 1.01,
                transition: { duration: DURATION.fast, ease: EASING }
              }}
              className="bracket-hover archive-project-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--spacing-md)',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '50%',
                alignSelf: alignLeft ? 'flex-start' : 'flex-end',
                marginLeft: alignLeft ? 0 : 'auto',
                marginRight: alignLeft ? 'auto' : 0,
                position: 'relative',
                zIndex: 2
              }}
            >
              {/* COMING SOON Display */}
              <motion.div
                style={{
                  width: '100%',
                  height: 'clamp(200px, 30vw, 350px)',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'var(--dark-grey)',
                  borderRadius: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  style={{
                    fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                    color: 'var(--medium-grey)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                >
                  COMING SOON
                </motion.div>

                {/* Project Number - Bottom Left */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  fontSize: '0.875rem',
                  color: 'var(--primary-white)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.1em',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '2px'
                }}>
                  <span className="bracket">[</span>
                  {String(index + 1).padStart(2, '0')}
                  <span className="bracket">]</span>
                </div>
              </motion.div>
            </motion.div>
            );
          })}
        </div>
      </div>
      <Footer showFooter={true} />
    </section>
  );
};

export default Archive;
