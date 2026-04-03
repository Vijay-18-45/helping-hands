import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';
import LocationViewer from '../components/LocationViewer';
import DualLocationMap from '../components/DualLocationMap';

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

interface Request {
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

interface RequestWithDonation extends Request {
  donation?: Donation;
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

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, addToast, dismissToast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [requests, setRequests] = useState<RequestWithDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'available' | 'requested'>('available');
  const [allDonationsMap, setAllDonationsMap] = useState<Record<string, Donation>>({});
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  useEffect(() => {
    const donationsRef = ref(rtdb, 'donations');
    const unsub = onValue(donationsRef, snap => {
      if (snap.exists()) {
        const data = snap.val();
        const map: Record<string, Donation> = {};
        const list: Donation[] = Object.entries(data).map(([id, val]) => {
          const d = { id, ...(val as Omit<Donation, 'id'>) };
          map[id] = d;
          return d;
        });
        list.sort((a, b) => b.timestamp - a.timestamp);
        setAllDonationsMap(map);
        setDonations(list.filter(d => d.status === 'available'));
      } else {
        setDonations([]);
        setAllDonationsMap({});
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
    const requestsRef = ref(rtdb, 'requests');
    const unsub = onValue(requestsRef, snap => {
      if (!snap.exists()) { setRequests([]); return; }
      const data = snap.val();
      const list: RequestWithDonation[] = Object.entries(data)
        .map(([id, val]) => ({ id, ...(val as Omit<Request, 'id'>), donation: allDonationsMap[(val as any).donationId] }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setRequests(list);
    });
    return () => unsub();
  }, [allDonationsMap]);

  const handleAccept = async (req: RequestWithDonation) => {
    if (acceptingId) return;
    setAcceptingId(req.id);
    try {
      await update(ref(rtdb, `requests/${req.id}`), {
        status: 'accepted',
        volunteerName: user?.email?.split('@')[0] ?? 'Volunteer',
        acceptedAt: Date.now(),
      });
      addToast(`Request accepted! You'll pick up "${req.donation?.title ?? 'the donation'}" for ${req.requesterName}.`, 'success');
    } catch {
      addToast('Failed to accept request. Please try again.', 'error');
    } finally {
      setAcceptingId(null);
    }
  };

  const availableDonations = donations;
  const requestedItems = requests;
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="dashboard-layout">
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--grad-primary)', display: 'inline-block', boxShadow: '0 2px 8px rgba(0,82,204,0.3)' }} />
          Helping Hands
        </Link>

        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--success-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)', fontWeight: 800, fontSize: '1.125rem' }}>
              {user?.email?.[0]?.toUpperCase() ?? 'V'}
            </div>
            <div>
              <div className="user-name">{user?.email?.split('@')[0] ?? 'Volunteer'}</div>
              <div className="user-role">Volunteer</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--success-soft)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            Available for tasks
          </div>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => setActiveSection('available')} className={`sidebar-link${activeSection === 'available' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}>
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg></span>
            Available Donations
          </button>
          <button onClick={() => setActiveSection('requested')} className={`sidebar-link${activeSection === 'requested' ? ' active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', position: 'relative' }}>
            <span className="icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg></span>
            Requested Items
            {pendingCount > 0 && (
              <span style={{ marginLeft: 'auto', background: 'var(--accent)', color: 'white', borderRadius: 99, fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', minWidth: 20, textAlign: 'center' }}>
                {pendingCount}
              </span>
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
        <header style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>
                Welcome back, <strong>{user?.email?.split('@')[0]}</strong>
              </p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Volunteer Dashboard</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {[
              { label: 'Available Donations', value: availableDonations.length, color: 'var(--primary)', iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
              { label: 'Pending Requests', value: pendingCount, color: 'var(--accent)', iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
              { label: 'Accepted', value: requests.filter(r => r.status === 'accepted').length, color: 'var(--success)', iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: 24 }}>
                <span style={{ width: 44, height: 44, background: `${s.color}15`, borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 12 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d={s.iconPath}/></svg>
                </span>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'Manrope' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </header>

        {activeSection === 'available' ? (
          <section id="donations">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              Available Donations
            </h2>

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16, color: 'var(--on-surface-variant)' }}>
                <span style={{ width: 36, height: 36, border: '3px solid var(--primary-fixed)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Loading donations...
              </div>
            ) : availableDonations.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
                <div style={{ width: 72, height: 72, background: 'var(--surface-container-low)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--on-surface-variant)' }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No donations available</div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>No donors have submitted food donations yet. Check back soon!</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                {availableDonations.map(donation => {
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
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
                          <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--on-surface-variant)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                              Donor Location
                            </div>
                            <LocationViewer location={donation.location} markerColor="green" height={160} />
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${donation.location.lat},${donation.location.lng}`}
                              target="_blank" rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '0.875rem' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
                              Get Directions
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        ) : (
          <section id="requested">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              Requested Items
              {pendingCount > 0 && (
                <span style={{ background: 'var(--accent)', color: 'white', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px' }}>
                  {pendingCount} pending
                </span>
              )}
            </h2>

            {requestedItems.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
                <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No requests yet</div>
                <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>Requestors haven't submitted any requests yet.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {requestedItems.map(req => {
                  const isAccepted = req.status === 'accepted';
                  const isPending = req.status === 'pending';
                  return (
                    <div key={req.id} className="card" style={{ borderLeft: `4px solid ${isAccepted ? 'var(--success)' : 'var(--primary)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>
                          {req.donation?.title ?? 'Donation #' + req.donationId.slice(-6)}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, marginLeft: 12 }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 700,
                            background: isAccepted ? 'var(--success-soft)' : 'var(--primary-fixed)',
                            color: isAccepted ? 'var(--success)' : 'var(--primary)',
                          }}>
                            {isAccepted ? '✓ ACCEPTED' : (req.status ?? 'pending').toUpperCase()}
                          </span>
                          {isPending && (
                            <button
                              onClick={() => handleAccept(req)}
                              disabled={acceptingId === req.id}
                              style={{
                                padding: '6px 16px', borderRadius: 99, border: 'none',
                                background: 'var(--success)', color: 'white',
                                fontWeight: 700, fontSize: '0.8125rem', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: 6,
                                opacity: acceptingId === req.id ? 0.7 : 1,
                                boxShadow: '0 2px 8px rgba(0,166,90,0.35)',
                              }}
                            >
                              {acceptingId === req.id ? (
                                <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Accepting...</>
                              ) : (
                                <><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>Accept</>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {isAccepted && req.volunteerName && (
                        <div style={{ padding: '12px 16px', background: 'var(--success-soft)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: '0.875rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                          Accepted by <strong>{req.volunteerName}</strong> on {req.acceptedAt ? new Date(req.acceptedAt).toLocaleString() : '—'}
                        </div>
                      )}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Food Details</div>
                          {req.donation && (
                            <>
                              {req.donation.image && (
                                <img src={req.donation.image} alt={req.donation.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 10 }} />
                              )}
                              <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <div><strong>Qty:</strong> {req.donation.quantity}</div>
                                {req.donation.description && <div style={{ color: 'var(--on-surface-variant)' }}>{req.donation.description}</div>}
                              </div>
                            </>
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Requestor Details</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.9375rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                              <span><strong>{req.requesterName}</strong></span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                              <a href={`tel:${req.phone}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>{req.phone}</a>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--outline)', display: 'flex', alignItems: 'center', gap: 6 }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                              {new Date(req.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      {req.donation?.location && req.location ? (
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Route Map</div>
                          <DualLocationMap donorLocation={req.donation.location} requestorLocation={req.location} height={260} />
                          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                            <a
                              href={`https://www.google.com/maps/dir/${req.donation.location.lat},${req.donation.location.lng}/${req.location.lat},${req.location.lng}`}
                              target="_blank" rel="noopener noreferrer"
                              className="btn btn-primary"
                              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', flex: 1, justifyContent: 'center' }}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21.71 11.29l-9-9a1 1 0 0 0-1.42 0l-9 9a1 1 0 0 0 0 1.42l9 9a1 1 0 0 0 1.42 0l9-9a1 1 0 0 0 0-1.42zM14 14.5V12h-4v3H8v-4a1 1 0 0 1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>
                              Full Route
                            </a>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${req.location.lat},${req.location.lng}`}
                              target="_blank" rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', flex: 1, justifyContent: 'center' }}
                            >
                              Navigate to Requestor
                            </a>
                          </div>
                        </div>
                      ) : req.donation?.location ? (
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--on-surface-variant)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Donor Location</div>
                          <LocationViewer location={req.donation.location} markerColor="green" height={200} />
                          <a
                            href={`https://www.google.com/maps/dir/?api=1&destination=${req.donation.location.lat},${req.donation.location.lng}`}
                            target="_blank" rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', fontSize: '0.875rem' }}
                          >
                            Get Directions to Donor
                          </a>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes mapSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
