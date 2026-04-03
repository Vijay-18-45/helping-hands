import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';
import MapPicker from '../components/MapPicker';
import LocationViewer from '../components/LocationViewer';

interface DonationForm {
  title: string;
  description: string;
  quantity: string;
  freshness: string;
  image: string;
}

interface MyDonation {
  id: string;
  donorId: string;
  title: string;
  description: string;
  quantity: string;
  freshness: number;
  image: string;
  status: string;
  timestamp: number;
  location?: { lat: number; lng: number };
}

function isFresh(timestamp: number, freshnessHours: number): boolean {
  return Date.now() < timestamp + freshnessHours * 3600000;
}

function timeRemaining(timestamp: number, freshnessHours: number): string {
  const diff = timestamp + freshnessHours * 3600000 - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  available: { label: 'Available', bg: 'var(--primary-fixed)', color: 'var(--primary)' },
  requested: { label: 'Requested', bg: '#fff7ed', color: '#f97316' },
  fulfilled:  { label: 'Fulfilled',  bg: 'var(--success-soft)', color: 'var(--success)' },
};

export default function DonorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, addToast, dismissToast } = useToast();

  const [activeSection, setActiveSection] = useState<'create' | 'mydonations'>('create');
  const [form, setForm] = useState<DonationForm>({
    title: '', description: '', quantity: '', freshness: '', image: '',
  });
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [lastDonationTitle, setLastDonationTitle] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const [myDonations, setMyDonations] = useState<MyDonation[]>([]);
  const [donationsLoading, setDonationsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const donationsRef = ref(rtdb, 'donations');
    const unsub = onValue(donationsRef, snap => {
      if (snap.exists()) {
        const data = snap.val();
        const list: MyDonation[] = Object.entries(data)
          .map(([id, val]) => ({ id, ...(val as Omit<MyDonation, 'id'>) }))
          .filter(d => d.donorId === user.uid)
          .sort((a, b) => b.timestamp - a.timestamp);
        setMyDonations(list);
      } else {
        setMyDonations([]);
      }
      setDonationsLoading(false);
    });
    return () => unsub();
  }, [user]);

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

  const totalCount = myDonations.length;
  const fulfilledCount = myDonations.filter(d => d.status === 'fulfilled').length;
  const activeCount = myDonations.filter(d => d.status === 'available' || d.status === 'requested').length;

  return (
    <div className="dashboard-layout">
      <Toast toasts={toasts} onDismiss={dismissToast} />

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
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setShowSuccessPopup(false); setActiveSection('mydonations'); }}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: 'var(--surface-container-low)',
                  color: 'var(--on-surface)', fontWeight: 600, fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                View My Donations
              </button>
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
          <button
            onClick={() => setActiveSection('create')}
            className={`sidebar-link${activeSection === 'create' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </span>
            Create Donation
          </button>
          <button
            onClick={() => setActiveSection('mydonations')}
            className={`sidebar-link${activeSection === 'mydonations' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </span>
            My Donations
            {activeCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', borderRadius: 99, fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', minWidth: 20, textAlign: 'center' }}>
                {activeCount}
              </span>
            )}
          </button>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {[
              { label: 'Total Donations', value: totalCount, color: 'var(--primary)', iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
              { label: 'Active', value: activeCount, color: '#f97316', iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
              { label: 'Fulfilled', value: fulfilledCount, color: 'var(--success)', iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 24 }}>
                <span style={{ width: 44, height: 44, background: `${s.color}18`, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 12 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d={s.iconPath}/></svg>
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'Manrope' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {activeSection === 'create' ? (
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
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Description</span>
                    <span style={{ fontSize: '0.75rem', color: form.description.length > 280 ? 'var(--accent)' : 'var(--outline)', fontWeight: 400 }}>
                      {form.description.length}/300
                    </span>
                  </label>
                  <textarea
                    className="form-input" rows={3}
                    placeholder="Describe the food, preparation method, allergens, etc."
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value.slice(0, 300) }))}
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
        ) : (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              My Donations
            </h2>

            {donationsLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16, color: 'var(--on-surface-variant)' }}>
                <span style={{ width: 36, height: 36, border: '3px solid var(--primary-fixed)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading your donations...
              </div>
            ) : myDonations.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
                <div style={{ width: 72, height: 72, background: 'var(--surface-container-low)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--on-surface-variant)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No donations yet</div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', marginBottom: 20 }}>You haven't listed any food donations. Start making a difference today!</div>
                <button onClick={() => setActiveSection('create')} className="btn btn-primary">Create First Donation</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myDonations.map(donation => {
                  const fresh = isFresh(donation.timestamp, donation.freshness);
                  const remaining = timeRemaining(donation.timestamp, donation.freshness);
                  const statusCfg = STATUS_CONFIG[donation.status] ?? STATUS_CONFIG['available'];
                  return (
                    <div key={donation.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', borderLeft: `4px solid ${statusCfg.color}` }}>
                      {donation.image && (
                        <img src={donation.image} alt={donation.title} style={{ width: 120, height: 'auto', objectFit: 'cover', flexShrink: 0 }} />
                      )}
                      <div style={{ padding: '20px 24px', flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{donation.title}</h3>
                          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                            <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, background: statusCfg.bg, color: statusCfg.color }}>
                              {statusCfg.label}
                            </span>
                            {donation.status === 'available' && (
                              <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, background: fresh ? 'var(--success-soft)' : 'var(--accent-soft)', color: fresh ? 'var(--success)' : 'var(--accent)' }}>
                                {fresh ? 'Fresh' : 'Expired'}
                              </span>
                            )}
                          </div>
                        </div>
                        {donation.description && (
                          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: 10, lineHeight: 1.5 }}>{donation.description}</p>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                          <span><strong>Qty:</strong> {donation.quantity}</span>
                          {donation.status === 'available' && (
                            <span style={{ color: fresh ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>{remaining}</span>
                          )}
                          {donation.status === 'fulfilled' && (
                            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Delivered successfully</span>
                          )}
                          {donation.status === 'requested' && (
                            <span style={{ color: '#f97316', fontWeight: 600 }}>Awaiting volunteer pickup</span>
                          )}
                          <span style={{ color: 'var(--outline)' }}>{new Date(donation.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {donation.location && (
                        <div style={{ width: 140, flexShrink: 0 }}>
                          <LocationViewer location={donation.location} markerColor="green" height={140} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
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
