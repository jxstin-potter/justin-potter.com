import React from 'react';
import { motion } from 'framer-motion';
import emailIcon from '../assets/email.png';
import linkedinIcon from '../assets/linkedin.png';
import githubIcon from '../assets/github.png';
import Footer from '../components/Footer';

const Contact = () => {
  const contactInfo = {
    email: 'Bjmpotter@gmail.com',
    location: 'Brooklyn, NY',
    availability: 'Available for new opportunities'
  };

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
    },
    {
      name: 'Email',
      url: 'mailto:Bjmpotter@gmail.com',
      icon: emailIcon
    }
  ];

  return (
    <section 
      id="contact" 
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
        backgroundColor: 'transparent'
      }}
    >
      <div className="container" style={{ width: '100%', maxWidth: '1200px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}
        >
          <motion.div style={{ 
            color: 'var(--medium-grey)', 
            fontSize: '0.875rem',
            fontWeight: 400,
            marginBottom: 'var(--spacing-sm)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>
            Get in Touch
          </motion.div>
          <motion.h2 style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 400,
            color: 'var(--primary-white)',
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Let's Work Together
          </motion.h2>
        </motion.div>
        
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              lineHeight: 1.8,
              color: 'var(--medium-grey)',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            I'm always interested in new opportunities and exciting projects. 
            Whether you have a question or just want to say hi, feel free to reach out!
          </motion.p>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-xl)'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ 
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--dark-grey)',
                borderRadius: '8px',
                border: '1px solid var(--medium-grey)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                width: '60px',
                height: '60px',
                margin: '0 auto var(--spacing-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={emailIcon} 
                  alt="Email" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h4 style={{ 
                fontSize: '1.125rem',
                fontWeight: 500,
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--primary-black)'
              }}>
                Email
              </h4>
              <a href={`mailto:${contactInfo.email}`} style={{ 
                color: 'var(--primary-white)',
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--medium-grey)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--primary-white)';
              }}>
                {contactInfo.email}
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ 
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--dark-grey)',
                borderRadius: '8px',
                border: '1px solid var(--medium-grey)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: 'var(--spacing-sm)',
                opacity: '0.7'
              }}>
                📍
              </div>
              <h4 style={{ 
                fontSize: '1.125rem',
                fontWeight: 500,
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--primary-black)'
              }}>
                Location
              </h4>
              <p style={{ 
                color: 'var(--medium-grey)',
                fontSize: '1rem',
                marginBottom: '0'
              }}>
                {contactInfo.location}
              </p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              style={{ 
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--dark-grey)',
                borderRadius: '8px',
                border: '1px solid var(--medium-grey)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ 
                fontSize: '2rem', 
                marginBottom: 'var(--spacing-sm)',
                opacity: '0.7'
              }}>
                ✅
              </div>
              <h4 style={{ 
                fontSize: '1.125rem',
                fontWeight: 500,
                marginBottom: 'var(--spacing-sm)',
                color: 'var(--primary-black)'
              }}>
                Status
              </h4>
              <p style={{ 
                color: 'var(--medium-grey)',
                fontSize: '1rem',
                marginBottom: '0'
              }}>
                {contactInfo.availability}
              </p>
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 400,
              marginBottom: 'var(--spacing-md)',
              color: 'var(--primary-black)'
            }}>
              Connect With Me
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 'var(--spacing-md)',
              flexWrap: 'wrap'
            }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--dark-grey)',
                    borderRadius: '8px',
                    border: '1px solid var(--medium-grey)',
                    textDecoration: 'none',
                    color: 'var(--primary-white)',
                    transition: 'all 0.3s ease',
                    minWidth: '120px'
                  }}
                >
                  <div style={{ 
                    width: '40px',
                    height: '40px',
                    marginBottom: 'var(--spacing-xs)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={social.icon} 
                      alt={social.name} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  <span style={{ 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    {social.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer showFooter={true} />
    </section>
  );
};

export default Contact;
