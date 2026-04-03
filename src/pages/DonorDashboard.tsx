import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ref, push } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';
import MapPicker from '../components/MapPicker';

interface DonationForm {
  title: string;
  description: string;
  quantity: string;
  freshness: string;
  image: string;
}

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, addToast, dismissToast } = useToast();

  const [form, setForm] = useState<DonationForm>({
    title: '', description: '', quantity: '', freshness: '', image: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastDonationTitle, setLastDonationTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const handleImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, image: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleImageFile(file);
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => addToast('Unable to detect location. Please click on the map.', 'error')
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.quantity || !form.freshness) {
      addToast('Please fill in all required fields.', 'error');
      return;
    }
    if (!location) {
      addToast('Please select a pickup location on the map.', 'error');
      return;
    }
    if (!user) return;
    setSubmitting(true);
    try {
      await push(ref(rtdb, 'donations'), {
        donorId: user.uid,
        title: form.title,
        description: form.description,
        quantity: form.quantity,
        freshness: Number(form.freshness),
        image: form.image,
        location,
        status: 'available',
        timestamp: Date.now(),
      });
      setLastDonationTitle(form.title);
      setForm({ title: '', description: '', quantity: '', freshness: '', image: '' });
      setLocation(null);
      setShowSuccessPopup(true);
    } catch {
      addToast('Failed to submit donation. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Encouragement Success Popup */}
      {showSuccessPopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: '56px 48px',
            maxWidth: 480, width: '100%', textAlign: 'center',
            boxShadow: '0 32px 64px rgba(0,0,0,0.2)',
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {/* Animated heart icon */}
            <div style={{
              width: 96, height: 96, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0052cc, #2684ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px', boxShadow: '0 12px 32px rgba(0,82,204,0.35)',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.875rem', fontWeight: 800, marginBottom: 12, color: '#0052cc' }}>
              You're a hero! 🎉
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>
              Your donation of <strong>"{lastDonationTitle}"</strong> has been listed successfully.
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 32 }}>
              Every meal you share brings someone one step closer to hope. A volunteer will coordinate the pickup and ensure your food reaches those who need it most. Thank you for making a real difference! 🙏
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
              {[
                { icon: '🍱', label: 'Donation Listed', sub: 'Live now' },
                { icon: '🤝', label: 'Volunteer Notified', sub: 'On the way' },
                { icon: '❤️', label: 'Lives Impacted', sub: 'Thank you!' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f0f7ff', borderRadius: 14, padding: '16px 8px' }}>
                  <div style={{ fontSize: '1.75rem', marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0052cc' }}>{s.label}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#6b7280', marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowSuccessPopup(false)}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #0052cc, #2684ff)',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,82,204,0.35)',
                }}
              >
                Donate Again 💪
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--grad-primary)', display: 'inline-block', boxShadow: '0 2px 8px rgba(0,82,204,0.3)' }} />
          Helping Hands
        </Link>

        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--primary-fixed)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem',
              border: '2px solid var(--primary-fixed)',
            }}>
              {user?.email?.[0]?.toUpperCase() ?? 'D'}
            </div>
            <div>
              <div className="user-name">{user?.email?.split('@')[0] ?? 'Donor'}</div>
              <div className="user-role">Donor</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <a href="#donate" className="sidebar-link active">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </span>
            Create Donation
          </a>
          <Link to="/" className="sidebar-link">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </span>
            Home
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={handleLogout}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--accent)' }}>
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
            </span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>
                Welcome back, <strong>{user?.email?.split('@')[0]}</strong>
              </p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Donor Dashboard</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>

          <div style={{
            marginTop: 24, padding: '14px 20px',
            background: 'var(--primary-fixed)', borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', gap: 12,
            color: 'var(--primary)', fontSize: '0.9375rem',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Logged in as <strong>{user?.email}</strong>
          </div>
        </header>

        <section id="donate">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create a New Donation
          </h2>

          <div className="card" style={{ maxWidth: 720 }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div className="form-group">
                <label className="form-label">Food Title *</label>
                <input
                  className="form-input" placeholder="e.g., Cooked Rice (30 portions)"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input" rows={3}
                  placeholder="Describe the food, preparation method, allergens, etc."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Quantity *</label>
                  <input
                    className="form-input" placeholder="e.g., 30 portions"
                    value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Freshness (hours) *</label>
                  <input
                    type="number" min="1" max="168" className="form-input"
                    placeholder="e.g., 4"
                    value={form.freshness} onChange={e => setForm(f => ({ ...f, freshness: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Upload Image</label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    borderRadius: 'var(--radius-xl)', padding: '32px', textAlign: 'center',
                    background: dragging ? 'var(--primary-fixed)' : 'var(--surface-container-low)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                  {form.image ? (
                    <img src={form.image} alt="Preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="var(--on-surface-variant)" style={{ marginBottom: 8 }}>
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                      </svg>
                      <div style={{ fontWeight: 600, marginBottom: 4 }}>Drag & drop or click to browse</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>PNG, JPG up to 5MB</div>
                    </>
                  )}
                  <input
                    ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
                  />
                </div>
                {form.image && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                    style={{ marginTop: 8, background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.875rem' }}>
                    Remove image
                  </button>
                )}
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>Pickup Location * <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--on-surface-variant)' }}>(click on map to set)</span></label>
                  <button type="button" onClick={handleDetectLocation}
                    style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/></svg>
                    Auto-detect
                  </button>
                </div>
                <MapPicker location={location} onChange={setLocation} height={280} />
                {location && (
                  <div style={{ marginTop: 8, fontSize: '0.8125rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--success)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    Location selected: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-lg"
                disabled={submitting || !form.title || !form.quantity || !form.freshness || !location}
                style={{ width: '100%', opacity: (!form.title || !form.quantity || !form.freshness || !location) ? 0.5 : 1 }}>
                {submitting ? (
                  <>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Submitting...
                  </>
                ) : 'Submit Donation'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 12px 32px rgba(0,82,204,0.35); }
          50% { transform: scale(1.06); box-shadow: 0 16px 40px rgba(0,82,204,0.5); }
        }
      `}</style>
    </div>
  );
}
