import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrnateFrame from '../components/OrnateFrame';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(username.trim(), email.trim(), password.trim());
      navigate('/policies');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <OrnateFrame>
        <div style={styles.header}>
          <div style={styles.badge}>New Account Registration</div>
          <h2 style={styles.title}>Register Citizen Account</h2>
          <p style={styles.subtitle}>Create your authenticated account to voice opinions on Tamil Nadu policy proposals.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="e.g. citizen_tn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="e.g. citizen@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          Already registered? <Link to="/login" style={styles.link}>Sign In Here</Link>
        </div>
      </OrnateFrame>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '480px',
    margin: '3.5rem auto',
    padding: '0 1.5rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: '800',
    color: '#065f46',
    backgroundColor: '#d1fae5',
    border: '1px solid #a7f3d0',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  title: {
    fontFamily: "'Merriweather', serif",
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#2a1810',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '0.88rem',
    color: '#665247',
    margin: 0,
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
    marginTop: '0.5rem',
    boxShadow: '0 4px 12px rgba(122,0,22,0.3)',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.75rem',
    fontSize: '0.88rem',
    color: '#665247',
  },
  link: {
    color: '#7a0016',
    fontWeight: '700',
  },
};
