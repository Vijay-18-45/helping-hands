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

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  const dashboardPath = role === 'donor'
    ? '/donor/dashboard'
    : role === 'volunteer'
      ? '/volunteer/dashboard'
      : null;

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const isLoggedIn = !loading && user && user.emailVerified && role !== null;

  return (
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
            <Link to="/volunteer/login" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        ) : null}
      </div>

      <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: 'none' }}
        aria-label="Toggle menu"
      >☰</button>
    </nav>
  );
}
