import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrnateFrame from '../components/OrnateFrame';
import LoadingScreen from '../components/LoadingScreen';
import { API_BASE } from '../config';

export default function BrowsePoliciesPage() {
  const [policies, setPolicies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredPolicies = policies.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingScreen text="Fetching Policy Proposals..." />;
  }

  return (
    <div style={styles.container}>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Browse Policy Proposals</h1>
        <p style={styles.subtitle}>Explore active legislative proposals, review policy pillars, and submit citizen feedback.</p>
      </div>

      {/* Full-width Search Bar */}
      <OrnateFrame style={styles.filterFrame} innerStyle={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by policy title or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </OrnateFrame>

      {/* Policies Grid */}
      {filteredPolicies.length === 0 ? (
        <div style={styles.noResults}>No policy proposals found matching your search query.</div>
      ) : (
        <div style={styles.grid}>
          {filteredPolicies.map((policy) => (
            <div key={policy.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.statusBadge}>● Active Proposal</span>
                <span style={styles.date}>{policy.published_date}</span>
              </div>
              <h3 style={styles.cardTitle}>{policy.title}</h3>
              <p style={styles.cardContent}>"{policy.content}"</p>
              
              <div style={styles.cardFooter}>
                <span style={styles.commentsText}>
                  💬 {policy.comment_count || 0} Citizen Response{(policy.comment_count || 0) !== 1 ? 's' : ''}
                </span>
                <Link to={`/policies/${policy.id}`} style={styles.actionBtn}>
                  Participate & Comment →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '3rem',
    fontWeight: '700',
    color: '#f3e5ab',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
    margin: '0 0 0.25rem 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#fdf7e7',
    margin: 0,
  },
  filterFrame: {
    marginBottom: '2.5rem',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '0.4rem 0.5rem',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#fffdf2',
    border: '1.5px solid #d4af37',
    color: '#2a1810',
    padding: '0.75rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
    gap: '1.75rem',
  },
  card: {
    backgroundColor: '#fffdf2',
    borderRadius: '14px',
    border: '2px solid #d4af37',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    gap: '1rem',
  },
  statusBadge: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    padding: '0.25rem 0.65rem',
    borderRadius: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginRight: '0.75rem',
  },
  date: {
    fontSize: '0.8rem',
    color: '#665247',
    fontWeight: '600',
  },
  cardTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#7a0016',
    margin: '0 0 0.75rem 0',
    lineHeight: '1.35',
  },
  cardContent: {
    fontSize: '0.92rem',
    color: '#2a1810',
    lineHeight: '1.55',
    margin: '0 0 1.5rem 0',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #e2d5b6',
    paddingTop: '1rem',
    marginTop: 'auto',
  },
  commentsText: {
    fontSize: '0.82rem',
    color: '#665247',
    fontWeight: '700',
  },
  actionBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.85rem',
    padding: '0.55rem 1rem',
    borderRadius: '6px',
    textDecoration: 'none',
    border: '1px solid #d4af37',
    boxShadow: '0 4px 12px rgba(122,0,22,0.25)',
  },
  noResults: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    backgroundColor: '#fffdf2',
    border: '2px solid #d4af37',
    borderRadius: '12px',
    color: '#665247',
    fontSize: '1rem',
    fontWeight: '600',
  },
};
