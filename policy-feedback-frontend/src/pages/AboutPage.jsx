import React from 'react';
import { Link } from 'react-router-dom';
import OrnateFrame from '../components/OrnateFrame';

// Clean SVG Line Icons
const LandmarkIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a0016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7 12 2" />
  </svg>
);

const ShieldLockIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a0016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <rect x="9" y="11" width="6" height="5" rx="1" />
    <path d="M10 11V9a2 2 0 0 1 4 0v2" />
  </svg>
);

const CpuChipIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a0016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" />
    <line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" />
    <line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" />
    <line x1="20" y1="15" x2="23" y2="15" />
    <line x1="1" y1="9" x2="4" y2="9" />
    <line x1="1" y1="15" x2="4" y2="15" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7a0016" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>
);

export default function AboutPage() {
  return (
    <div style={styles.container}>
      
      {/* Page Header */}
      <div style={styles.header}>
        <div style={styles.badge}>Civic Technology & AI Transparency</div>
        <h1 style={styles.title}>How PolicyPulse Works</h1>
        <p style={styles.subtitle}>
          Connecting citizen voices with legislative decision-makers using state-of-the-art Natural Language Understanding.
        </p>
      </div>

      <div style={styles.contentGrid}>
        
        {/* Section 1 */}
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <LandmarkIcon />
          </div>
          <h2 style={styles.cardTitle}>1. Direct Legislative Engagement</h2>
          <p style={styles.cardText}>
            PolicyPulse provides a central, verified platform where state legislative proposals are published prior to final enactment. Citizens can review full policy proposals, understand key pillars, and submit official feedback.
          </p>
        </div>

        {/* Section 2 */}
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <ShieldLockIcon />
          </div>
          <h2 style={styles.cardTitle}>2. 1-Citizen-1-Feedback Standard</h2>
          <p style={styles.cardText}>
            To eliminate automated spam and prevent opinion manipulation, all feedback requires an authenticated citizen account powered by JWT encryption. Each citizen is restricted to **1 comment per policy proposal**, ensuring a fair public representation.
          </p>
        </div>

        {/* Section 3 */}
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <CpuChipIcon />
          </div>
          <h2 style={styles.cardTitle}>3. Real-Time AI Sentiment Engine</h2>
          <p style={styles.cardText}>
            When a comment is submitted, it is processed in real time by an **Artificial Intelligence NLU Model**. The system automatically categorizes feedback into:
          </p>
          <ul style={styles.list}>
            <li><strong>WHAT (Sentiment):</strong> Favorable, Critical, Mixed, or Neutral</li>
            <li><strong>WHICH (Policy Pillar):</strong> Affordability, Safety & Quality, Accessibility, Resource Allocation, or General</li>
            <li><strong>WHY (Reasoning):</strong> A 1-sentence executive reasoning summary</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <BarChartIcon />
          </div>
          <h2 style={styles.cardTitle}>4. Executive Policy Dashboard</h2>
          <p style={styles.cardText}>
            Policy officers and state administrators access a dedicated analytics console displaying live sentiment breakdown bars, pillar leaderboards, and AI-summarized lists of key supportive factors vs. primary risks and objections.
          </p>
        </div>

      </div>

      {/* CTA Box */}
      <OrnateFrame style={styles.ctaFrame} innerStyle={styles.ctaInner}>
        <h2 style={styles.ctaTitle}>Ready to Participate?</h2>
        <p style={styles.ctaSubtitle}>Review active policy proposals and make your voice heard today.</p>
        <Link to="/policies" style={styles.ctaBtn}>Browse Policy Proposals →</Link>
      </OrnateFrame>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#7a0016',
    backgroundColor: '#fef3c7',
    border: '1px solid #b8860b',
    padding: '0.35rem 0.95rem',
    borderRadius: '99px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '1rem',
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '3.2rem',
    fontWeight: '700',
    color: '#f3e5ab',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
    margin: '0 0 0.75rem 0',
  },
  subtitle: {
    fontSize: '1.05rem',
    color: '#fdf7e7',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.65',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    gap: '1.75rem',
    marginBottom: '3rem',
  },
  card: {
    backgroundColor: '#fffdf2',
    borderRadius: '14px',
    border: '2px solid #d4af37',
    padding: '2rem',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  iconWrapper: {
    backgroundColor: '#fef3c7',
    border: '1.5px solid #d4af37',
    borderRadius: '10px',
    padding: '0.65rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  cardTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#7a0016',
    marginBottom: '0.75rem',
    textAlign: 'left',
  },
  cardText: {
    fontSize: '0.95rem',
    color: '#44332a',
    lineHeight: '1.65',
    marginBottom: '1rem',
    textAlign: 'left',
  },
  list: {
    paddingLeft: '1.25rem',
    color: '#44332a',
    fontSize: '0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    textAlign: 'left',
  },
  ctaFrame: {
    marginTop: '2rem',
  },
  ctaInner: {
    textAlign: 'center',
    padding: '3rem 2rem',
  },
  ctaTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#7a0016',
    marginBottom: '0.5rem',
  },
  ctaSubtitle: {
    fontSize: '1.02rem',
    color: '#554238',
    marginBottom: '1.5rem',
  },
  ctaBtn: {
    display: 'inline-block',
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    padding: '0.9rem 1.85rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    border: '1px solid #d4af37',
    boxShadow: '0 4px 15px rgba(122,0,22,0.35)',
  },
};
