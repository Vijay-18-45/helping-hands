import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { loginUser, getUserRole, logoutUser, sendVerificationEmail, sendPasswordReset, getFirebaseErrorMessage } from '../authService';
import { useAuth } from '../context/AuthContext';

export default function RequestorLogin() {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && user.emailVerified && role === 'requestor') {
      navigate('/requestor/dashboard', { replace: true });
    }
  }, [user, role, authLoading, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUnverified, setShowUnverified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowUnverified(false);

    if (!email || !password) {
      setError('Please enter your credentials.');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await loginUser(email, password);

      if (!userCredential.user.emailVerified) {
        setLoading(false);
        setShowUnverified(true);
        setError('Please verify your email before logging in.');
        return;
      }

      const userRole = await getUserRole(userCredential.user.uid);

      if (userRole !== 'requestor') {
        await logoutUser();
        setError('This account is not registered as a requestor.');
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate('/requestor/dashboard');
    } catch (error: any) {
      setLoading(false);
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      setError('Verification email sent! Check your inbox.');
      setShowUnverified(false);
    } catch {
      setError('Failed to send verification email.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) { setError('Please enter your email address.'); return; }
    try {
      await sendPasswordReset(resetEmail);
      setResetMessage('Password reset email sent! Check your inbox.');
      setError('');
      setTimeout(() => { setShowForgotPassword(false); setResetMessage(''); setResetEmail(''); }, 3000);
    } catch (error: any) {
      setError(getFirebaseErrorMessage(error.code));
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}>

        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80"
            alt="People receiving food"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(220,38,38,0.82) 0%, rgba(239,68,68,0.72) 100%)',
          }} />
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', padding: '48px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#fff', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: '1.375rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(255,255,255,0.8)', display: 'inline-block' }} />
              Helping Hands
            </Link>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div className="chip" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: '24px', backdropFilter: 'blur(10px)', width: 'fit-content' }}>
                Food Request Portal
              </div>
              <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '20px', maxWidth: 480 }}>
                Get the help you need.
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.125rem', lineHeight: 1.7, maxWidth: 440 }}>
                Sign in to browse available food donations and request items for yourself or your community.
              </p>
              <div style={{ marginTop: '48px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Browse available donations', 'Request food for your family', 'Track your requests in real-time'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
                    <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    </span>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)' }}>© 2025 Helping Hands. All rights reserved.</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', background: 'var(--surface-container-lowest)' }}>
          <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Sign in</h2>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem' }}>Access your food request dashboard</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="req-email">Email Address</label>
                <input id="req-email" type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="form-label" htmlFor="req-password" style={{ margin: 0 }}>Password</label>
                  <a href="#" onClick={e => { e.preventDefault(); setShowForgotPassword(true); setError(''); }}
                    style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                    Forgot password?
                  </a>
                </div>
                <input id="req-password" type="password" className="form-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>

              {error && (
                <div style={{ padding: '14px 18px', background: 'var(--accent-soft)', border: '1px solid rgba(255,86,48,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--accent)', fontSize: '0.9375rem', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <div>
                    {error}
                    {showUnverified && (
                      <div style={{ marginTop: '8px' }}>
                        <button type="button" onClick={handleResendVerification} style={{ background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer' }}>
                          Resend Verification Email
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? (
                  <><span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            {showForgotPassword && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '16px' }}>Reset Password</h3>
                  {resetMessage && <div style={{ padding: '12px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#166534', borderRadius: '8px', marginBottom: '16px' }}>{resetMessage}</div>}
                  <form onSubmit={handleForgotPassword}>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-input" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="Enter your email" required />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="button" onClick={() => { setShowForgotPassword(false); setResetMessage(''); setResetEmail(''); }} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Send Reset Link</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--outline-variant)' }}>
              <div style={{ textAlign: 'center', fontSize: '0.9375rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
                New here?{' '}
                <Link to="/requestor/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create an account</Link>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                Are you a donor?{' '}
                <Link to="/donor/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Donor login</Link>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Link to="/" className="btn btn-ghost btn-sm">← Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
