import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function DonorRegisterFixed() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (state === 'loading') return;
    
    setMessage('');

    // Simple validation
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setState('error');
      setMessage('Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setState('error');
      setMessage('Passwords do not match.');
      return;
    }

    if (!form.agreedToTerms) {
      setState('error');
      setMessage('Please agree to the Terms & Privacy Policy.');
      return;
    }

    // Simulate loading
    setState('loading');
    
    setTimeout(() => {
      setState('success');
      setMessage(`Account created for ${form.email}! Please check your inbox for verification.`);
    }, 2000);
  };

  if (state === 'success') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0FDF4' }}>
        <div style={{ 
          background: 'white', 
          padding: '48px', 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          maxWidth: '500px',
          border: '2px solid #16A34A'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#16A34A',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          
          <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#16A34A', marginBottom: '16px' }}>
            🎉 Account Created Successfully!
          </h1>
          
          <p style={{ color: '#6B7280', marginBottom: '32px', lineHeight: 1.6, fontSize: '1.1rem' }}>
            {message}
            <br />
            <br />
            <strong>Next steps:</strong>
            <br />
            1. Check your email inbox
            <br />
            2. Click the verification link
            <br />
            3. Return here to log in
          </p>
          
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/donor/login"
              style={{
                background: '#2563EB',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Go to Login Page
            </Link>
            
            <Link 
              to="/"
              style={{
                background: '#F3F4F6',
                color: '#374151',
                padding: '14px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '1rem'
              }}
            >
              Back to Home
            </Link>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', background: '#F0FDF4', borderRadius: '8px', fontSize: '0.9rem', color: '#065F46' }}>
            📧 <strong>Didn't receive the email?</strong> Check your spam folder or try logging in - you can resend the verification from there.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      
      {/* Left — Form */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '64px', background: '#F8FAFC',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <Link to="/" style={{ 
            display: 'inline-flex', alignItems: 'center', gap: 10, 
            color: '#2563EB', fontFamily: 'system-ui, sans-serif', 
            fontWeight: 700, fontSize: '1.25rem', marginBottom: '48px', textDecoration: 'none'
          }}>
            <span style={{ 
              width: 10, height: 10, borderRadius: '50%', 
              background: '#2563EB', display: 'inline-block'
            }} />
            Helping Hands
          </Link>

          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '12px' }}>
              Join as a Donor
            </h1>
            <p style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.6 }}>
              Start making a difference today. Create your account to track your donations and see your impact.
            </p>
          </div>

          {/* Error Message */}
          {state === 'error' && (
            <div style={{
              background: '#FEF2F2',
              border: '2px solid #FECACA',
              color: '#DC2626',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '24px',
              fontWeight: '500'
            }}>
              ❌ {message}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>First Name *</label>
                <input 
                  type="text" 
                  value={form.firstName} 
                  onChange={e => setForm({ ...form, firstName: e.target.value })}
                  disabled={state === 'loading'}
                  style={{
                    width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                    borderRadius: '8px', fontSize: '16px',
                    opacity: state === 'loading' ? 0.6 : 1
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Last Name *</label>
                <input 
                  type="text" 
                  value={form.lastName} 
                  onChange={e => setForm({ ...form, lastName: e.target.value })}
                  disabled={state === 'loading'}
                  style={{
                    width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                    borderRadius: '8px', fontSize: '16px',
                    opacity: state === 'loading' ? 0.6 : 1
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Email Address *</label>
              <input 
                type="email" 
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })}
                disabled={state === 'loading'}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                  borderRadius: '8px', fontSize: '16px',
                  opacity: state === 'loading' ? 0.6 : 1
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Phone Number</label>
              <input 
                type="tel" 
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })}
                disabled={state === 'loading'}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                  borderRadius: '8px', fontSize: '16px',
                  opacity: state === 'loading' ? 0.6 : 1
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Password *</label>
              <input 
                type="password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })}
                disabled={state === 'loading'}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                  borderRadius: '8px', fontSize: '16px',
                  opacity: state === 'loading' ? 0.6 : 1
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px' }}>Confirm Password *</label>
              <input 
                type="password" 
                value={form.confirmPassword} 
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                disabled={state === 'loading'}
                style={{
                  width: '100%', padding: '12px', border: '1px solid #D1D5DB', 
                  borderRadius: '8px', fontSize: '16px',
                  opacity: state === 'loading' ? 0.6 : 1
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.agreedToTerms}
                  onChange={e => setForm({ ...form, agreedToTerms: e.target.checked })}
                  disabled={state === 'loading'}
                  style={{ marginTop: '2px' }}
                />
                <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={state === 'loading'}
              style={{
                width: '100%',
                background: state === 'loading' ? '#9CA3AF' : '#2563EB',
                color: 'white',
                padding: '16px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                position: 'relative'
              }}
            >
              {state === 'loading' ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <span style={{
                    width: '20px', height: '20px', 
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/donor/login" style={{ color: '#2563EB', fontWeight: 500, textDecoration: 'none' }}>
                Sign in
              </Link>
            </span>
          </div>
          
        </div>
      </div>

      {/* Right — Visual */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=1200&q=80" 
          alt="Food donation"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(23,43,77,0.85) 0%, rgba(52,69,99,0.75) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '64px'
        }}>
          <div style={{ maxWidth: 440, textAlign: 'center' }}>
            <h2 style={{ 
              fontSize: '2rem', fontWeight: 700, 
              color: '#fff', lineHeight: 1.2, marginBottom: '20px',
            }}>
              Make a Real Impact
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', 
              lineHeight: 1.6,
            }}>
              Join thousands of donors making a difference in their communities. Track your donations, see your impact, and help families in need.
            </p>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '📊', text: 'Real-time impact dashboard' },
                { icon: '📸', text: 'Photo-verified donation receipts' },
                { icon: '🏆', text: 'Donor leaderboards & badges' },
              ].map(feature => (
                <div key={feature.text} style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                  <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 500 }}>{feature.text}</span>
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