import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          
          {/* Brand Info Column */}
          <div>
            <h3 style={styles.title}>PolicyPulse</h3>
            <p style={styles.desc}>
              Official Citizen Participation & State Policy Analytics Portal of the Government of Tamil Nadu. Empowering public voice in democratic governance.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={styles.subTitle}>Quick Links</h4>
            <ul style={styles.list}>
              <li><Link to="/" style={styles.link}>Home</Link></li>
              <li><Link to="/policies" style={styles.link}>Browse Policy Proposals</Link></li>
              <li><Link to="/about" style={styles.link}>How It Works</Link></li>
              <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal & Governance Column */}
          <div>
            <h4 style={styles.subTitle}>Policies & Legal</h4>
            <ul style={styles.list}>
              <li><Link to="/privacy-policy" style={styles.link}>Privacy Policy</Link></li>
              <li><Link to="/terms-of-use" style={styles.link}>Terms of Use</Link></li>
              <li><Link to="/accessibility" style={styles.link}>Accessibility Statement</Link></li>
              <li><Link to="/rti" style={styles.link}>Right to Information (RTI)</Link></li>
              <li><Link to="/grievance" style={styles.link}>Grievance Redressal</Link></li>
              <li><Link to="/disclaimer" style={styles.link}>Website Policy & Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Row */}
        <div style={styles.bottomRow}>
          <span>© 2026 Government of Tamil Nadu. All rights reserved.</span>
          <span>Department of Information Technology & Digital Services</span>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#3b000a',
    borderTop: '2px solid #d4af37',
    padding: '3rem 1.5rem 1.5rem 1.5rem',
    marginTop: '4rem',
    color: '#fdf7e7',
    fontSize: '0.88rem',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '2.5rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    color: '#f3e5ab',
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
  },
  desc: {
    lineHeight: '1.6',
    maxWidth: '450px',
    color: '#e5d5c0',
  },
  subTitle: {
    color: '#d4af37',
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  link: {
    color: '#fdf7e7',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  },
  bottomRow: {
    display: 'flex',
    justify: 'space-between',
    paddingTop: '1.5rem',
    fontSize: '0.78rem',
    color: '#c5b49d',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
};
