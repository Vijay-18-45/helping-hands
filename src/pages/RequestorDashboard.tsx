import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, update, get } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';
import MapPicker from '../components/MapPicker';
import LocationViewer from '../components/LocationViewer';


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

interface MyRequest {
  id: string;
  donationId: string;
  requestorId: string;
  requesterName: string;
  phone: string;
  location?: { lat: number; lng: number };
  status: string;
  timestamp: number;
  volunteerName?: string;
  acceptedAt?: number;
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
  const [myRequests, setMyRequests] = useState<MyRequest[]>([]);
  const [acceptedNotification, setAcceptedNotification] = useState<MyRequest | null>(null);
  const [donationsMap, setDonationsMap] = useState<Record<string, Donation>>({});

  // Track previous statuses to detect changes in real-time
  const prevStatuses = useRef<Record<string, string>>({});
  const isFirstLoad = useRef(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  useEffect(() => {
    const donationsRef = ref(rtdb, 'donations');
    const unsub = onValue(donationsRef, snap => {
      if (snap.exists()) {
        const data = snap.val();
        const all: Donation[] = Object.entries(data)
          .map(([id, val]) => ({ id, ...(val as Omit<Donation, 'id'>) }));
        const map: Record<string, Donation> = {};
        for (const d of all) map[d.id] = d;
        setDonationsMap(map);
        const available = all
          .filter(d => d.status === 'available')
          .sort((a, b) => b.timestamp - a.timestamp);
        setDonations(available);
      } else {
        setDonations([]);
        setDonationsMap({});
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
      if (!snap.exists()) {
        setMyRequests([]);
        prevStatuses.current = {};
        isFirstLoad.current = false;
        return;
      }
      const data = snap.val();
      const list: MyRequest[] = Object.entries(data)
        .map(([id, val]) => ({ id, ...(val as Omit<MyRequest, 'id'>) }))
        .filter((r) => r.requestorId === user.uid)
        .sort((a, b) => b.timestamp - a.timestamp);

      // Detect newly accepted requests (skip on first load)
      if (!isFirstLoad.current) {
        for (const req of list) {
          const prev = prevStatuses.current[req.id];
          if (prev && prev !== 'accepted' && req.status === 'accepted') {
            setAcceptedNotification(req);
            break;
          }
        }
      }

      // Update tracked statuses
      const newStatuses: Record<string, string> = {};
      for (const req of list) newStatuses[req.id] = req.status;
      prevStatuses.current = newStatuses;
      isFirstLoad.current = false;

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

    // Guard: prevent duplicate request for the same donation
    const alreadyRequested = myRequests.some(r => r.donationId === requestingId);
    if (alreadyRequested) {
      addToast('You have already submitted a request for this donation.', 'error');
      setRequestingId(null);
      return;
    }

    setSubmitting(true);
    try {
      // Guard: verify donation is still "available" before submitting (stale UI protection)
      const donationSnap = await get(ref(rtdb, `donations/${requestingId}`));
      if (!donationSnap.exists() || donationSnap.val().status !== 'available') {
        addToast('Sorry, this donation is no longer available. Someone else may have just requested it.', 'error');
        setRequestingId(null);
        return;
      }

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
      addToast('Request submitted! A volunteer will contact you soon.', 'success');
      setRequestingId(null);
      setRequestForm({ requesterName: '', phone: '' });
      setRequestLocation(null);
      setActiveSection('myrequests');
    } catch (err) {
      console.error(err);
      addToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const acceptedCount = myRequests.filter(r => r.status === 'accepted').length;
  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  // Set of donationIds the user has already requested (any status)
  const requestedDonationIds = new Set(myRequests.map(r => r.donationId));

  return (
    <div className="dashboard-layout">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Volunteer Accepted Notification Popup */}
      {acceptedNotification && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 300,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        }}>
          <div style={{
            background: 'white', borderRadius: 24, padding: '52px 44px',
            maxWidth: 460, width: '100%', textAlign: 'center',
            boxShadow: '0 32px 64px rgba(0,0,0,0.25)',
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: 'linear-gradient(135deg, #00a65a, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 12px 32px rgba(0,166,90,0.35)',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              <svg width="44" height="44" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
            </div>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 12, color: '#00a65a' }}>
              Great news! 🎉
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#374151', lineHeight: 1.7, marginBottom: 8 }}>
              A volunteer has accepted your request!
            </p>
            <p style={{ fontSize: '0.9375rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 8 }}>
              {acceptedNotification.volunteerName
                ? <><strong>{acceptedNotification.volunteerName}</strong> will be picking up your donation and delivering it to you.</>
                : 'A volunteer will be picking up your donation and delivering it to you.'
              }
            </p>
            <div style={{ padding: '16px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, marginBottom: 28, fontSize: '0.875rem', color: '#166534' }}>
              <strong>Item:</strong> {acceptedNotification.requesterName}'s request<br />
              {acceptedNotification.acceptedAt && (
                <span><strong>Accepted at:</strong> {new Date(acceptedNotification.acceptedAt).toLocaleTimeString()}</span>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { setAcceptedNotification(null); setActiveSection('myrequests'); }}
                style={{
                  flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #00a65a, #34d399)',
                  color: 'white', fontWeight: 700, fontSize: '1rem',
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,166,90,0.35)',
                }}
              >
                View My Requests
              </button>
              <button
                onClick={() => setAcceptedNotification(null)}
                style={{ padding: '14px 20px', borderRadius: 12, border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
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
            {pendingCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', borderRadius: 99, fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px' }}>{pendingCount}</span>
            )}
            {acceptedCount > 0 && (
              <span style={{ marginLeft: pendingCount > 0 ? 4 : 'auto', background: 'var(--success)', color: 'white', borderRadius: 99, fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px' }}>{acceptedCount} ✓</span>
            )}
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
        <header style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>Welcome, <strong>{user?.email?.split('@')[0]}</strong></p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Food Requests</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>
        </header>

        {activeSection === 'available' ? (
          <section style={{ marginTop: 24 }}>
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

                        {requestedDonationIds.has(donation.id) ? (
                          <div style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-lg)', background: 'var(--success-soft)', color: 'var(--success)', fontWeight: 700, fontSize: '0.9375rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                            Already Requested
                          </div>
                        ) : (
                          <button
                            onClick={() => { setRequestingId(donation.id); setRequestForm({ requesterName: '', phone: '' }); setRequestLocation(null); }}
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={!fresh}
                          >
                            {fresh ? 'Request Item' : 'Expired — Cannot Request'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section style={{ marginTop: 24 }}>
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
                {myRequests.map((req) => {
                  const isAccepted = req.status === 'accepted';
                  return (
                    <div key={req.id} className="card" style={{ borderLeft: `4px solid ${isAccepted ? 'var(--success)' : 'var(--primary)'}`, padding: '20px 24px' }}>
                      {isAccepted && (
                        <div style={{ padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#00a65a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.9375rem' }}>
                              A volunteer has accepted your request!
                            </div>
                            {req.volunteerName && (
                              <div style={{ color: '#166534', fontSize: '0.8125rem', marginTop: 2 }}>
                                <strong>{req.volunteerName}</strong> will coordinate pickup & delivery.
                                {req.acceptedAt && ` Accepted at ${new Date(req.acceptedAt).toLocaleTimeString()}.`}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.0625rem' }}>
                            {donationsMap[req.donationId]?.title ?? `Donation #${req.donationId.slice(-6)}`}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginTop: 2 }}>Request #{req.id.slice(-6)}</div>
                        </div>
                        <span style={{
                          padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                          background: isAccepted ? 'var(--success-soft)' : 'var(--primary-fixed)',
                          color: isAccepted ? 'var(--success)' : 'var(--primary)',
                          flexShrink: 0, marginLeft: 12,
                        }}>
                          {isAccepted ? '✓ ACCEPTED' : 'PENDING'}
                        </span>
                      </div>
                      {donationsMap[req.donationId]?.quantity && (
                        <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', marginBottom: 8 }}>
                          <strong>Qty:</strong> {donationsMap[req.donationId].quantity}
                        </div>
                      )}
                      <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        <span><strong>Your name:</strong> {req.requesterName}</span>
                        <span><strong>Phone:</strong> {req.phone}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--outline)', marginTop: 8 }}>
                        Submitted: {new Date(req.timestamp).toLocaleString()}
                      </div>
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
        @keyframes mapSpin { to { transform: rotate(360deg); } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
      `}</style>
    </div>
  );
}
