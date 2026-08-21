import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrnateFrame from '../components/OrnateFrame';
import LoadingScreen from '../components/LoadingScreen';
import { API_BASE } from '../config';

// Icons
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export default function PolicyDetailPage() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [policy, setPolicy] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentTotal, setCommentTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Form state
  const [newCommentText, setNewCommentText] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Filters + Sort
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIssueFilter, setSelectedIssueFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const minDelay = new Promise(resolve => setTimeout(resolve, 1800));
    const fetchData = fetch(`${API_BASE}/policies/${id}/`).then(r => r.json());

    Promise.all([fetchData, minDelay])
      .then(([data]) => setPolicy(data))
      .catch(err => console.error('Failed to load policy details:', err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch Comments
  const fetchComments = useCallback(() => {
    setCommentsLoading(true);
    const params = new URLSearchParams({
      page: currentPage,
      sort: sortOrder,
    });
    if (activeTab !== 'all') params.append('sentiment', activeTab);
    if (selectedIssueFilter !== 'all') params.append('issue', selectedIssueFilter);

    fetch(`${API_BASE}/policies/${id}/comments/?${params}`)
      .then(r => r.json())
      .then(data => {
        setComments(data.results || []);
        setCommentTotal(data.count || 0);
        setTotalPages(data.total_pages || 1);
      })
      .catch(err => console.error('Failed to load comments:', err))
      .finally(() => setCommentsLoading(false));
  }, [id, currentPage, activeTab, selectedIssueFilter, sortOrder]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Submit Feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    if (!token) {
      setSubmitError('You must be logged in to submit policy feedback.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const res = await fetch(`${API_BASE}/policies/${id}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          author: displayName.trim() || user?.username || 'Verified Citizen',
          text: newCommentText.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error || 'Failed to submit feedback.');
        return;
      }

      setNewCommentText('');
      setSubmitSuccess('Your feedback was submitted and analyzed successfully!');
      setCurrentPage(1);
      fetchComments();
    } catch (err) {
      setSubmitError('Failed to submit comment. Check server connection.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen text="Analyzing Policy Feedback & Details..." />;
  }

  if (!policy) {
    return <div style={styles.notFound}>Policy proposal not found.</div>;
  }

  return (
    <div style={styles.container}>
      
      {/* Policy Card Header in Ornate Frame */}
      <OrnateFrame style={styles.policyFrame}>
        <div style={styles.badgeRow}>
          <span style={styles.activeTag}>● Active Legislative Proposal</span>
          <span style={styles.dateText}>Published: {policy.published_date}</span>
        </div>
        <h1 style={styles.title}>{policy.title}</h1>
        <p style={styles.content}>"{policy.content}"</p>
      </OrnateFrame>

      {/* Auth-Gated Comment Submission Form */}
      <OrnateFrame style={styles.formFrame}>
        <h3 style={styles.formTitle}>Submit Official Citizen Feedback</h3>
        
        {user ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formMetaRow}>
              <div style={styles.userBadgeText}>
                LoggedIn as: <strong>{user.username}</strong> ({user.email})
              </div>
              <input
                type="text"
                placeholder={`Display Name (Default: ${user.username})`}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                style={styles.displayNameInput}
              />
            </div>

            <textarea
              placeholder="What are your thoughts on this policy proposal? (AI Sentiment Engine will analyze your response automatically)"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              required
              rows={4}
              style={styles.textArea}
            />

            {submitError && <div style={styles.errorBanner}>{submitError}</div>}
            {submitSuccess && <div style={styles.successBanner}>{submitSuccess}</div>}

            <button
              type="submit"
              disabled={submitting}
              style={{ ...styles.submitBtn, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Analyzing & Submitting...' : 'Submit Feedback & Run AI Analysis'}
            </button>
          </form>
        ) : (
          <div style={styles.loginGateBox}>
            <div style={styles.gateTitle}>Authentication Required</div>
            <p style={styles.gateDesc}>
              To ensure authentic citizen participation and maintain the 1-comment-per-policy standard, please sign in to submit feedback.
            </p>
            <Link to="/login" style={styles.gateLoginBtn}>
              Sign In / Register to Submit Feedback →
            </Link>
          </div>
        )}
      </OrnateFrame>

      {/* Public Comments Feed */}
      <div style={styles.feedHeader}>
        <div style={styles.feedTitleRow}>
          <h2 style={styles.feedTitle}>Public Citizen Feedback</h2>
          <span style={styles.countBadge}>{commentTotal} Total</span>
        </div>

        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sentiment:</span>
            {['all', 'Positive', 'Mixed', 'Negative'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}
              >
                {tab === 'all' ? 'All' : tab === 'Positive' ? 'Favorable' : tab === 'Mixed' ? 'Mixed' : 'Critical'}
              </button>
            ))}
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Issue Pillar:</span>
            <select
              value={selectedIssueFilter}
              onChange={(e) => { setSelectedIssueFilter(e.target.value); setCurrentPage(1); }}
              style={styles.selectFilter}
            >
              <option value="all">All Pillars</option>
              <option value="Affordability">Affordability</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Safety & Quality">Safety & Quality</option>
              <option value="Resource Allocation">Resource Allocation</option>
              <option value="General">General</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sort:</span>
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
              style={styles.selectFilter}
            >
              <option value="newest">Most Recent</option>
              <option value="supportive">Most Supportive</option>
              <option value="critical">Most Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comment List */}
      <div style={styles.commentList}>
        {commentsLoading ? (
          <div style={styles.loadingComments}>Loading feedback...</div>
        ) : comments.length === 0 ? (
          <div style={styles.noComments}>No feedback matches the selected filters.</div>
        ) : (
          comments.map(c => (
            <div
              key={c.id}
              style={{
                ...styles.commentCard,
                ...(c.sentiment === 'Positive' ? styles.borderPos : c.sentiment === 'Negative' ? styles.borderNeg : styles.borderNeu)
              }}
            >
              <div style={styles.commentMeta}>
                <span style={styles.author}>{c.author} {c.username && <span style={styles.usernameTag}>@{c.username}</span>}</span>
                <span style={styles.time}>{c.timestamp}</span>
              </div>
              <p style={styles.commentText}>"{c.text}"</p>

              <div style={styles.aiBox}>
                <div style={styles.aiTag}>
                  <span style={styles.aiLabel}>WHAT:</span>
                  <span className={`badge ${c.sentiment === 'Positive' ? 'badge-positive' : c.sentiment === 'Negative' ? 'badge-negative' : 'badge-neutral'}`}>
                    {c.sentiment === 'Positive' ? <CheckIcon /> : c.sentiment === 'Negative' ? <WarningIcon /> : <InfoIcon />}
                    {c.sentiment === 'Positive' ? 'Favorable' : c.sentiment === 'Negative' ? 'Critical' : 'Mixed'}
                  </span>
                </div>
                <div style={styles.aiTag}>
                  <span style={styles.aiLabel}>WHICH:</span>
                  <span style={styles.topicBadge}>{c.issue}</span>
                </div>
                <div style={styles.aiTag}>
                  <span style={styles.aiLabel}>WHY:</span>
                  <span style={styles.aiWhy}>{c.why}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1050px',
    margin: '0 auto',
    padding: '2.5rem 1.5rem',
  },
  policyFrame: {
    marginBottom: '2.5rem',
  },
  badgeRow: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  activeTag: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#7a0016',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: '0.8rem',
    color: '#665247',
  },
  title: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#2a1810',
    marginBottom: '0.85rem',
    lineHeight: '1.35',
  },
  content: {
    fontSize: '1.05rem',
    color: '#44332a',
    lineHeight: '1.65',
  },
  formFrame: {
    marginBottom: '3rem',
  },
  formTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#7a0016',
    marginBottom: '1.25rem',
    borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
    paddingBottom: '0.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formMetaRow: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  userBadgeText: {
    fontSize: '0.88rem',
    color: '#44332a',
  },
  displayNameInput: {
    backgroundColor: '#fbf3df',
    border: '1.5px solid #d4af37',
    color: '#2a1810',
    padding: '0.5rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    width: '220px',
  },
  textArea: {
    width: '100%',
    backgroundColor: '#fbf3df',
    border: '1.5px solid #d4af37',
    color: '#2a1810',
    padding: '0.85rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'none',
  },
  submitBtn: {
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.95rem',
    padding: '0.85rem',
    border: '1px solid #d4af37',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(122, 0, 22, 0.3)',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  successBanner: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  loginGateBox: {
    textAlign: 'center',
    padding: '2rem 1rem',
    backgroundColor: '#fbf3df',
    borderRadius: '12px',
    border: '1.5px dashed #d4af37',
  },
  gateTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#7a0016',
    marginBottom: '0.5rem',
  },
  gateDesc: {
    fontSize: '0.9rem',
    color: '#554238',
    maxWidth: '500px',
    margin: '0 auto 1.25rem auto',
  },
  gateLoginBtn: {
    display: 'inline-block',
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.9rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid #d4af37',
  },
  feedHeader: {
    borderBottom: '2px solid #d4af37',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  feedTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  feedTitle: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.6rem',
    fontWeight: '700',
    color: '#f3e5ab',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
    margin: 0,
  },
  countBadge: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#54000e',
    backgroundColor: '#f3e5ab',
    padding: '0.2rem 0.65rem',
    borderRadius: '99px',
    border: '1px solid #d4af37',
  },
  filterRow: {
    display: 'flex',
    justify: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  filterLabel: {
    fontSize: '0.75rem',
    color: '#fdf7e7',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  tabBtn: {
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    color: '#fdf7e7',
    padding: '0.3rem 0.65rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: '700',
  },
  tabBtnActive: {
    backgroundColor: '#fffdf2',
    color: '#7a0016',
    borderColor: '#d4af37',
  },
  selectFilter: {
    backgroundColor: '#fffdf2',
    color: '#2a1810',
    border: '1.5px solid #d4af37',
    borderRadius: '6px',
    padding: '0.3rem 0.6rem',
    fontSize: '0.82rem',
    fontWeight: '600',
    outline: 'none',
  },
  commentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  commentCard: {
    backgroundColor: '#fffdf2',
    borderRadius: '12px',
    padding: '1.25rem',
    borderLeft: '4px solid #7a0016',
    borderTop: '1px solid rgba(212, 175, 55, 0.4)',
    borderRight: '1px solid rgba(212, 175, 55, 0.4)',
    borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
  },
  borderPos: { borderLeft: '4px solid #059669' },
  borderNeu: { borderLeft: '4px solid #d97706' },
  borderNeg: { borderLeft: '4px solid #dc2626' },
  commentMeta: {
    display: 'flex',
    justify: 'space-between',
    marginBottom: '0.5rem',
  },
  author: {
    fontWeight: '700',
    fontSize: '0.92rem',
    color: '#2a1810',
  },
  usernameTag: {
    fontSize: '0.75rem',
    color: '#665247',
    fontWeight: '500',
  },
  time: {
    fontSize: '0.75rem',
    color: '#665247',
  },
  commentText: {
    fontSize: '0.95rem',
    color: '#44332a',
    lineHeight: '1.55',
    marginBottom: '1rem',
  },
  aiBox: {
    backgroundColor: '#fdf7e7',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    border: '1px solid rgba(212, 175, 55, 0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  aiTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  aiLabel: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#7a0016',
    letterSpacing: '0.05em',
    width: '45px',
  },
  topicBadge: {
    fontSize: '0.72rem',
    backgroundColor: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontWeight: '700',
  },
  aiWhy: {
    fontSize: '0.85rem',
    color: '#44332a',
    fontStyle: 'italic',
  },
  loadingScreen: {
    textAlign: 'center',
    padding: '4rem',
    color: '#fdf7e7',
  },
  notFound: {
    textAlign: 'center',
    padding: '4rem',
    color: '#fecaca',
  },
  loadingComments: {
    textAlign: 'center',
    padding: '2rem',
    color: '#fdf7e7',
  },
  noComments: {
    textAlign: 'center',
    padding: '2rem',
    color: '#2a1810',
    backgroundColor: '#fffdf2',
    borderRadius: '12px',
    border: '2px solid #d4af37',
  },
};
