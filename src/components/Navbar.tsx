import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../authService';

interface NavbarProps {
  transparent?: boolean;
}

export default function Navbar({ transparent }: NavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const dashboardPath = role === 'donor'
    ? '/donor/dashboard'
    : role === 'volunteer'
      ? '/volunteer/dashboard'
      : role === 'requestor'
        ? '/requestor/dashboard'
        : null;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const isLoggedIn = !loading && user && user.emailVerified && role !== null;

  return (
    <>
      <nav
        className={`navbar ${scrolled ? 'scrolled' : ''}`}
        style={transparent && !scrolled ? { background: 'transparent', borderBottom: 'none' } : {}}
      >
        <Link to="/" className="navbar-brand">
          <span className="logo-dot" />
          Helping Hands
        </Link>

        <ul className="navbar-links">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/serve" className={isActive('/serve')}>Volunteer</Link></li>
          <li><Link to="/impact" className={isActive('/impact')}>Impact</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
        </ul>

        <div className="navbar-actions">
          {isLoggedIn && dashboardPath ? (
            <>
              <Link to={dashboardPath} className="btn btn-ghost btn-sm">
                My Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-primary btn-sm">
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link to="/donor/login" className="btn btn-ghost btn-sm">Donor Login</Link>
              <Link to="/requestor/login" className="btn btn-ghost btn-sm">Request Food</Link>
              <Link to="/volunteer/login" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : null}
        </div>

        <button
          className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-nav-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div className={`mobile-nav ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <span className="navbar-brand">
            <span className="logo-dot" />
            Helping Hands
          </span>
          <button
            className="mobile-nav-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >✕</button>
        </div>

        <nav className="mobile-nav-links">
          <Link to="/" className={`mobile-nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/serve" className={`mobile-nav-link ${isActive('/serve')}`}>Volunteer</Link>
          <Link to="/impact" className={`mobile-nav-link ${isActive('/impact')}`}>Impact</Link>
          <Link to="/about" className={`mobile-nav-link ${isActive('/about')}`}>About</Link>
        </nav>

        <div className="mobile-nav-actions">
          {isLoggedIn && dashboardPath ? (
            <>
              <Link to={dashboardPath} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                My Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Logout
              </button>
            </>
          ) : !loading ? (
            <>
              <Link to="/donor/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Donor Login</Link>
              <Link to="/requestor/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Request Food</Link>
              <Link to="/volunteer/login" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Get Started</Link>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
