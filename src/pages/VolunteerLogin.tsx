import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { loginUser, getUserRole, sendVerificationEmail, sendPasswordReset, getFirebaseErrorMessage } from '../authService';
import { useAuth } from '../context/AuthContext';

export default function VolunteerLogin() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && user.emailVerified && role === 'volunteer') {
      navigate('/volunteer/dashboard', { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) { 
      setError('Please enter your credentials.'); 
      return; 
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    
    try {
      const userCredential = await loginUser(email, password);

      if (!userCredential.user.emailVerified) {
        setLoading(false);
        setError('Please verify your email before logging in. Check your inbox for a verification link.');
        return;
      }

      const role = await getUserRole(userCredential.user.uid);

      if (role !== 'volunteer') {
        setError('This account is not registered as a volunteer. Please use the donor login.');
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/volunteer/dashboard');
    } catch (error: any) {
      setLoading(false);
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>

      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        {/* Left — Image panel */}
        <div style={{
          position: 'relative', overflow: 'hidden',
        }}>
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80" 
            alt="Volunteers serving food"
            style={{ 
              width: '100%', height: '100%', objectFit: 'cover',
              position: 'absolute', inset: 0,
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(0,82,204,0.85) 0%, rgba(38,132,255,0.75) 100%)',
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            height: '100%', display: 'flex', flexDirection: 'column',
            padding: '48px',
          }}>
            <Link to="/" style={{ 
              display: 'flex', alignItems: 'center', gap: 10, 
              color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.375rem',
            }}>
              <span style={{ 
                width: 10, height: 10, borderRadius: '50%', 
                background: 'rgba(255,255,255,0.8)', display: 'inline-block',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }} />
              Helping Hands
            </Link>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="chip" style={{ 
                background: 'rgba(255,255,255,0.15)', color: '#fff', 
                marginBottom: '24px', backdropFilter: 'blur(10px)',
                width: 'fit-content',
              }}>
                Volunteer Portal
              </div>
              <h1 style={{ 
                fontSize: '2.75rem', fontWeight: 800, color: '#fff', 
                lineHeight: 1.15, marginBottom: '20px', maxWidth: 480,
              }}>
                Welcome back, hero.
              </h1>
              <p style={{ 
                color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', 
                lineHeight: 1.7, maxWidth: 440,
              }}>
                Sign in to access your tasks, track your impact, and continue making a difference in your community.
              </p>

              <div style={{ 
                marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px',
              }}>
                {[
                  'Access pending tasks & assignments',
                  'Track your volunteer hours',
                  'View your impact statistics',
                ].map(f => (
                  <div key={f} style={{ 
                    display: 'flex', alignItems: 'center', gap: 14, 
                    color: 'rgba(255,255,255,0.9)', fontSize: '1rem',
                  }}>
                    <span style={{ 
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    </span> 
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>
              © 2024 Helping Hands. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right — Form */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          padding: '64px', background: 'var(--surface-container-lowest)',
        }}>
          <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Sign in</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>
                Access your volunteer dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="vol-email">Email Address</label>
                <input
                  id="vol-email" type="email" className="form-input"
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" htmlFor="vol-password" style={{ margin: 0 }}>Password</label>
                  <a 
                    href="#" 
                    onClick={(e) => { e.preventDefault(); /* TODO: implement forgot password */ }}
                    style={{ 
                      fontSize: '0.875rem', 
                      color: 'var(--primary)', 
                      textDecoration: 'none',
                      fontWeight: 500,
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="vol-password" type="password" className="form-input"
                  placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div style={{ 
                  padding: '14px 18px', background: 'var(--accent-soft)', 
                  border: '1px solid rgba(255,86,48,0.2)', borderRadius: 'var(--radius-md)', 
                  color: 'var(--accent)', fontSize: '0.9375rem',
                  display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? (
                  <>
                    <span style={{ 
                      width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                    Signing in...
                  </>
                ) : 'Sign In'}
              </button>
            </form>

            <div style={{ 
              marginTop: '32px', paddingTop: '32px', 
              borderTop: '1px solid var(--outline-variant)',
            }}>
              <div style={{ 
                textAlign: 'center', fontSize: '0.9375rem', color: 'var(--on-surface-variant)',
                marginBottom: '16px',
              }}>
                Not yet registered?{' '}
                <Link to="/volunteer/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  Apply to volunteer
                </Link>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                Are you a donor?{' '}
                <Link to="/donor/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Donor login</Link>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/" className="btn btn-ghost btn-sm">
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
