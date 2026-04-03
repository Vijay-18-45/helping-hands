import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import { logoutUser } from '../authService';

const navItems = [
  { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', label: 'Dashboard', href: '/donor/dashboard' },
  { iconPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', label: 'My Donations', href: '#donations' },
  { iconPath: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z', label: 'Impact Reports', href: '#impact' },
  { iconPath: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', label: 'Achievements', href: '#achievements' },
  { iconPath: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', label: 'Settings', href: '#settings' },
];

const recentDonations = [
  {
    id: 1, title: 'Cooked Meals (50 plates)',
    desc: '50 nutritious hot meals prepared for the Downtown community kitchen.',
    date: 'Mar 28, 2024', tag: 'Verified',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=200&q=80',
  },
  {
    id: 2, title: 'Winter Sweaters (10 items)',
    desc: 'Assorted high-quality wool sweaters for the Uptown shelter drive.',
    date: 'Mar 22, 2024', tag: 'Verified',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=200&q=80',
  },
];

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [impactGoal, setImpactGoal] = useState('');
  const [donationTitle, setDonationTitle] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    setFiles(Array.from(e.dataTransfer.files));
  };

  const handleAddDonation = () => {
    if (!donationTitle) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setDonationTitle(''); setFiles([]); setImpactGoal('');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link to="/" className="sidebar-brand">
          <span style={{ 
            width: 10, height: 10, borderRadius: '50%', 
            background: 'var(--grad-primary)', display: 'inline-block',
            boxShadow: '0 2px 8px rgba(0,82,204,0.3)',
          }} />
          Helping Hands
        </Link>
        
        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" 
              alt="User"
              style={{ 
                width: 44, height: 44, borderRadius: 'var(--radius-md)', 
                objectFit: 'cover', border: '2px solid var(--primary-fixed)',
              }}
            />
            <div>
              <div className="user-name">Alex Johnson</div>
              <div className="user-role">Gold Donor</div>
            </div>
          </div>
          <div style={{ 
            marginTop: '16px', padding: '12px 14px', 
            background: 'var(--primary-fixed)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--primary)', fontWeight: 600 }}>Gold Donor</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
              <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
            </svg>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className={`sidebar-link ${item.href === '/donor/dashboard' ? 'active' : ''}`}>
              <span className="icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.iconPath}/>
                </svg>
              </span>
              {item.label}
            </a>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          <a href="#" className="sidebar-link">
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </span> Help Center
          </a>
          <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: 'var(--accent)' }}>
            <span className="icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-content">
        <header style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Welcome back, Alex</p>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Donor Dashboard</h1>
            </div>
            <Link to="/" className="btn btn-secondary btn-sm">Back to Home</Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '32px' }}>
            {[
              { label: 'Total Donated', value: '$1,240', iconPath: 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z', color: 'var(--success)', trend: '+$320 this month' },
              { label: 'Meals Provided', value: '230', iconPath: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z', color: 'var(--primary)', trend: '+48 this week' },
              { label: 'Items Donated', value: '47', iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z', color: 'var(--warning)', trend: '+12 items' },
              { label: 'Impact Rank', value: '#12', iconPath: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', color: 'var(--accent)', trend: 'Top 5%' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <span style={{ 
                    width: 48, height: 48, 
                    background: `${s.color}15`, 
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color,
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d={s.iconPath}/>
                    </svg>
                  </span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: s.color, marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '8px' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>{s.trend}</div>
              </div>
            ))}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '28px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Add Donation */}
            <section id="donations">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
                Log New Donation
              </h2>
              <div className="card">
                {submitted && (
                  <div style={{ 
                    padding: '16px 20px', background: 'var(--success-soft)', 
                    borderRadius: 'var(--radius-lg)', color: 'var(--success)', 
                    fontSize: '0.9375rem', fontWeight: 600, marginBottom: '24px', 
                    display: 'flex', alignItems: 'center', gap: '10px',
                    border: '1px solid rgba(0,135,90,0.2)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                    Donation logged successfully! Thank you for your contribution.
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" htmlFor="don-title">What are you donating?</label>
                  <input id="don-title" className="form-input" placeholder="e.g., Cooked Meals (50 plates), Groceries, Clothing"
                    value={donationTitle} onChange={e => setDonationTitle(e.target.value)} />
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: `2px dashed ${dragging ? 'var(--primary)' : 'var(--outline-variant)'}`,
                    borderRadius: 'var(--radius-xl)',
                    padding: '40px', textAlign: 'center',
                    background: dragging ? 'var(--primary-fixed)' : 'var(--surface-container-low)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    marginBottom: '20px',
                  }}>
                  <div style={{ 
                    width: 64, height: 64, borderRadius: '50%',
                    background: 'var(--surface-container-lowest)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: 'var(--shadow-sm)',
                    color: 'var(--primary)',
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '6px' }}>
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Upload photos of your donation'}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                    Drag & drop or click to browse • PNG, JPG up to 10MB
                  </div>
                  <input ref={fileRef} type="file" multiple accept="image/*" style={{ display: 'none' }}
                    onChange={e => setFiles(Array.from(e.target.files ?? []))} />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label" htmlFor="impact-goal">Impact Note (optional)</label>
                  <input id="impact-goal" className="form-input" placeholder="e.g., Hoping to feed 50 families this month"
                    value={impactGoal} onChange={e => setImpactGoal(e.target.value)} />
                </div>

                <button className="btn btn-primary btn-lg" onClick={handleAddDonation} disabled={!donationTitle}
                  style={{ width: '100%', opacity: donationTitle ? 1 : 0.5 }}>
                  Log Donation
                </button>
              </div>
            </section>

            {/* Recent Activity */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)">
                  <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                Recent Donations
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {recentDonations.map(d => (
                  <div key={d.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', padding: '20px' }}>
                    <img src={d.image} alt="" style={{ width: 100, height: 100, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem' }}>{d.title}</div>
                        <span className="chip chip-success">{d.tag}</span>
                      </div>
                      <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '10px' }}>{d.desc}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--outline)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                        </svg>
                        {d.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Goal Progress */}
            <div className="card" style={{ background: 'var(--grad-primary)', color: '#fff' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', fontFamily: 'Manrope, sans-serif', opacity: 0.9 }}>Monthly Goal</div>
              <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>80%</h3>
              <p style={{ fontSize: '0.9375rem', opacity: 0.85, marginBottom: '20px' }}>
                Just 5 more families to reach your monthly milestone!
              </p>
              <div className="progress-track" style={{ height: 12, background: 'rgba(255,255,255,0.2)' }}>
                <div style={{ height: '100%', width: '80%', borderRadius: '99px', background: '#fff' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '0.8125rem', opacity: 0.8 }}>
                <span>40 families helped</span>
                <span>Goal: 50 families</span>
              </div>
            </div>

            {/* Community impact */}
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: '20px', fontFamily: 'Manrope, sans-serif' }}>Your Impact Summary</div>
              {[
                { iconPath: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z', label: 'Meals Provided', value: '230 plates' },
                { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z', label: 'Items Donated', value: '47 items' },
                { iconPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', label: 'Families Helped', value: '40 families' },
                { iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', label: 'Areas Covered', value: '6 districts' },
              ].map(({ iconPath, label, value }) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--outline-variant)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9375rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--on-surface-variant)">
                      <path d={iconPath}/>
                    </svg>
                    {label}
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.9375rem' }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="card" style={{ textAlign: 'center', padding: '32px' }}>
              <div style={{ 
                width: 80, height: 80, borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
                color: 'white',
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                </svg>
              </div>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', marginBottom: '6px', fontFamily: 'Manrope' }}>Community Champion</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Ranked #12 among all donors this month</div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                {[
                  'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z',
                  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
                  'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
                ].map((path, i) => (
                  <span key={i} style={{ 
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--surface-container-low)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: ['#f59e0b', '#0052cc', '#ff5630'][i],
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={path}/>
                    </svg>
                  </span>
                ))}
              </div>
            </div>

            {/* Impact image */}
            <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80" 
                alt="Impact"
                style={{ width: '100%', height: 180, objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(23,43,77,0.8), transparent)',
                display: 'flex', alignItems: 'flex-end', padding: '20px',
              }}>
                <div style={{ color: '#fff' }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px' }}>See Your Impact</div>
                  <div style={{ fontSize: '0.8125rem', opacity: 0.85 }}>View photos from recent distributions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
