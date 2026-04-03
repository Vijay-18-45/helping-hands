import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ScrollReveal, StaggerContainer, ScrollProgressBar } from '../components/ScrollReveal';
import { smoothScrollTo } from '../components/ScrollAnimations';

const stats = [
  { value: '$1.2M+', label: 'Total Donated' },
  { value: '2.4K+',  label: 'Active Volunteers' },
  { value: '15K+',   label: 'Meals Served' },
  { value: '98%',    label: 'Fund Allocation' },
];

const givingCards = [
  {
    title: 'Donate',
    desc: 'Support essential causes through one-time or recurring contributions. Your funds go directly to those in need.',
    features: ['100% Transparency', 'Tax-deductible receipts', 'Real-time tracking'],
    cta: 'Start Donating',
    href: '/donor/login',
    primary: true,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
  },
  {
    title: 'Volunteer',
    desc: 'Offer your time and skills. From local food drives to remote mentoring, there\'s a place for your passion.',
    features: ['Flexible scheduling', 'Skill-based matching', 'Impact certificates'],
    cta: 'Find Opportunities',
    href: '/serve',
    primary: false,
    image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80',
  },
  {
    title: 'Track Impact',
    desc: 'See the real-world results of your generosity with detailed reports and stories from the field.',
    features: ['Live dashboard', 'Photo verification', 'Monthly reports'],
    cta: 'View Dashboard',
    href: '/donor/dashboard',
    primary: false,
    image: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80',
  },
];

const projects = [
  {
    title: 'Community Kitchen Initiative',
    desc: 'Providing 500+ daily meals to families facing food insecurity across 12 locations.',
    progress: 78,
    tag: 'Food Security',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
  },
  {
    title: 'School Nutrition Program',
    desc: 'Ensuring 2,000 children receive nutritious lunches daily to support learning.',
    progress: 62,
    tag: 'Education',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80',
  },
  {
    title: 'Elder Care Food Delivery',
    desc: 'Weekly grocery delivery and meal prep assistance for 200+ senior citizens.',
    progress: 85,
    tag: 'Senior Care',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&q=80',
  },
];

