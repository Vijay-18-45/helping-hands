import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { registerUser, getFirebaseErrorMessage } from '../authService';
import { Toast, useToast } from '../components/Toast';

export default function DonorRegisterFixed() {
  const navigate = useNavigate();
  const { toasts, addToast, dismissToast } = useToast();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'loading') return;
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }
    if (!form.agreedToTerms) {
      setError('Please agree to the Terms & Privacy Policy.');
      return;
    }

    setState('loading');
    try {
      await registerUser(form.email, form.password, 'donor');
      addToast('Account created! Please verify your email before logging in.', 'success');
      setState('success');
    } catch (err: any) {
      setState('idle');
      setError(getFirebaseErrorMessage(err.code));
    }
  };

  if (state === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-lowest)' }}>
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <div style={{
          background: 'white', padding: '48px', borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center',
          maxWidth: 480, border: '2px solid var(--success)',
        }}>
          <div style={{
            width: 80, height: 80, background: 'var(--success)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="40" height="40" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginBottom: 16 }}>
            Account Created Successfully!
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', marginBottom: 32, lineHeight: 1.7 }}>
            A verification email has been sent to <strong>{form.email}</strong>.<br />
            Please check your inbox and click the link to verify your account before logging in.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link to="/donor/login" className="btn btn-primary">Go to Login</Link>
            <Link to="/" className="btn btn-secondary">Back to Home</Link>
          </div>
          <div style={{ marginTop: 24, padding: '14px 18px', background: 'var(--surface-container-low)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            Didn't receive the email? Check your spam folder or try logging in to resend it.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px', background: 'var(--surface-container-lowest)' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <Link to="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            color: 'var(--primary)', fontFamily: 'Manrope, sans-serif',
            fontWeight: 800, fontSize: '1.25rem', marginBottom: 48, textDecoration: 'none',
          }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--grad-primary)', display: 'inline-block' }} />
            Helping Hands
          </Link>

          <div style={{ marginBottom: 40 }}>
            <div className="chip" style={{ marginBottom: 16 }}>Donor Portal</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 12 }}>Create your account</h1>
            <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              Start making a difference today. Track your donations and see your impact.
            </p>
          </div>

          {error && (
            <div style={{
              padding: '14px 18px', background: 'var(--accent-soft)', borderRadius: 'var(--radius-md)',
              color: 'var(--accent)', fontSize: '0.9375rem', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={state === 'loading'} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password" className="form-input" placeholder="At least 6 characters"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                disabled={state === 'loading'} required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type="password" className="form-input" placeholder="Repeat your password"
                value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                disabled={state === 'loading'} required
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={form.agreedToTerms}
                onChange={e => setForm({ ...form, agreedToTerms: e.target.checked })}
                disabled={state === 'loading'} style={{ marginTop: 2 }}
              />
              <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>
                I agree to the Terms of Service and Privacy Policy
              </span>
            </label>

            <button type="submit" className="btn btn-primary btn-lg" disabled={state === 'loading'} style={{ width: '100%' }}>
              {state === 'loading' ? (
                <>
                  <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center', fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>
            Already have an account?{' '}
            <Link to="/donor/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
          <div style={{ marginTop: 12, textAlign: 'center', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            Volunteering instead?{' '}
            <Link to="/volunteer/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Volunteer register</Link>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80"
          alt="Food donation"
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(23,43,77,0.85) 0%, rgba(52,69,99,0.75) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
          <div style={{ maxWidth: 440, textAlign: 'center' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 20 }}>Make a Real Impact</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', lineHeight: 1.6 }}>
              Join thousands of donors making a difference in their communities.
            </p>
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Real-time impact dashboard', 'Photo-verified donation receipts', 'Donor leaderboards & badges'].map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
