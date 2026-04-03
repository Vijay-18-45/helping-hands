import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loginUser, getUserRole, sendPasswordReset, sendVerificationEmail, getFirebaseErrorMessage } from '../authService';
import { useAuth } from '../context/AuthContext';

export default function DonorLogin() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && user.emailVerified && role === 'donor') {
      navigate('/donor/dashboard', { replace: true });
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
      // Login with Firebase
      const userCredential = await loginUser(email, password);
      console.log('✅ Login successful, UID:', userCredential.user.uid);
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setLoading(false);
        setError('Please verify your email before logging in. Check your inbox for a verification link.');
        return;
      }
      
      const role = await getUserRole(userCredential.user.uid);

      if (role !== 'donor') {
        setError('This account is not registered as a donor. Please use the volunteer login.');
        setLoading(false);
        return;
      }
      
      // Success - redirect to donor dashboard
      console.log('✅ Redirecting to dashboard...');
      setLoading(false);
      navigate('/donor/dashboard');
    } catch (error: any) {
      console.error('❌ Login error:', error);
      setLoading(false);
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      setError('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordReset(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox for instructions.');
      setError('');
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetMessage('');
        setResetEmail('');
      }, 3000);
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left — Form */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '64px', background: 'var(--surface-container-lowest)',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">

          <Link to="/" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 10, 
            color: 'var(--primary)', fontFamily: 'Manrope, sans-serif', 
            fontWeight: 800, fontSize: '1.25rem', marginBottom: '48px',
          }}>
            <span style={{ 
              width: 10, height: 10, borderRadius: '50%', 
              background: 'var(--grad-primary)', display: 'inline-block',
              boxShadow: '0 2px 8px rgba(0,82,204,0.3)',
            }} />
            Helping Hands
          </Link>

          <div style={{ marginBottom: '40px' }}>
            <div className="chip" style={{ marginBottom: '16px' }}>Donor Portal</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '12px' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.6 }}>
              Sign in to track your donations and see your real-world impact.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="donor-email">Email Address</label>
              <input id="donor-email" type="email" className="form-input" placeholder="alex@example.com"
                value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" htmlFor="donor-password" style={{ margin: 0 }}>Password</label>
                <a 
                  href="#" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setShowForgotPassword(true);
                    setError('');
                  }}
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
              <input id="donor-password" type="password" className="form-input" placeholder="Enter your password"
                value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {error && (
              <div style={{ 
                padding: '14px 18px', background: 'var(--accent-soft)', 
                borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: '0.9375rem',
                display: 'flex', alignItems: 'center', gap: '10px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div>
                  {error}
                  {error.includes('verify your email') && (
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={async () => {
                          try {
                            await sendVerificationEmail();
                            setError('Verification email sent! Check your inbox.');
                          } catch (e) {
                            setError('Failed to send verification email. Please try again.');
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: '1px solid var(--accent)',
                          color: 'var(--accent)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        Resend Verification Email
                      </button>
                    </div>
                  )}
                </div>
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

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{
                background: 'white', borderRadius: '12px', padding: '32px',
                width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>
                  Reset Password
                </h3>
                <p style={{ color: '#6B7280', marginBottom: '24px' }}>
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                {resetMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                    {resetMessage}
                  </div>
                )}
                
                <form onSubmit={handleForgotPassword}>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label" htmlFor="reset-email">Email Address</label>
                    <input
                      id="reset-email"
                      type="email"
                      className="form-input"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setError('');
                        setResetMessage('');
                        setResetEmail('');
                      }}
                      className="btn btn-ghost flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary flex-1">
                      Send Reset Link
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '32px', paddingTop: '32px', 
            borderTop: '1px solid var(--outline-variant)',
          }}>
            <div style={{ 
              textAlign: 'center', fontSize: '0.9375rem', color: 'var(--on-surface-variant)',
              marginBottom: '16px',
            }}>
              Don't have an account?{' '}
              <Link to="/donor/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Create account
              </Link>
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
              Are you a volunteer?{' '}
              <Link to="/volunteer/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Volunteer login
              </Link>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link to="/" className="btn btn-ghost btn-sm">
                ← Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Visual */}
      <div style={{
        position: 'relative', overflow: 'hidden',
      }}>
        <img 
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80" 
          alt="Food donation"
          style={{ 
            width: '100%', height: '100%', objectFit: 'cover',
            position: 'absolute', inset: 0,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(23,43,77,0.85) 0%, rgba(52,69,99,0.75) 100%)',
        }} />

        <div style={{ 
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '64px',
        }}>
          <div style={{ maxWidth: 440 }}>
            <h2 style={{ 
              fontSize: '2.25rem', fontWeight: 800, 
              color: '#fff', lineHeight: 1.2, marginBottom: '20px',
            }}>
              See exactly where your donations go.
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', 
              lineHeight: 1.7, marginBottom: '40px',
            }}>
              Our donor dashboard gives you complete visibility into your impact — 
              from meals cooked to families helped.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', text: 'Real-time impact dashboard' },
                { iconPath: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z', text: 'Photo-verified donation receipts' },
                { iconPath: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', text: 'Donor leaderboards & badges' },
              ].map(f => (
                <div key={f.text} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '18px 20px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d={f.iconPath}/>
                  </svg>
                  <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'flex', gap: '32px', marginTop: '48px',
              paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)',
            }}>
              {[
                { value: '$1.2M+', label: 'Donated' },
                { value: '15K+', label: 'Meals' },
                { value: '142', label: 'Families' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ 
                    fontSize: '1.5rem', fontWeight: 800, color: '#fff', 
                    fontFamily: 'Manrope',
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)' }}>{stat.label}</div>
                </div>
              ))}
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
