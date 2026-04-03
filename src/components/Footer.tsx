import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--surface-container-lowest)',
      borderTop: '1px solid rgba(23,43,77,0.06)',
      padding: '80px 48px 40px',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr', gap: '48px', marginBottom: '64px' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{
              fontFamily: 'Manrope, sans-serif', fontWeight: 800,
              fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <span style={{
                width: 12, height: 12, borderRadius: '50%',
                background: 'var(--grad-primary)', display: 'inline-block',
                boxShadow: '0 2px 8px rgba(0,82,204,0.3)',
              }} />
              Helping Hands
            </Link>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.9375rem', lineHeight: 1.7, maxWidth: 300, marginTop: '16px' }}>
              Empowering communities through collective action, radical transparency, and technology-driven social impact.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {[
                { name: 'Twitter', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { name: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { name: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map(s => (
                <a key={s.name} href="#" aria-label={s.name} style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-container-low)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--on-surface-variant)',
                  transition: 'all 0.2s',
                  border: '1px solid rgba(23,43,77,0.06)',
                }}
                  onMouseEnter={e => { 
                    (e.currentTarget as HTMLElement).style.background = 'var(--primary)'; 
                    (e.currentTarget as HTMLElement).style.color = '#fff'; 
                  }}
                  onMouseLeave={e => { 
                    (e.currentTarget as HTMLElement).style.background = 'var(--surface-container-low)'; 
                    (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'; 
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path}/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface)', marginBottom: '20px' }}>Platform</div>
            {[
              ['How It Works', '/#how-it-works'],
              ['Volunteer', '/serve'],
              ['Donate', '/donor/login'],
              ['Impact Dashboard', '/donor/dashboard'],
            ].map(([label, href]) => (
              <Link key={label} to={href} style={{ 
                display: 'block', color: 'var(--on-surface-variant)', 
                fontSize: '0.9375rem', marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'}
              >{label}</Link>
            ))}
          </div>

          {/* Resources */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface)', marginBottom: '20px' }}>Resources</div>
            {[
              ['Help Center', '#'],
              ['Blog', '#'],
              ['Community', '#'],
              ['API Docs', '#'],
            ].map(([label, href]) => (
              <Link key={label} to={href} style={{ 
                display: 'block', color: 'var(--on-surface-variant)', 
                fontSize: '0.9375rem', marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'}
              >{label}</Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface)', marginBottom: '20px' }}>Legal</div>
            {[
              ['Privacy Policy', '#'],
              ['Terms of Service', '#'],
              ['Cookie Policy', '#'],
            ].map(([label, href]) => (
              <Link key={label} to={href} style={{ 
                display: 'block', color: 'var(--on-surface-variant)', 
                fontSize: '0.9375rem', marginBottom: '14px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--on-surface-variant)'}
              >{label}</Link>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface)', marginBottom: '20px' }}>Stay Updated</div>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', marginBottom: '16px', lineHeight: 1.6 }}>
              Get monthly impact reports and community stories.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="form-input"
                style={{ 
                  padding: '12px 16px', 
                  fontSize: '0.875rem',
                  flex: 1,
                }}
              />
              <button className="btn btn-primary" style={{ padding: '12px 20px' }}>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: '32px',
          borderTop: '1px solid rgba(23,43,77,0.08)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
            © 2024 Helping Hands. Made for communities worldwide.
          </p>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block',
              animation: 'pulse-ring 2s infinite',
            }} />
            <span style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
