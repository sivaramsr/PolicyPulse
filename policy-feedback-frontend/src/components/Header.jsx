import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        
        {/* Brand Logo with Script Typography and Scaled Emblem */}
        <Link to="/" style={styles.brand}>
          <img
            src="/assets/tn-emblem.png"
            alt="Government of Tamil Nadu Emblem"
            style={styles.logoEmblemImg}
          />
          <div>
            <div style={styles.brandTitle}>PolicyPulse</div>
            <div style={styles.brandSubtitle}>Government of Tamil Nadu</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={styles.nav}>
          <Link to="/" style={{ ...styles.navLink, ...(isActive('/') ? styles.navLinkActive : {}) }}>Home</Link>
          <Link to="/policies" style={{ ...styles.navLink, ...(isActive('/policies') || location.pathname.startsWith('/policies/') ? styles.navLinkActive : {}) }}>Browse Policies</Link>
          <Link to="/about" style={{ ...styles.navLink, ...(isActive('/about') ? styles.navLinkActive : {}) }}>How It Works</Link>
          <Link to="/dashboard" style={{ ...styles.navLink, ...(isActive('/dashboard') ? styles.navLinkActive : {}) }}>
            Dashboard {user?.is_staff && <span style={styles.staffTag}>Staff</span>}
          </Link>
        </nav>

        {/* User Auth Buttons */}
        <div style={styles.authArea}>
          {user ? (
            <div style={styles.userDropdown}>
              <span style={styles.userWelcome}>
                <span style={styles.userDot}>●</span> {user.username}
              </span>
              <button onClick={logout} style={styles.logoutBtn}>Log Out</button>
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.loginBtn}>Sign In</Link>
              <Link to="/register" style={styles.registerBtn}>Register Account</Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: '#54000e',
    backgroundImage: 'linear-gradient(180deg, #7a0016 0%, #54000e 100%)',
    borderBottom: '2px solid #d4af37',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
  },
  headerContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0.85rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.95rem',
    textDecoration: 'none',
  },
  logoEmblemImg: {
    width: '56px',
    height: '56px',
    objectFit: 'contain',
    borderRadius: '50%',
    backgroundColor: '#7a0016',
    border: '2px solid #d4af37',
    padding: '2px',
    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
  },
  brandTitle: {
    fontFamily: "'Great Vibes', cursive",
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#f3e5ab',
    lineHeight: '1',
    textShadow: '1px 2px 4px rgba(0,0,0,0.5)',
  },
  brandSubtitle: {
    fontSize: '0.72rem',
    color: '#d4af37',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  navLink: {
    color: '#fdf7e7',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '0.5rem 0.85rem',
    borderRadius: '6px',
    transition: 'all 0.15s ease',
  },
  navLinkActive: {
    color: '#ffffff',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderBottom: '2px solid #d4af37',
  },
  staffTag: {
    fontSize: '0.65rem',
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    color: '#f3e5ab',
    border: '1px solid #d4af37',
    padding: '0.1rem 0.35rem',
    borderRadius: '4px',
    marginLeft: '0.35rem',
  },
  authArea: {
    display: 'flex',
    alignItems: 'center',
  },
  authBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  loginBtn: {
    color: '#fdf7e7',
    fontSize: '0.88rem',
    fontWeight: '600',
    padding: '0.5rem 0.85rem',
  },
  registerBtn: {
    backgroundColor: '#d4af37',
    color: '#54000e',
    fontSize: '0.88rem',
    fontWeight: '700',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid #f3e5ab',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    transition: 'all 0.15s ease',
  },
  userDropdown: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: '0.35rem 0.85rem',
    borderRadius: '8px',
    border: '1px solid rgba(212, 175, 55, 0.4)',
  },
  userWelcome: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#fdf7e7',
  },
  userDot: {
    color: '#34d399',
    marginRight: '0.3rem',
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    color: '#fca5a5',
    border: 'none',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
