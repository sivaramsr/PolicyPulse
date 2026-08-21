import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import OrnateFrame from '../components/OrnateFrame';

const API_BASE = 'http://127.0.0.1:8001/api';

export default function ResetPasswordPage() {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify and re-type.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/password-reset-confirm/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uidb64,
          token,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Invalid or expired password reset link.');
      }
    } catch (err) {
      setError('Network connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <OrnateFrame>
        <div style={styles.header}>
          <div style={styles.badge}>Account Security</div>
          <h2 style={styles.title}>Set New Password</h2>
          <p style={styles.subtitle}>Enter a strong new password for your PolicyPulse citizen account.</p>
        </div>

        {success ? (
          <div style={styles.successBox}>
            <div style={styles.successIcon}>✓</div>
            <h3 style={styles.successTitle}>Password Reset Successful!</h3>
            <p style={styles.successText}>Your account password has been updated. Redirecting you to the Sign In page...</p>
            <Link to="/login" style={styles.loginBtn}>Sign In Now →</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.errorBox}>{error}</div>}

            <div style={styles.field}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={styles.footer}>
          Need a new reset link? <Link to="/forgot-password" style={styles.link}>Request Link Again</Link>
        </div>
      </OrnateFrame>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '480px',
    margin: '3rem auto',
    padding: '0 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#7a0016',
    backgroundColor: '#fef3c7',
    border: '1px solid #b8860b',
    padding: '0.25rem 0.65rem',
    borderRadius: '99px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#7a0016',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '0.9rem',
    color: '#554238',
    lineHeight: '1.45',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  errorBox: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '0.75rem',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  successBox: {
    backgroundColor: '#f0fdf4',
    border: '2px solid #a7f3d0',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  successIcon: {
    fontSize: '2rem',
    color: '#059669',
    marginBottom: '0.5rem',
  },
  successTitle: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#065f46',
    marginBottom: '0.5rem',
  },
  successText: {
    fontSize: '0.88rem',
    color: '#047857',
    marginBottom: '1.25rem',
  },
  loginBtn: {
    display: 'inline-block',
    backgroundColor: '#7a0016',
    color: '#ffffff',
    fontWeight: '700',
    fontSize: '0.88rem',
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    textDecoration: 'none',
    border: '1px solid #d4af37',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#2a1810',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  input: {
    backgroundColor: '#fbf3df',
    border: '1.5px solid #d4af37',
    color: '#2a1810',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    fontSize: '0.95rem',
    outline: 'none',
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
    boxShadow: '0 4px 12px rgba(122,0,22,0.3)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.75rem',
    fontSize: '0.88rem',
    color: '#554238',
  },
  link: {
    color: '#7a0016',
    fontWeight: '700',
    textDecoration: 'none',
  },
};
