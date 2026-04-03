import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { rtdb } from '../firebaseConfig';
import { logoutUser } from '../authService';
import { useAuth } from '../context/AuthContext';
import { Toast, useToast } from '../components/Toast';

interface Donation {
  id: string;
  donorId: string;
  title: string;
  description: string;
  quantity: string;
  freshness: number;
  image: string;
  timestamp: number;
}

function isFresh(timestamp: number, freshnessHours: number): boolean {
  const expiresAt = timestamp + freshnessHours * 60 * 60 * 1000;
  return Date.now() < expiresAt;
}

function timeRemaining(timestamp: number, freshnessHours: number): string {
  const expiresAt = timestamp + freshnessHours * 60 * 60 * 1000;
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Expired';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m remaining`;
}

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toasts, addToast, dismissToast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  useEffect(() => {
    const donationsRef = ref(rtdb, 'donations');
    const unsub = onValue(donationsRef, snap => {
      if (snap.exists()) {
        const data = snap.val();
        const list: Donation[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<Donation, 'id'>),
        }));
        list.sort((a, b) => b.timestamp - a.timestamp);
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

  const fresh = donations.filter(d => isFresh(d.timestamp, d.freshness));
  const expired = donations.filter(d => !isFresh(d.timestamp, d.freshness));

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
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--success-soft)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'var(--success)', fontWeight: 800, fontSize: '1.125rem',
            }}>
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
          <a href="#donations" className="sidebar-link active">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
            </span>
            Available Donations
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
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Volunteer Dashboard</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
            {[
              { label: 'Total Donations', value: donations.length, color: 'var(--primary)', iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
              { label: 'Fresh Available', value: fresh.length, color: 'var(--success)', iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' },
              { label: 'Expired', value: expired.length, color: 'var(--accent)', iconPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' },
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
          ) : donations.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '72px 48px' }}>
              <div style={{ width: 72, height: 72, background: 'var(--surface-container-low)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--on-surface-variant)' }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: 8 }}>No donations available</div>
              <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>
                No donors have submitted food donations yet. Check back soon!
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {donations.map(donation => {
                const fresh = isFresh(donation.timestamp, donation.freshness);
                const remaining = timeRemaining(donation.timestamp, donation.freshness);
                return (
                  <div key={donation.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                    {donation.image ? (
                      <img
                        src={donation.image} alt={donation.title}
                        style={{ width: '100%', height: 180, objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: 120, background: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                      </div>
                    )}
                    <div style={{ padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, flex: 1 }}>{donation.title}</h3>
                        <span style={{
                          padding: '4px 10px', borderRadius: 99,
                          fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginLeft: 8,
                          background: fresh ? 'var(--success-soft)' : 'var(--accent-soft)',
                          color: fresh ? 'var(--success)' : 'var(--accent)',
                        }}>
                          {fresh ? 'Fresh' : 'Expired'}
                        </span>
                      </div>

                      {donation.description && (
                        <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.5, marginBottom: 12 }}>
                          {donation.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--on-surface-variant)"><path d="M20 8h-2.81c-.45-.78-1.07-1.45-1.82-1.96L17 4.41 15.59 3l-2.17 2.17C12.96 5.06 12.49 5 12 5s-.96.06-1.41.17L8.41 3 7 4.41l1.62 1.63C7.88 6.55 7.26 7.22 6.81 8H4v2h2.09c-.05.33-.09.66-.09 1v1H4v2h2v1c0 .34.04.67.09 1H4v2h2.81c1.04 1.79 2.97 3 5.19 3s4.15-1.21 5.19-3H20v-2h-2.09c.05-.33.09-.66.09-1v-1h2v-2h-2v-1c0-.34-.04-.67-.09-1H20V8zm-6 8h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>
                          <span><strong>Qty:</strong> {donation.quantity}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill={fresh ? 'var(--success)' : 'var(--accent)'}><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                          <span style={{ color: fresh ? 'var(--success)' : 'var(--accent)', fontWeight: 600 }}>
                            {remaining}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--outline)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/></svg>
                          {new Date(donation.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
