import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrnateFrame from '../components/OrnateFrame';
import LoadingScreen from '../components/LoadingScreen';

const API_BASE = 'http://127.0.0.1:8001/api';

export default function HomePage() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const minDelay = new Promise(resolve => setTimeout(resolve, 1800));
    const fetchData = fetch(`${API_BASE}/policies/`).then(r => r.json());

    Promise.all([fetchData, minDelay])
      .then(([data]) => setPolicies(data))
      .catch(err => console.error('Failed to load policies:', err))
      .finally(() => setLoading(false));
  }, []);

  const totalComments = policies.reduce((acc, p) => acc + (p.comment_count || 0), 0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((rect.height / 2 - (e.clientY - rect.top)) / (rect.height / 2)) * 6;
    const rotateY = (((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01,1.01,1.01)`;
    card.style.boxShadow = `0 15px 35px rgba(122, 0, 22, 0.25)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
  };

  if (loading) {
    return <LoadingScreen text="Loading Legislative Proposals..." />;
  }

  return (
    <div style={styles.container}>
      
      {/* Hero Section in Royal Ornate Frame */}
      <OrnateFrame style={styles.heroFrame} innerStyle={styles.heroInner}>
        
        {/* Background Watermark Emblem */}
        <img
          src="/assets/tn-emblem.png"
          alt="Government of Tamil Nadu Emblem"
          style={styles.heroEmblemWatermark}
        />

        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>Official Government Platform</div>
          <h1 style={styles.heroTitle}>
            Empowering Citizens in <span style={{ color: '#7a0016' }}>State Policy Making</span>
          </h1>
          <p style={styles.heroSubtitle}>
            PolicyPulse connects citizens of Tamil Nadu directly with state legislative proposals. Share your feedback, verified by secure account authentication and analyzed in real-time by Artificial Intelligence.
          </p>
          
          {/* Centered Action Buttons */}
          <div style={styles.heroBtns}>
            <Link to="/policies" style={styles.primaryBtn}>Browse Active Policy Proposals →</Link>
            <Link to="/about" style={styles.secondaryBtn}>How AI Sentiment Works</Link>
          </div>
        </div>

      </OrnateFrame>

      {/* High-Level Stats Cards */}
      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{policies.length}</div>
          <div style={styles.statLabel}>Active Policy Proposals</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{totalComments}</div>
          <div style={styles.statLabel}>Verified Citizen Comments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>5</div>
          <div style={styles.statLabel}>Analyzed Policy Pillars</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>Real-Time</div>
          <div style={styles.statLabel}>AI Sentiment Analysis</div>
        </div>
      </section>

      {/* Featured Proposals */}
      <section style={styles.featuredSection}>
        <div style={styles.sectionHeader}>
          <div style={styles.sectionBadge}>Public Consultation</div>
          <h2 style={styles.sectionTitle}>Featured Legislative Proposals</h2>
          <p style={styles.sectionSubtitle}>Select a legislative proposal below to review full policy details and submit feedback.</p>
          <Link to="/policies" style={styles.viewAllLink}>View All Policies →</Link>
        </div>

        <div style={styles.cardGrid}>
          {policies.map((policy) => (
              <div
                key={policy.id}
                style={styles.policyCard}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div style={styles.cardBadgeRow}>
                  <span style={styles.activeTag}>● Active Legislative Proposal</span>
                  <span style={styles.dateTag}>Published: {policy.published_date}</span>
                </div>
                <h3 style={styles.cardTitle}>{policy.title}</h3>
                <p style={styles.cardContent}>"{policy.content}"</p>

                <div style={styles.cardFooter}>
                  <span style={styles.commentCount}>
                    💬 {policy.comment_count || 0} Citizen Response{(policy.comment_count || 0) !== 1 ? 's' : ''}
                  </span>
                  <Link to={`/policies/${policy.id}`} style={styles.cardBtn}>
                    View & Participate →
                  </Link>
                </div>
              </div>
            ))}
          </div>
      </section>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  heroFrame: {
    marginBottom: '3rem',
  },
  heroInner: {
    textAlign: 'center',
    padding: '3.5rem 2rem',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fffdf2',
  },
  heroEmblemWatermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '520px',
    height: '520px',
    objectFit: 'contain',
    opacity: 0.07,
    pointerEvents: 'none',
    zIndex: 0,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: '850px',
    margin: '0 auto',
  },
  heroBadge: {
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
    marginBottom: '1.25rem',
  },
  heroTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2a1810',
    letterSpacing: '-0.01em',
    marginBottom: '1rem',
    lineHeight: '1.3',
  },
  heroSubtitle: {
    fontSize: '1.08rem',
    color: '#554238',
    maxWidth: '760px',
    margin: '0 auto 2.25rem auto',
    lineHeight: '1.7',
  },
  heroBtns: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.25rem',
    flexWrap: 'wrap',
    margin: '0 auto',
  },
  primaryBtn: {
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    padding: '0.9rem 1.75rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    border: '1px solid #d4af37',
    boxShadow: '0 4px 15px rgba(122, 0, 22, 0.35)',
    transition: 'all 0.15s ease',
  },
  secondaryBtn: {
    backgroundColor: '#fffdf2',
    color: '#7a0016',
    fontWeight: '700',
    padding: '0.9rem 1.75rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    border: '2px solid #7a0016',
    transition: 'all 0.15s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
  },
  statCard: {
    backgroundColor: '#fffdf2',
    border: '2px solid #d4af37',
    borderRadius: '12px',
    padding: '1.75rem 1.5rem',
    textAlign: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  },
  statNumber: {
    fontFamily: "'Merriweather', serif",
    fontSize: '2.4rem',
    fontWeight: '700',
    color: '#7a0016',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#665247',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  featuredSection: {
    marginTop: '1rem',
  },
  sectionHeader: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  sectionTitle: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#f3e5ab',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: '0.95rem',
    color: '#fdf7e7',
    margin: '0.25rem 0 0 0',
  },
  viewAllLink: {
    color: '#f3e5ab',
    fontWeight: '700',
    fontSize: '0.95rem',
    textDecoration: 'underline',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1.75rem',
  },
  policyCard: {
    backgroundColor: '#fffdf2',
    borderRadius: '14px',
    border: '2px solid #d4af37',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
    transition: 'all 0.15s ease',
  },
  cardBadgeRow: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '0.75rem',
  },
  activeTag: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#7a0016',
    textTransform: 'uppercase',
    marginRight: '0.75rem',
  },
  dateTag: {
    fontSize: '0.78rem',
    color: '#665247',
  },
  cardTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2a1810',
    marginBottom: '0.65rem',
    lineHeight: '1.4',
  },
  cardContent: {
    fontSize: '0.92rem',
    color: '#44332a',
    lineHeight: '1.6',
    marginBottom: '1.5rem',
  },
  cardFooter: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(212, 175, 55, 0.4)',
  },
  commentCount: {
    fontSize: '0.82rem',
    fontWeight: '600',
    color: '#665247',
  },
  cardBtn: {
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#7a0016',
  },
  loadingText: {
    textAlign: 'center',
    padding: '3rem',
    color: '#fdf7e7',
  },
};
