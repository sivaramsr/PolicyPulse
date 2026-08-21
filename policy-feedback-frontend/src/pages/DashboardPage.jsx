import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '../config';
import OrnateFrame from '../components/OrnateFrame';
import LoadingScreen from '../components/LoadingScreen';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Framer Motion Page Flip Variants (Only 1 item in DOM at a time via mode="wait")
const pageFlipVariants = {
  initial: {
    rotateY: -90,
    opacity: 0,
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
  },
  animate: {
    rotateY: 0,
    opacity: 1,
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    transition: {
      duration: 0.32,
      ease: [0.25, 1, 0.5, 1], // Smooth page settle
    },
  },
  exit: {
    rotateY: 90,
    opacity: 0,
    boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
    transition: {
      duration: 0.32,
      ease: [0.5, 0, 0.75, 0], // Smooth page turn away
    },
  },
};

export default function DashboardPage() {
  const [policies, setPolicies] = useState([]);
  const [selectedPolicyId, setSelectedPolicyId] = useState(null);
  const [activePolicy, setActivePolicy] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const minDelay = new Promise(resolve => setTimeout(resolve, 1800));
    const fetchData = fetch(`${API_BASE}/policies/`).then(r => r.json());

    Promise.all([fetchData, minDelay])
      .then(([data]) => {
        setPolicies(data);
        if (data.length > 0) {
          setSelectedPolicyId(data[0].id);
          setActivePolicy(data[0]);
        }
      })
      .catch(err => console.error('Failed to load policies:', err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch Policy Metrics
  const fetchMetrics = useCallback(() => {
    if (!selectedPolicyId) return;
    fetch(`${API_BASE}/policies/${selectedPolicyId}/metrics/`)
      .then(r => r.json())
      .then(setMetrics)
      .catch(err => console.error('Failed to load metrics:', err));
  }, [selectedPolicyId]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Handle Policy Dropdown Switch
  const handlePolicyChange = (newPolicyId) => {
    const nextId = parseInt(newPolicyId);
    if (nextId === selectedPolicyId) return;

    const nextPolicy = policies.find(p => p.id === nextId);
    setSelectedPolicyId(nextId);
    setActivePolicy(nextPolicy);
  };

  if (loading) {
    return <LoadingScreen text="Loading Policy Analytics Dashboard..." />;
  }

  // Render Single Dashboard Content Block
  const renderDashboardPanel = (targetPolicy, targetMetrics) => {
    if (!targetPolicy || !targetMetrics) return null;

    return (
      <div style={styles.panelContainer}>
        {/* Policy Context Card */}
        <div style={styles.policyContextCard}>
          <h2 style={styles.policyTitle}>{targetPolicy.title}</h2>
          <p style={styles.policyDesc}>"{targetPolicy.content}"</p>
        </div>

        {/* Dashboard Grid */}
        <div style={styles.dashboardGrid}>
          {/* Sentiment Breakdown */}
          <div style={styles.cardSection}>
            <h3 style={styles.sectionHeading}>Public Sentiment Breakdown</h3>
            {[
              { label: 'Favorable Support', icon: <CheckIcon />, pct: targetMetrics.positive_pct, fill: styles.fillPos },
              { label: 'Mixed / Neutral', icon: <InfoIcon />, pct: targetMetrics.neutral_pct, fill: styles.fillNeu },
              { label: 'Opposed / Critical', icon: <WarningIcon />, pct: targetMetrics.negative_pct, fill: styles.fillNeg },
            ].map(({ label, icon, pct, fill }) => (
              <div key={label} style={styles.progressWrapper}>
                <div style={styles.progressHeader}>
                  <span style={styles.progressLabel}>{icon}{label}</span>
                  <span>{pct}%</span>
                </div>
                <div style={styles.progressBg}>
                  <div style={{ ...fill, width: `${pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Pillars Leaderboard */}
          <div style={styles.cardSection}>
            <h3 style={styles.sectionHeading}>Most Discussed Policy Pillars</h3>
            {Object.entries(targetMetrics.issue_counts || {})
              .sort((a, b) => b[1] - a[1])
              .map(([issueName, count]) => {
                const maxCount = Math.max(...Object.values(targetMetrics.issue_counts || {}), 1);
                const color = issueName === 'Safety & Quality' ? '#dc2626' : issueName === 'Accessibility' ? '#2563eb' : issueName === 'Affordability' ? '#059669' : issueName === 'Resource Allocation' ? '#d97706' : '#7c3aed';
                return (
                  <div key={issueName} style={styles.pillarWrapper}>
                    <div style={styles.pillarInfo}>
                      <span style={styles.pillarName}>{issueName}</span>
                      <span style={styles.pillarCount}>{count} response{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={styles.pillarBg}>
                      <div style={{ ...styles.pillarFill, width: `${(count / maxCount) * 100}%`, backgroundColor: color }}></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Side-by-Side Reasoning Summaries */}
        <div style={styles.sideBySideGrid}>
          <div style={styles.reasonCard}>
            <h4 style={styles.supportHeading}>Key Supportive Factors (AI Summarized)</h4>
            <ul style={styles.bulletList}>
              {targetMetrics.reasons_for_support?.length > 0 ? (
                targetMetrics.reasons_for_support.map((r, i) => (
                  <li key={i} style={styles.bulletItem}>
                    <span style={{ color: '#059669', marginRight: '8px' }}><ArrowRightIcon /></span>
                    <div>
                      <strong>{r.why}</strong>
                      <span style={styles.bulletUser}> — {r.author}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p style={styles.emptyText}>No supportive feedback recorded yet.</p>
              )}
            </ul>
          </div>

          <div style={styles.reasonCard}>
            <h4 style={styles.concernHeading}>Primary Risks & Objections (AI Summarized)</h4>
            <ul style={styles.bulletList}>
              {targetMetrics.concerns?.length > 0 ? (
                targetMetrics.concerns.map((r, i) => (
                  <li key={i} style={styles.bulletItem}>
                    <span style={{ color: '#dc2626', marginRight: '8px' }}><ArrowRightIcon /></span>
                    <div>
                      <strong>{r.why}</strong>
                      <span style={styles.bulletUser}> — {r.author}</span>
                    </div>
                  </li>
                ))
              ) : (
                <p style={styles.emptyText}>No critical concerns raised yet.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <OrnateFrame style={styles.mainFrame}>
        
        {/* Header Row */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.badgeRow}>
              <span style={styles.analyticsBadge}>Analytics Console</span>
              <span style={styles.aiBadge}>Real-Time AI Sentiment Analysis · Active</span>
            </div>
            <h1 style={styles.title}>Policy Analytics Dashboard</h1>
            <p style={styles.subtitle}>Real-time executive analysis of public opinion and policy pillars.</p>
          </div>

          <div style={styles.selectorBox}>
            <label style={styles.selectorLabel}>Policy Target Selection:</label>
            <select
              value={selectedPolicyId || ''}
              onChange={(e) => handlePolicyChange(e.target.value)}
              style={styles.dropdown}
            >
              {policies.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3D BOOK PAGE FLIP CONTAINER (Perspective 1500px, mode="wait" ensures 1 content panel in DOM) */}
        <div style={{ perspective: '1500px', width: '100%', overflow: 'hidden' }}>
          <AnimatePresence mode="wait">
            {activePolicy && metrics && (
              <motion.div
                key={selectedPolicyId}
                variants={pageFlipVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  width: '100%',
                }}
              >
                {renderDashboardPanel(activePolicy, metrics)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </OrnateFrame>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  mainFrame: {
    marginBottom: '2rem',
  },
  headerRow: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1.5rem',
    marginBottom: '2rem',
    borderBottom: '2px solid rgba(212, 175, 55, 0.4)',
    paddingBottom: '1.5rem',
  },
  badgeRow: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  analyticsBadge: {
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#7a0016',
    backgroundColor: '#fef3c7',
    border: '1px solid #b8860b',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  aiBadge: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '3.2rem',
    fontWeight: '700',
    color: '#7a0016',
    margin: '0 0 0.25rem 0',
    lineHeight: '1.1',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#554238',
    margin: 0,
  },
  selectorBox: {
    backgroundColor: '#fbf3df',
    padding: '0.75rem 1.25rem',
    borderRadius: '12px',
    border: '2px solid #d4af37',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  selectorLabel: {
    fontSize: '0.75rem',
    color: '#7a0016',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  dropdown: {
    backgroundColor: '#fffdf2',
    color: '#2a1810',
    border: '1.5px solid #d4af37',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer',
  },
  panelContainer: {
    width: '100%',
    backgroundColor: '#fffdf2',
  },
  policyContextCard: {
    backgroundColor: '#fbf3df',
    borderRadius: '12px',
    padding: '1.25rem 1.5rem',
    marginBottom: '2rem',
    borderLeft: '4px solid #7a0016',
    borderTop: '1px solid rgba(212, 175, 55, 0.4)',
    borderRight: '1px solid rgba(212, 175, 55, 0.4)',
    borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
  },
  policyTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#2a1810',
    margin: '0 0 0.35rem 0',
  },
  policyDesc: {
    fontSize: '0.95rem',
    color: '#44332a',
    margin: 0,
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '1.75rem',
    marginBottom: '1.75rem',
  },
  cardSection: {
    backgroundColor: '#fffdf2',
    borderRadius: '14px',
    padding: '1.75rem',
    border: '2px solid #d4af37',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  sectionHeading: {
    fontFamily: "'Merriweather', serif",
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#7a0016',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '1.25rem',
  },
  progressWrapper: {
    marginBottom: '1rem',
  },
  progressHeader: {
    display: 'flex',
    justify: 'space-between',
    fontSize: '0.88rem',
    fontWeight: '700',
    color: '#2a1810',
    marginBottom: '0.35rem',
  },
  progressLabel: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  progressBg: {
    height: '10px',
    backgroundColor: '#fbf3df',
    borderRadius: '5px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.3)',
  },
  fillPos: { height: '100%', backgroundColor: '#059669', borderRadius: '4px' },
  fillNeu: { height: '100%', backgroundColor: '#d97706', borderRadius: '4px' },
  fillNeg: { height: '100%', backgroundColor: '#dc2626', borderRadius: '4px' },
  pillarWrapper: {
    marginBottom: '1rem',
  },
  pillarInfo: {
    display: 'flex',
    justify: 'space-between',
    fontSize: '0.88rem',
    marginBottom: '0.3rem',
  },
  pillarName: {
    color: '#2a1810',
    fontWeight: '700',
  },
  pillarCount: {
    color: '#665247',
  },
  pillarBg: {
    height: '8px',
    backgroundColor: '#fbf3df',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(212, 175, 55, 0.3)',
  },
  pillarFill: {
    height: '100%',
    borderRadius: '4px',
  },
  sideBySideGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '1.75rem',
  },
  reasonCard: {
    backgroundColor: '#fffdf2',
    borderRadius: '14px',
    padding: '1.75rem',
    border: '2px solid #d4af37',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  supportHeading: {
    fontFamily: "'Merriweather', serif",
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#065f46',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '1rem',
  },
  concernHeading: {
    fontFamily: "'Merriweather', serif",
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#991b1b',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '1rem',
  },
  bulletList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  bulletItem: {
    fontSize: '0.88rem',
    display: 'flex',
    alignItems: 'flex-start',
    lineHeight: '1.5',
    color: '#2a1810',
  },
  bulletUser: {
    fontSize: '0.78rem',
    color: '#665247',
    fontWeight: 'normal',
  },
  emptyText: {
    fontSize: '0.88rem',
    color: '#665247',
    fontStyle: 'italic',
  },
  loadingText: {
    textAlign: 'center',
    padding: '4rem',
    color: '#fdf7e7',
  },
};
