import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { logoutUser } from '../authService';

const navItems = [
  { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', label: 'Dashboard', href: '/volunteer/dashboard' },
  { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z', label: 'My Tasks', href: '#tasks' },
  { iconPath: 'M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z', label: 'Pending Requests', href: '#pending' },
  { iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', label: 'Completed', href: '#completed' },
  { iconPath: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z', label: 'My Impact', href: '#impact' },
  { iconPath: 'M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', label: 'Settings', href: '#settings' },
];

const pendingTasks = [
  { id: 1, title: 'Pickup 20 food packets from Sunset Bakery', loc: 'Sunset Bakery, MG Road', urgency: 'Today', type: 'Pickup', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80' },
  { id: 2, title: 'Deliver 5 Blankets to City Shelter', loc: 'City Shelter, Andheri', urgency: 'Tomorrow', type: 'Delivery', image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=100&q=80' },
  { id: 3, title: 'Assist at Saturday Health Camp', loc: 'Community Hall, Kurla', urgency: 'Sat 10am', type: 'Healthcare', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&q=80' },
];

const assignedTasks = [
  {
    id: 1, title: 'Fresh Organic Produce Box',
    tag: 'Quality Assessment Required',
    desc: 'Select freshness level to enable delivery button.',
    steps: ['Receive box from Sunrise Farms', 'Check freshness', 'Deliver before noon'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80',
  },
];

export default function VolunteerDashboard() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState<number[]>([]);
  const [freshness, setFreshness] = useState('');

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const acceptTask = (id: number) => setAccepted(prev => [...prev, id]);

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
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" 
              alt="User"
              style={{ 
                width: 44, height: 44, borderRadius: 'var(--radius-md)', 
                objectFit: 'cover', border: '2px solid var(--primary-fixed)',
              }}
            />
            <div>
              <div className="user-name">Alex Johnson</div>
              <div className="user-role">Active Volunteer</div>
            </div>
          </div>
          <div style={{ 
            marginTop: '16px', padding: '10px 14px', 
            background: 'var(--success-soft)', borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.8125rem', color: 'var(--success)', fontWeight: 600,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
            Available for tasks
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className={`sidebar-link ${item.href === '/volunteer/dashboard' ? 'active' : ''}`}>
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
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Volunteer Dashboard</h1>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-secondary btn-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
                April 2024
              </button>
              <button className="btn btn-primary btn-sm">+ Find Tasks</button>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '32px' }}>
            {[
              { label: 'Tasks Completed', value: '24', iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', color: 'var(--success)', trend: '+3 this week' },
              { label: 'Hours Served', value: '62', iconPath: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z', color: 'var(--primary)', trend: '+8 this week' },
              { label: 'Pending Tasks', value: pendingTasks.length.toString(), iconPath: 'M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z', color: 'var(--warning)', trend: `${pendingTasks.length} awaiting` },
              { label: 'Impact Score', value: '9.2', iconPath: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z', color: 'var(--accent)', trend: 'Top 10%' },
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
                <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', background: 'var(--surface-container-low)', padding: '4px 10px', borderRadius: '99px', display: 'inline-block' }}>{s.trend}</div>
              </div>
            ))}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Pending Requests */}
            <section id="pending">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--warning)">
                    <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"/>
                  </svg>
                  Pending Requests
                </h2>
                <span className="chip chip-warning">{pendingTasks.length} open</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {pendingTasks.map(task => (
                  <div key={task.id} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px' }}>
                    <img src={task.image} alt="" style={{ width: 72, height: 72, borderRadius: 'var(--radius-lg)', objectFit: 'cover', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span className="tag tag-info">{task.type}</span>
                        <span className="tag tag-warning">{task.urgency}</span>
                      </div>
                      <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{task.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        {task.loc}
                      </div>
                    </div>
                    {accepted.includes(task.id) ? (
                      <span className="chip chip-success">Accepted</span>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => acceptTask(task.id)}>Accept Task</button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Assigned Tasks */}
            <section id="tasks">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--primary)">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                  Active Assignment
                </h2>
              </div>

              {assignedTasks.map(task => (
                <div key={task.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                  <div style={{ display: 'flex' }}>
                    <img src={task.image} alt="" style={{ width: 180, objectFit: 'cover' }} />
                    <div style={{ padding: '24px', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '4px' }}>{task.title}</div>
                          <span className="tag tag-warning">{task.tag}</span>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', marginBottom: '20px' }}>{task.desc}</p>

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>Steps to Complete</div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                          {task.steps.map((s, i) => (
                            <div key={i} style={{ 
                              flex: 1, padding: '14px', 
                              background: i === 0 ? 'var(--primary-fixed)' : 'var(--surface-container-low)',
                              borderRadius: 'var(--radius-md)',
                              display: 'flex', alignItems: 'flex-start', gap: '10px',
                            }}>
                              <div style={{
                                width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                                background: i === 0 ? 'var(--primary)' : 'var(--surface-container-high)',
                                color: i === 0 ? '#fff' : 'var(--on-surface-variant)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 700,
                              }}>{i + 1}</div>
                              <span style={{ fontSize: '0.875rem', color: i === 0 ? 'var(--primary)' : 'var(--on-surface-variant)' }}>{s}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--on-surface-variant)' }}>Freshness Assessment</div>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          {['Excellent', 'Good', 'Acceptable', 'Needs Review'].map(f => (
                            <button key={f} type="button" onClick={() => setFreshness(f)}
                              className={freshness === f ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                              style={{ borderRadius: '99px' }}>
                              {f}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button className="btn btn-primary" disabled={!freshness} style={{ opacity: freshness ? 1 : 0.4 }}>
                        Mark as Ready for Delivery
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Urgent Actions */}
            <section>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Quick Actions
              </h3>
              <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'var(--success-soft)', color: 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                </div>
                <div style={{ fontWeight: 700, marginBottom: '6px', fontSize: '1rem' }}>All Caught Up!</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
                  No urgent tasks right now. Check pending requests for more opportunities.
                </div>
              </div>
            </section>

            {/* Monthly Progress */}
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: '20px', fontFamily: 'Manrope, sans-serif' }}>April Progress</div>
              {[
                { label: 'Tasks Completed', pct: 80, color: 'var(--primary)' },
                { label: 'Hours Logged', pct: 62, color: 'var(--success)' },
                { label: 'Communities Served', pct: 45, color: 'var(--warning)' },
              ].map(({ label, pct, color }) => (
                <div key={label} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--on-surface-variant)' }}>{label}</span>
                    <span style={{ fontWeight: 700, color }}>{pct}%</span>
                  </div>
                  <div className="progress-track" style={{ height: 8 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div style={{ fontWeight: 700, marginBottom: '16px', fontFamily: 'Manrope, sans-serif' }}>Recent Activity</div>
              {[
                { iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', text: 'Delivered 15 meals to shelter', time: '2h ago', color: 'var(--success)' },
                { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z', text: 'Picked up donation boxes', time: '5h ago', color: 'var(--primary)' },
                { iconPath: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', text: 'Earned "Helper" badge', time: 'Yesterday', color: 'var(--warning)' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', gap: '12px', 
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px solid var(--outline-variant)' : 'none',
                }}>
                  <span style={{ 
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${item.color}15`, color: item.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={item.iconPath}/>
                    </svg>
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to Home */}
            <Link to="/" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
