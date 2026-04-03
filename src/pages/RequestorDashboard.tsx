import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ref, onValue, push, update } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';
import MapPicker from '../components/MapPicker';
import LocationViewer from '../components/LocationViewer';
import DatabaseSetupBanner from '../components/DatabaseSetupBanner';

interface Donation {
  id: string;
  donorId: string;
  title: string;
  description: string;
  quantity: string;
  freshness: number;
  image: string;
  timestamp: number;
  status: string;
  location?: { lat: number; lng: number };
}

interface RequestForm {
  requesterName: string;
  phone: string;
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

export default function RequestorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, addToast, dismissToast } = useToast();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [requestForm, setRequestForm] = useState<RequestForm>({ requesterName: '', phone: '' });
  const [requestLocation, setRequestLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState<'available' | 'myrequests'>('available');
  const [myRequests, setMyRequests] = useState<any[]>([]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  useEffect(() => {
    const donationsRef = ref(rtdb, 'donations');
    const unsub = onValue(donationsRef, snap => {
      if (snap.exists()) {
        const data = snap.val();
        const list: Donation[] = Object.entries(data)
          .map(([id, val]) => ({ id, ...(val as Omit<Donation, 'id'>) }))
          .filter(d => d.status === 'available')
          .sort((a, b) => b.timestamp - a.timestamp);
        setDonations(list);
      } else {
        setDonations([]);
      }
      setLoading(false);
    }, err => {
      console.error(err);
      addToast('Failed to load donations.', 'error');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const requestsRef = ref(rtdb, 'requests');
    const unsub = onValue(requestsRef, snap => {
      if (!snap.exists()) { setMyRequests([]); return; }
      const data = snap.val();
      const list = Object.entries(data)
        .map(([id, val]) => ({ id, ...(val as any) }))
        .filter((r: any) => r.requestorId === user.uid)
        .sort((a: any, b: any) => b.timestamp - a.timestamp);
      setMyRequests(list);
    });
    return () => unsub();
  }, [user]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) { addToast('Geolocation not supported.', 'error'); return; }
    navigator.geolocation.getCurrentPosition(
      pos => setRequestLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => addToast('Could not detect location. Please click on the map.', 'error')
    );
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestForm.requesterName || !requestForm.phone) {
      addToast('Please fill in your name and phone number.', 'error'); return;
    }
    if (!requestLocation) {
      addToast('Please select your location on the map.', 'error'); return;
    }
    if (!requestingId || !user) return;

    setSubmitting(true);
    try {
      await push(ref(rtdb, 'requests'), {
        donationId: requestingId,
        requestorId: user.uid,
        requesterName: requestForm.requesterName,
        phone: requestForm.phone,
        location: requestLocation,
        status: 'pending',
        timestamp: Date.now(),
      });
      await update(ref(rtdb, `donations/${requestingId}`), { status: 'requested' });
      addToast('Request submitted successfully!', 'success');
      setRequestingId(null);
      setRequestForm({ requesterName: '', phone: '' });
      setRequestLocation(null);
    } catch {
      addToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {requestingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Request This Donation</h3>
              <button onClick={() => { setRequestingId(null); setRequestLocation(null); setRequestForm({ requesterName: '', phone: '' }); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--on-surface-variant)', fontSize: 22 }}>×</button>
            </div>
            <form onSubmit={handleRequestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Your Full Name *</label>
                <input className="form-input" placeholder="Enter your name" value={requestForm.requesterName}
                  onChange={e => setRequestForm(f => ({ ...f, requesterName: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number *</label>
                <input className="form-input" placeholder="+91 9876543210" value={requestForm.phone}
                  onChange={e => setRequestForm(f => ({ ...f, phone: e.target.value }))} required />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label" style={{ margin: 0 }}>Your Location * <span style={{ fontSize: '0.8125rem', fontWeight: 400, color: 'var(--on-surface-variant)' }}>(click map to set)</span></label>
                  <button type="button" onClick={handleDetectLocation}
                    style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06z"/></svg>
                    Auto-detect
                  </button>
                </div>
                <MapPicker location={requestLocation} onChange={setRequestLocation} height={220} />
                {requestLocation && (
                  <div style={{ marginTop: 6, fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>
                    Location: {requestLocation.lat.toFixed(5)}, {requestLocation.lng.toFixed(5)}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                  onClick={() => { setRequestingId(null); setRequestLocation(null); setRequestForm({ requesterName: '', phone: '' }); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? (
                    <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Submitting...</>
                  ) : 'Submit Request'}
                </button>
              </div>
            </form>
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
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(220,38,38,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', fontWeight: 800, fontSize: '1.125rem' }}>
              {user?.email?.[0]?.toUpperCase() ?? 'R'}
            </div>
            <div>
              <div className="user-name">{user?.email?.split('@')[0] ?? 'User'}</div>
              <div className="user-role">Requestor</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveSection('available')} className={`sidebar-link${activeSection === 'available' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg></span>
            Available Food
          </button>
          <button onClick={() => setActiveSection('myrequests')} className={`sidebar-link${activeSection === 'myrequests' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></span>
            My Requests
          </button>
          <Link to="/" className="sidebar-link">
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></span>
            Home
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-link" onClick={handleLogout}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--accent)' }}>
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg></span>
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>Welcome, <strong>{user?.email?.split('@')[0]}</strong></p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Food Requests</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>
        </header>

        <DatabaseSetupBanner />

        {activeSection === 'available' ? (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              Available Donations
            </h2>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16, color: 'var(--on-surface-variant)' }}>
                <span style={{ width: 36, height: 36, border: '3px solid var(--primary-fixed)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading donations...
              </div>
            ) : donations.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
                <div style={{ width: 72, height: 72, background: 'var(--surface-container-low)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--on-surface-variant)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No donations available</div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>Check back soon — donors are adding new items regularly.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
                {donations.map(donation => {
                  const fresh = isFresh(donation.timestamp, donation.freshness);
                  const remaining = timeRemaining(donation.timestamp, donation.freshness);
                  return (
                    <div key={donation.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                      {donation.image ? (
                        <img src={donation.image} alt={donation.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: 120, background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                        </div>
                      )}
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, flex: 1 }}>{donation.title}</h3>
                          <span style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginLeft: 8, background: fresh ? 'var(--success-soft)' : 'var(--accent-soft)', color: fresh ? 'var(--success)' : 'var(--accent)' }}>
                            {fresh ? 'Fresh' : 'Expired'}
                          </span>
                        </div>
                        {donation.description && (
                          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, marginBottom: 12 }}>{donation.description}</p>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--on-surface-variant)"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8z"/></svg>
                            <span><strong>Qty:</strong> {donation.quantity}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill={fresh ? 'var(--success)' : 'var(--accent)'}><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                            <span style={{ color: fresh ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>{remaining}</span>
                          </div>
                        </div>

                        {donation.location && (
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                              Pickup Location
                            </div>
                            <LocationViewer location={donation.location} markerColor="green" height={160} />
                          </div>
                        )}

                        <button
                          onClick={() => { setRequestingId(donation.id); setRequestForm({ requesterName: '', phone: '' }); setRequestLocation(null); }}
                          className="btn btn-primary"
                          style={{ width: '100%' }}
                          disabled={!fresh}
                        >
                          {fresh ? 'Request Item' : 'Expired'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              My Requests
            </h2>
            {myRequests.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No requests yet</div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', marginBottom: 20 }}>Browse available donations and request items you need.</div>
                <button onClick={() => setActiveSection('available')} className="btn btn-primary">Browse Food</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {myRequests.map((req: any) => (
                  <div key={req.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontWeight: 700 }}>Request ID: {req.id.slice(-6)}</div>
                      <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, background: req.status === 'pending' ? 'var(--primary-fixed)' : 'var(--success-soft)', color: req.status === 'pending' ? 'var(--primary)' : 'var(--success)' }}>
                        {req.status?.toUpperCase() ?? 'PENDING'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', display: 'flex', gap: 20 }}>
                      <span><strong>Name:</strong> {req.requesterName}</span>
                      <span><strong>Phone:</strong> {req.phone}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--outline)', marginTop: 8 }}>
                      Submitted: {new Date(req.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes mapSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
