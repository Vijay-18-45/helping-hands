import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { registerUser, sendVerificationEmail, getFirebaseErrorMessage } from '../authService';

export default function DonorRegister() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Additional protection

  // Debug: Log when verification message state changes
  useEffect(() => {
    console.log('🔄 showVerificationMessage changed:', showVerificationMessage);
  }, [showVerificationMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions with dual protection
    if (loading || isSubmitting) {
      console.log('⚠️ Already processing, ignoring duplicate submission. Loading:', loading, 'Submitting:', isSubmitting);
      return;
    }
    
    setError('');
    setIsSubmitting(true);
    setLoading(true);

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    if (!form.agreedToTerms) {
      setError('Please agree to the Terms & Privacy Policy.');
      setLoading(false);
      setIsSubmitting(false);
      return;
    }

    console.log('🔄 Starting registration for:', form.email);
    
    // Set a timeout to reset loading state in case something gets stuck
    const timeoutId = setTimeout(() => {
      console.log('⚠️ Registration timeout - resetting states');
      setLoading(false);
      setIsSubmitting(false);
      setError('Registration timeout. Please try again.');
    }, 30000); // 30 seconds timeout
    
    try {
      // Register donor with Firebase
      console.log('🔄 Starting registration...');
      await registerUser(form.email, form.password, 'donor');
      console.log('✅ Registration successful!');
      
      // Try to send email verification
      try {
        await sendVerificationEmail();
        console.log('✅ Verification email sent!');
      } catch (emailError: any) {
        console.warn('⚠️ Failed to send verification email:', emailError);
        // Continue anyway - user can resend later
      }
      
      // Show verification message
      clearTimeout(timeoutId); // Clear timeout on success
      setLoading(false);
      setIsSubmitting(false);
      setShowVerificationMessage(true);
      console.log('✅ Showing verification message!');
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      clearTimeout(timeoutId); // Clear timeout on error
      setLoading(false);
      setIsSubmitting(false);
      const errorMessage = getFirebaseErrorMessage(error.code);
      setError(errorMessage);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left — Form */}
      <div style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        padding: '64px', background: 'var(--surface-container-lowest)',
      }}>
        <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-up">

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
            <div className="chip" style={{ marginBottom: '16px' }}>Create Account</div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '12px' }}>
              Join as a Donor
            </h1>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '1rem', lineHeight: 1.6 }}>
              Start making a difference today. Create your account to track your donations and see your impact.
            </p>
            
            {/* DEBUG: Test button to show verification message */}
            <button
              onClick={() => {
                console.log('🧪 Test: Setting showVerificationMessage to true');
                setShowVerificationMessage(true);
              }}
              style={{
                background: '#FFA500',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                marginTop: '16px',
                fontSize: '0.875rem'
              }}
            >
              🧪 TEST: Show Verification Message
            </button>
          </div>

          {/* Verification Success Message */}
          {showVerificationMessage && (
            <div style={{
              background: '#F0FDF4',
              border: '2px solid #16A34A',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              marginBottom: '24px'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: '#16A34A',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: '16px'
                }}>
                  <svg style={{ width: '40px', height: '40px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#16A34A', 
                  marginBottom: '16px' 
                }}>
                  🎉 Account Created Successfully!
                </h3>
                <p style={{ 
                  color: '#374151', 
                  fontSize: '1rem', 
                  lineHeight: '1.6',
                  marginBottom: '24px' 
                }}>
                  We've sent a verification email to <strong>{form.email}</strong>. 
                  <br />Please check your inbox and click the verification link to complete your registration.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
                  <Link 
                    to="/donor/login" 
                    style={{
                      display: 'block',
                      width: '100%',
                      background: '#2563EB',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: '500',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Go to Login Page
                  </Link>
                  <button
                    onClick={async () => {
                      try {
                        await sendVerificationEmail();
                        alert('Verification email sent again! Check your inbox.');
                      } catch (error) {
                        alert('Failed to resend email. Please try again.');
                      }
                    }}
                    style={{
                      width: '100%',
                      background: '#F3F4F6',
                      color: '#374151',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Resend Verification Email
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {!showVerificationMessage && (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">First Name *</label>
                <input 
                  id="firstName" 
                  type="text" 
                  className="form-input" 
                  placeholder="John"
                  value={form.firstName} 
                  onChange={e => setForm({ ...form, firstName: e.target.value })} 
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Last Name *</label>
                <input 
                  id="lastName" 
                  type="text" 
                  className="form-input" 
                  placeholder="Doe"
                  value={form.lastName} 
                  onChange={e => setForm({ ...form, lastName: e.target.value })} 
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address *</label>
              <input 
                id="reg-email" 
                type="email" 
                className="form-input" 
                placeholder="john@example.com"
                value={form.email} 
                onChange={e => setForm({ ...form, email: e.target.value })} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Phone Number</label>
              <input 
                id="reg-phone" 
                type="tel" 
                className="form-input" 
                placeholder="+91 9876543210"
                value={form.phone} 
                onChange={e => setForm({ ...form, phone: e.target.value })} 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password *</label>
              <input 
                id="reg-password" 
                type="password" 
                className="form-input" 
                placeholder="At least 8 characters"
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
              <input 
                id="reg-confirm-password" 
                type="password" 
                className="form-input" 
                placeholder="Re-enter password"
                value={form.confirmPassword} 
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })} 
                required
              />
            </div>

            <div style={{
              padding: '16px 18px', 
              background: 'var(--surface-container-low)', 
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              lineHeight: 1.6,
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={form.agreedToTerms}
                  onChange={e => setForm({ ...form, agreedToTerms: e.target.checked })}
                  style={{ marginTop: '3px', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--on-surface-variant)' }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
                    Terms of Service
                  </a>
                  {' '}and{' '}
                  <a href="#" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* DEBUG: Manual reset button */}
            {(loading || isSubmitting) && (
              <button
                type="button"
                onClick={() => {
                  console.log('🔄 Manual reset of states');
                  setLoading(false);
                  setIsSubmitting(false);
                  setError('');
                }}
                style={{
                  background: '#DC2626',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontSize: '0.875rem',
                  width: '100%'
                }}
              >
                🛑 EMERGENCY RESET - Stop Infinite Loop
              </button>
            )}

            <button
              type="submit" 
              className="btn btn-primary btn-lg" 
              disabled={loading || isSubmitting} 
              style={{ width: '100%', opacity: (loading || isSubmitting) ? 0.7 : 1 }}
            >
              {loading ? (
                <>
                  <span style={{ 
                    width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <div style={{ 
            marginTop: '32px', paddingTop: '32px', 
            borderTop: '1px solid var(--outline-variant)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
              Already have an account?{' '}
              <Link to="/donor/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                Sign in
              </Link>
            </div>
            
            <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
              Want to volunteer instead?{' '}
              <Link to="/volunteer/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                Apply to volunteer
              </Link>
            </div>
            
            <Link to="/" className="btn btn-ghost btn-sm">
              ← Return to Home
            </Link>
          </div>
          </>
        )} {/* End of conditional form */}
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
          <div style={{ maxWidth: 480 }}>
            <div className="chip" style={{ 
              background: 'rgba(255,255,255,0.15)', 
              color: '#fff', 
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
            }}>
              Join Our Community
            </div>
            <h2 style={{ 
              fontSize: '2.5rem', fontWeight: 800, 
              color: '#fff', lineHeight: 1.2, marginBottom: '20px',
            }}>
              Every contribution creates lasting impact
            </h2>
            <p style={{ 
              color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', 
              lineHeight: 1.7, marginBottom: '48px',
            }}>
              Join thousands of donors who are making a real difference. Get complete transparency, 
              track your impact, and see exactly where your donations go.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { 
                  iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', 
                  title: 'Real-Time Impact Dashboard',
                  desc: 'Track every donation and see your direct impact on families and communities'
                },
                { 
                  iconPath: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z', 
                  title: 'Photo-Verified Receipts',
                  desc: 'Receive photos and updates showing exactly how your contribution helped'
                },
                { 
                  iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', 
                  title: 'Tax-Deductible Donations',
                  desc: 'Automated receipts for tax purposes with full compliance documentation'
                },
              ].map(f => (
                <div key={f.title} style={{
                  display: 'flex', gap: '16px',
                  padding: '20px 24px',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ flexShrink: 0 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d={f.iconPath}/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{f.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div style={{ 
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '48px',
              paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)',
            }}>
              {[
                { value: '12,500+', label: 'Active Donors' },
                { value: '$2.1M+', label: 'Total Donated' },
                { value: '25K+', label: 'Meals Served' },
              ].map(stat => (
                <div key={stat.label}>
                  <div style={{ 
                    fontSize: '1.5rem', fontWeight: 800, color: '#fff', 
                    fontFamily: 'Manrope', marginBottom: '4px',
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