const testimonials = [
  {
    quote: "Helping Hands made volunteering so accessible. I've served over 100 meals in just two months!",
    name: 'Priya Sharma',
    role: 'Weekend Volunteer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
  },
  {
    quote: "The transparency is incredible. I can see exactly where my donations go and the families they help.",
    name: 'Rahul Mehta',
    role: 'Monthly Donor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--background)' }}>
      <ScrollProgressBar />
      <Navbar />

      {/* Hero */}
      <section id="hero" style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        paddingTop: 72,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background elements */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,86,219,0.06) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 60%)',
          pointerEvents: 'none',
        }} />

        <div className="container section" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid">
            {/* Left */}
            <ScrollReveal animation="fade-up" duration={0.8}>
              <div className="chip" style={{ marginBottom: '24px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block', marginRight: 6 }} />
                2,400+ volunteers active this week
              </div>
              <h1 style={{ marginBottom: '24px', color: 'var(--on-surface)' }}>
                Feed communities.
                <br />
                <span className="text-gradient">Transform lives.</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'var(--on-surface-variant)', lineHeight: 1.7, marginBottom: '40px', maxWidth: 520 }}>
                Join the platform that connects donors, volunteers, and communities. Every meal served brings us closer to ending hunger.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
                <Link to="/serve" className="btn btn-primary btn-lg">Start Volunteering</Link>
                <Link to="/donor/login" className="btn btn-secondary btn-lg">Make a Donation</Link>
              </div>
              
              {/* Trust indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex' }}>
                    {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&q=80'
                    ].map((src, i) => (
                      <img key={i} src={src} alt="" style={{
                        width: 36, height: 36, borderRadius: '50%', objectFit: 'cover',
                        border: '2px solid white', marginLeft: i > 0 ? -10 : 0,
                        boxShadow: 'var(--shadow-sm)',
                      }} />
                    ))}
                  </div>
                  <span style={{ marginLeft: 12, fontSize: '0.9375rem', color: 'var(--on-surface-variant)' }}>
                    <strong style={{ color: 'var(--on-surface)' }}>2,400+</strong> volunteers
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[1,2,3,4,5].map(i => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#facc15">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>4.9/5 rating</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Right — Image + Stats */}
            <ScrollReveal animation="scale" delay={0.2}>
              {/* Main hero image */}
              <div style={{
                borderRadius: 'var(--radius-2xl)',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80" 
                  alt="Volunteers serving food"
                  style={{ width: '100%', height: 480, objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(17,24,39,0.4), transparent 50%)',
                }} />
              </div>

              {/* Floating stats card */}
              <ScrollReveal animation="fade-right" delay={0.4} className="hero-float-card" style={{
                position: 'absolute', bottom: -40, left: -40,
              }}>
                <div className="card-glass" style={{
                  padding: '24px', width: 280,
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--on-surface-variant)', marginBottom: '16px' }}>
                    This Month's Impact
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {stats.slice(0, 4).map(s => (
                      <div key={s.label}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Manrope, sans-serif', color: 'var(--primary)' }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Live indicator */}
              <ScrollReveal animation="fade-left" delay={0.5} className="hero-float-card" style={{
                position: 'absolute', top: 20, right: -20,
              }}>
                <div className="card" style={{
                  padding: '14px 20px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', background: 'var(--success)',
                    animation: 'pulse-ring 2s infinite',
                  }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>142 active deliveries</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Happening right now</div>
                </div>
              </div>
              </ScrollReveal>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section style={{ 
        background: 'var(--surface-container-low)', 
        padding: '48px 0',
        borderTop: '1px solid rgba(17,24,39,0.04)',
        borderBottom: '1px solid rgba(17,24,39,0.04)',
      }}>
        <div className="container" style={{ padding: '0 48px' }}>
          <ScrollReveal animation="fade">
            <div className="trusted-by-row">
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Trusted by leading organizations
              </span>
              <div className="trusted-by-logos">
                {['UNICEF', 'Red Cross', 'WHO', 'World Food', 'Care India'].map(org => (
                  <span key={org} style={{ 
                    fontFamily: 'Manrope, sans-serif', 
                    fontWeight: 700, 
                    fontSize: '1.125rem', 
                    color: 'var(--outline)',
                    opacity: 0.6,
                  }}>{org}</span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How You Can Help */}
      <section id="giving" className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '72px', maxWidth: 640, margin: '0 auto 72px' }}>
              <div className="chip" style={{ marginBottom: '20px' }}>How It Works</div>
              <h2 style={{ marginBottom: '20px' }}>
                Choose how you want to <span className="text-gradient">make an impact</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>
                Whether you donate, volunteer, or spread awareness — every action creates ripples of change in communities worldwide.
              </p>
            </div>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.15} className="giving-grid">
            {givingCards.map((card) => (
              <div key={card.title}>
                <div className="card" style={{
                  display: 'flex', flexDirection: 'column', height: '100%',
                  border: card.primary ? '2px solid var(--primary-fixed)' : '1px solid rgba(17,24,39,0.04)',
                  position: 'relative', overflow: 'hidden',
                  padding: 0,
                }}>
                  {card.primary && (
                    <div style={{
                      position: 'absolute', top: 16, right: 16, zIndex: 2,
                      background: 'var(--grad-primary)', color: 'white',
                      padding: '4px 12px', borderRadius: '99px',
                      fontSize: '0.75rem', fontWeight: 600,
                    }}>Most Popular</div>
                  )}
                  
                  {/* Card image */}
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                    <img src={card.image} alt={card.title} style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(23,43,77,0.3), transparent)',
                    }} />
                  </div>

                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.375rem', fontWeight: 700, marginBottom: '12px' }}>{card.title}</h3>
                    <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, fontSize: '0.9375rem', marginBottom: '20px' }}>{card.desc}</p>
                    
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                      {card.features.map(f => (
                        <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>
                          <span style={{ 
                            width: 20, height: 20, borderRadius: '50%',
                            background: 'var(--success-soft)', color: 'var(--success)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.7rem', fontWeight: 700,
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                          </span> {f}
                        </li>
                      ))}
                    </ul>
                    
                    <Link to={card.href} className={`btn ${card.primary ? 'btn-primary' : 'btn-secondary'}`} style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}>
                      {card.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Impact Projects */}
      <section className="section" style={{ background: 'var(--surface-container-low)' }} id="impact">
        <div className="container">
          <div className="impact-grid">
            <ScrollReveal animation="fade-right">
              <div className="chip" style={{ marginBottom: '20px' }}>Live Projects</div>
              <h2 style={{ marginBottom: '24px' }}>
                Real-time impact tracking with <span className="text-gradient">full transparency</span>
              </h2>
              <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.8, fontSize: '1.0625rem', marginBottom: '32px' }}>
                Every donation, every volunteer hour, every meal served — tracked and reported in real time. 
                We believe trust is built through radical openness.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {[
                  { icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z', text: 'GPS-verified delivery tracking' },
                  { icon: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z', text: 'Photo documentation of every distribution' },
                  { icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', text: 'Monthly detailed impact reports' },
                ].map(item => (
                  <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ 
                      width: 44, height: 44,
                      background: 'var(--surface-container-lowest)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--primary)',
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d={item.icon}/>
                      </svg>
                    </span>
                    <span style={{ fontSize: '1rem', color: 'var(--on-surface)' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              <Link to="/donor/dashboard" className="btn btn-primary">
                View Live Dashboard
              </Link>
            </ScrollReveal>

            <StaggerContainer staggerDelay={0.12} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {projects.map((p) => (
                <div key={p.title} className="card" style={{ 
                  display: 'flex', gap: '20px', padding: '20px',
                }}>
                  <img src={p.image} alt={p.title} style={{
                    width: 100, height: 100, borderRadius: 'var(--radius-lg)',
                    objectFit: 'cover', flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h4 style={{ fontWeight: 700, fontSize: '1rem' }}>{p.title}</h4>
                      <span className="chip" style={{ fontSize: '0.6875rem', padding: '4px 10px' }}>{p.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '12px' }}>{p.desc}</p>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8125rem' }}>
                        <span style={{ color: 'var(--on-surface-variant)' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.progress}%</span>
                      </div>
                      <div className="progress-track" style={{ height: 8 }}>
                        <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <ScrollReveal animation="fade-up">
            <div style={{ textAlign: 'center', marginBottom: '64px' }}>
              <div className="chip" style={{ marginBottom: '20px' }}>Community Stories</div>
              <h2>Hear from our <span className="text-gradient">volunteers & donors</span></h2>
            </div>
          </ScrollReveal>

          <StaggerContainer staggerDelay={0.15} className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.name} className="card" style={{ 
                padding: '32px',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginBottom: '16px', opacity: 0.3 }}>
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
                <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--on-surface)', marginBottom: '24px' }}>
                  {t.quote}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={t.avatar} alt={t.name} style={{
                    width: 48, height: 48, borderRadius: '50%', objectFit: 'cover',
                  }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Banner */}
      <ScrollReveal animation="fade-up">
        <section className="cta-section">
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(38,132,255,0.15) 0%, transparent 60%)',
          }} />
          
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="chip" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', marginBottom: '24px' }}>
              Join 2,400+ volunteers
            </div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px', color: 'white' }}>
              Ready to make a difference?
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '40px', maxWidth: 560, margin: '0 auto 40px' }}>
              Every meal served is a step towards ending hunger. Start your journey of giving today.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/serve" className="btn btn-lg" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }}>
                Become a Volunteer
              </Link>
              <Link to="/donor/login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
                Start Donating
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
}
