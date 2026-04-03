import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { registerUser, getFirebaseErrorMessage, RTDB_PERMISSION_ERROR } from '../authService';
import DatabaseSetupBanner from '../components/DatabaseSetupBanner';

const steps = ['Identity', 'Availability', 'Specialization'];

export default function VolunteerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', city: '', bio: '',
    days: [] as string[],
    hours: '',
    skills: [] as string[],
    foodService: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showRulesGuide, setShowRulesGuide] = useState(true);

  const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const skillOptions = ['Education & Mentoring', 'Food Service', 'Healthcare Support', 'Digital Skills', 'Environmental Action', 'Elderly Care', 'Transportation'];

  const toggleArr = (field: 'days' | 'skills', val: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val) ? prev[field].filter(x => x !== val) : [...prev[field], val],
    }));
  };

  const handleNext = async () => {
    if (step === 0) {
      // Step 1: Validate personal details
      if (!form.firstName || !form.lastName || !form.email || !form.city) {
        alert('Please fill in all required fields (Name, Email, City).');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        alert('Please enter a valid email address.');
        return;
      }
      
      setStep(1);
    } else if (step === 1) {
      // Step 2: Validate availability
      if (form.days.length === 0) {
        alert('Please select at least one available day.');
        return;
      }
      if (!form.hours) {
        alert('Please select your weekly hour commitment.');
        return;
      }
      setStep(2);
    } else {
      // Step 3: Submit
      if (form.skills.length === 0) {
        alert('Please select at least one skill.');
        return;
      }
      
      setSubmitError('');
      
      try {
        if (!form.password || form.password.length < 6) {
          alert('Please enter a password of at least 6 characters.');
          return;
        }
        await registerUser(form.email, form.password, 'volunteer');
        setSubmitted(true);
        setTimeout(() => navigate('/volunteer/login'), 3000);
      } catch (error: any) {
        if (error.code === RTDB_PERMISSION_ERROR) {
          setShowRulesGuide(true);
        }
        const errorMessage = getFirebaseErrorMessage(error.code);
        setSubmitError(errorMessage);
        alert(errorMessage);
      }
    }
  };

  if (submitted) return (
    <div style={{ 
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', 
      background: 'linear-gradient(135deg, var(--background) 0%, var(--surface-container-low) 100%)',
    }}>
      <div className="card-elevated animate-scale-in" style={{ maxWidth: 520, textAlign: 'center', padding: '72px 56px' }}>
        <div style={{ 
          width: 80, height: 80, borderRadius: '50%',
          background: 'var(--success-soft)', color: 'var(--success)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '16px' }}>Application Submitted!</h2>
        <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, fontSize: '1.0625rem' }}>
          Thank you for stepping up! We'll review your application and send credentials within 48 hours.
        </p>
        <div style={{ 
          marginTop: '32px', padding: '16px', 
          background: 'var(--surface-container-low)', borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem', color: 'var(--on-surface-variant)',
        }}>
          <span style={{ 
            display: 'inline-block', width: 18, height: 18, 
            border: '2px solid var(--primary)', borderTopColor: 'transparent',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            marginRight: '10px', verticalAlign: 'middle',
          }} />
          Redirecting to login...
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '72px' }}>

        {/* Hero with background image */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          padding: '80px 48px 140px',
        }}>
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
          }}>
            <img 
              src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=80" 
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(0,82,204,0.92) 0%, rgba(38,132,255,0.85) 100%)',
            }} />
          </div>
          
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <Link to="/serve" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: '24px',
            }}>
              ← Back to Volunteer Info
            </Link>
            <div className="chip animate-fade-up" style={{ 
              background: 'rgba(255,255,255,0.15)', color: '#fff', 
              marginBottom: '24px', backdropFilter: 'blur(10px)',
            }}>
              Step {step + 1} of {steps.length}
            </div>
            <h1 className="animate-fade-up" style={{ 
              color: '#fff', marginBottom: '20px', maxWidth: 580,
              animationDelay: '0.1s',
            }}>
              Join our volunteer network
            </h1>
            <p className="animate-fade-up" style={{ 
              fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', 
              maxWidth: 520, lineHeight: 1.7,
              animationDelay: '0.2s',
            }}>
              Complete your application in just 3 simple steps. We'll match you with opportunities that fit your skills and schedule.
            </p>
          </div>
        </section>

        {/* Form Card (floating) */}
        <div className="container" style={{ padding: '0 48px 96px' }}>
          <div style={{ marginTop: '-80px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>

            {/* Sidebar Steps */}
            <div className="card-elevated" style={{ position: 'sticky', top: '96px' }}>
              <div style={{ marginBottom: '28px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '6px', fontFamily: 'Manrope, sans-serif' }}>Registration Steps</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Complete all steps to submit</div>
              </div>

              {/* Progress bar */}
              <div className="progress-track" style={{ height: 6, marginBottom: '24px' }}>
                <div className="progress-fill" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
              </div>

              {steps.map((s, i) => (
                <div key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-lg)',
                  background: i === step ? 'var(--primary-fixed)' : 'transparent',
                  marginBottom: '8px',
                  cursor: i <= step ? 'pointer' : 'default',
                  opacity: i > step ? 0.6 : 1,
                  transition: 'all 0.2s ease',
                }} onClick={() => i <= step && setStep(i)}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--surface-container)',
                    color: i <= step ? '#fff' : 'var(--on-surface-variant)',
                    fontSize: '0.875rem', fontWeight: 700,
                    boxShadow: i === step ? '0 4px 12px rgba(0,82,204,0.3)' : 'none',
                  }}>
                    {i < step ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                      </svg>
                    ) : i + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: i === step ? 'var(--primary)' : 'var(--on-surface)' }}>{s}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                      {['Personal information', 'Your time commitment', 'Food service & skills'][i]}
                    </div>
                  </div>
                </div>
              ))}

              {/* Features */}
              <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--outline-variant)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', text: 'Verified Community Partners' },
                  { iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z', text: 'Skill-Based Matching' },
                  { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', text: 'Direct Impact Tracking' },
                ].map(f => (
                  <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)">
                      <path d={f.iconPath}/>
                    </svg>
                    {f.text}
                  </div>
                ))}
              </div>

              {/* Image */}
              <div style={{ marginTop: '24px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80" 
                  alt="Volunteers" 
                  style={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Form Panel */}
            <div className="card-elevated animate-fade-up">
              {showRulesGuide && <DatabaseSetupBanner />}
              {step === 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                      background: 'var(--primary-fixed)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '2px' }}>Personal Details</h2>
                      <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Tell us about yourself</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fn">First Name</label>
                      <input id="fn" className="form-input" placeholder="John" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="ln">Last Name</label>
                      <input id="ln" className="form-input" placeholder="Doe" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-email">Email</label>
                      <input id="reg-email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">Phone</label>
                      <input id="phone" className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" htmlFor="city">City / Area</label>
                    <input id="city" className="form-input" placeholder="Mumbai, Maharashtra" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label" htmlFor="vol-password">Password *</label>
                    <input id="vol-password" type="password" className="form-input" placeholder="At least 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bio">Brief Bio (optional)</label>
                    <textarea id="bio" className="form-input" rows={3} placeholder="Tell us a bit about yourself…" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} style={{ resize: 'vertical' }} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)">
                      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                    </svg>
                    Your Availability
                  </h2>
                  <div className="form-group" style={{ marginBottom: '28px' }}>
                    <label className="form-label">Available Days</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {dayOptions.map(d => (
                        <button key={d} type="button" onClick={() => toggleArr('days', d)}
                          style={{
                            padding: '8px 16px', borderRadius: '99px', border: 'none',
                            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                            background: form.days.includes(d) ? 'var(--primary)' : 'var(--surface-container)',
                            color: form.days.includes(d) ? '#fff' : 'var(--on-surface)',
                            transition: 'all 0.2s',
                          }}>
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="hours">Hours per Week</label>
                    <select id="hours" className="form-input" value={form.hours} onChange={e => setForm({ ...form, hours: e.target.value })}>
                      <option value="">Select commitment level</option>
                      <option>1–3 hours</option>
                      <option>4–8 hours</option>
                      <option>9–15 hours</option>
                      <option>16+ hours (Full-time)</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)">
                      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                    </svg>
                    Skills & Specialization
                  </h2>
                  <div className="form-group" style={{ marginBottom: '28px' }}>
                    <label className="form-label">Select Your Skills</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                      {skillOptions.map(s => (
                        <button key={s} type="button" onClick={() => toggleArr('skills', s)}
                          style={{
                            padding: '8px 16px', borderRadius: '99px', border: 'none',
                            fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer',
                            background: form.skills.includes(s) ? 'var(--primary)' : 'var(--surface-container)',
                            color: form.skills.includes(s) ? '#fff' : 'var(--on-surface)',
                            transition: 'all 0.2s',
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{
                    padding: '20px', borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-container-low)',
                    marginBottom: '24px',
                  }}>
                    <div style={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)">
                        <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/>
                      </svg>
                      Food Service Program
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '12px' }}>
                      Are you interested in preparing or serving meals?
                    </p>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {['Yes, I can prepare meals', 'Yes, I can serve meals', 'Both', 'Not at this time'].map(opt => (
                        <button key={opt} type="button" onClick={() => setForm({ ...form, foodService: opt })}
                          style={{
                            padding: '8px 14px', borderRadius: 'var(--radius-md)', border: 'none',
                            fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer',
                            background: form.foodService === opt ? 'var(--primary)' : 'var(--surface-container)',
                            color: form.foodService === opt ? '#fff' : 'var(--on-surface)',
                            transition: 'all 0.2s',
                          }}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                    By clicking submit, you agree to our{' '}
                    <a href="#" style={{ color: 'var(--primary)', fontWeight: 500 }}>Volunteer Privacy Policy</a>.
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(195,198,215,0.2)' }}>
                <button type="button" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                  className="btn btn-secondary" style={{ opacity: step === 0 ? 0.4 : 1 }}>
                  Back
                </button>
                <button type="button" onClick={handleNext} className="btn btn-primary">
                  {step < 2 ? 'Next Step' : 'Submit Application'}
                </button>
              </div>
              
              {step === 0 && (
                <div style={{ 
                  marginTop: '24px', paddingTop: '24px', 
                  borderTop: '1px solid var(--outline-variant)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                    Want to donate instead?{' '}
                    <Link to="/donor/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                      Create donor account
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
