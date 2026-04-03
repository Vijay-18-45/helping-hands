import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const serviceCategories = [
  { 
    iconPath: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z', 
    title: 'Food Service', 
    desc: 'Prepare and serve meals at community kitchens and shelter drives.',
    roles: ['Meal Prep', 'Distribution', 'Kitchen Support'],
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
    volunteers: 340,
  },
  { 
    iconPath: 'M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z', 
    title: 'Education & Mentoring', 
    desc: 'Guide underprivileged youth through tutoring and career programs.',
    roles: ['Tutoring', 'Career Guidance', 'Digital Literacy'],
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    volunteers: 185,
  },
  { 
    iconPath: 'M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 2.12 13.38 1 12 1S9.5 2.12 9.5 3.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z', 
    title: 'Environmental Action', 
    desc: 'Join cleanup drives, tree plantation, and sustainability campaigns.',
    roles: ['Cleanup Drives', 'Tree Plantation', 'Awareness'],
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&q=80',
    volunteers: 220,
  },
  { 
    iconPath: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z', 
    title: 'Healthcare Support', 
    desc: 'Assist medical camps and provide support to health workers.',
    roles: ['Camp Assistance', 'Logistics', 'Record Keeping'],
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80',
    volunteers: 95,
  },
];

const impactStats = [
  { value: '15,000+', label: 'Meals Served Monthly', iconPath: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z' },
  { value: '2,400+', label: 'Active Volunteers', iconPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
  { value: '50+', label: 'Partner NGOs', iconPath: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z' },
  { value: '12', label: 'Cities Covered', iconPath: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Fill out a quick 3-step form with your details, availability, and skills.' },
  { num: '02', title: 'Get Matched', desc: 'Our engine matches you with tasks that fit your passions and schedule.' },
  { num: '03', title: 'Serve & Track', desc: 'Show up, make an impact, and track your contributions on your dashboard.' },
];

export default function ServeToSociety() {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '72px' }}>

        {/* Hero */}
        <section style={{
          position: 'relative', overflow: 'hidden',
          minHeight: '80vh', display: 'flex', alignItems: 'center',
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
          }}>
            <img 
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80" 
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(0,82,204,0.9) 0%, rgba(38,132,255,0.85) 100%)',
            }} />
          </div>

          <div className="container section" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 720 }}>
              <div className="chip animate-fade-up" style={{ 
                background: 'rgba(255,255,255,0.15)', color: '#fff', 
                marginBottom: '28px', backdropFilter: 'blur(10px)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', marginRight: 8 }} />
                2,400+ volunteers active this week
              </div>
              
              <h1 className="animate-fade-up" style={{ 
                color: '#fff', marginBottom: '24px',
                animationDelay: '0.1s',
              }}>
                Serve your community.<br />
                <span style={{ opacity: 0.9 }}>Transform lives together.</span>
              </h1>
              
              <p className="animate-fade-up" style={{ 
                fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)', 
                lineHeight: 1.7, marginBottom: '40px', maxWidth: 560,
                animationDelay: '0.2s',
              }}>
                Join us in making a difference. Your hands can heal, your heart can hold, 
                and your actions can transform the narrative of a community in need.
              </p>
              
              <div className="animate-fade-up" style={{ 
                display: 'flex', gap: '16px', flexWrap: 'wrap',
                animationDelay: '0.3s',
              }}>
                <Link to="/volunteer/register" className="btn btn-lg" style={{ 
                  background: '#fff', color: 'var(--primary)', fontWeight: 700,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                }}>
                  Register as Volunteer
                </Link>
                <Link to="/volunteer/login" className="btn btn-lg" style={{ 
                  background: 'rgba(255,255,255,0.1)', color: '#fff', 
                  border: '1px solid rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(10px)',
                }}>
                  Already Registered? Sign In
                </Link>
              </div>

              {/* Quick stats */}
              <div className="animate-fade-up" style={{ 
                display: 'flex', gap: '40px', marginTop: '56px',
                animationDelay: '0.4s',
              }}>
                {[
                  { value: '15K+', label: 'Meals This Month' },
                  { value: '98%', label: 'Satisfaction Rate' },
                  { value: '4.9', label: 'Volunteer Rating' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', fontFamily: 'Manrope' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating image card */}
          <div className="animate-slide-left" style={{
            position: 'absolute', right: 80, top: '50%', transform: 'translateY(-50%)',
            display: 'none', // Hide on smaller screens, show on large
          }}>
            {/* This would be visible on extra large screens */}
          </div>
        </section>

        {/* Impact Stats */}
        <section style={{ 
          background: 'var(--surface-container-lowest)', 
          padding: '0',
          marginTop: '-60px',
          position: 'relative', zIndex: 2,
        }}>
          <div className="container" style={{ padding: '0 48px' }}>
            <div className="card-elevated" style={{ 
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '32px', padding: '40px 48px',
            }}>
              {impactStats.map((stat, idx) => (
                <div key={stat.label} className="animate-fade-up" style={{ 
                  textAlign: 'center',
                  animationDelay: `${idx * 0.1}s`,
                }}>
                  <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="var(--primary)">
                      <path d={stat.iconPath}/>
                    </svg>
                  </div>
                  <div style={{ 
                    fontSize: '2rem', fontWeight: 800, 
                    fontFamily: 'Manrope', color: 'var(--primary)',
                    marginBottom: '4px',
                  }}>{stat.value}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="section">
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: 640, margin: '0 auto 64px' }}>
              <div className="chip" style={{ marginBottom: '20px' }}>Volunteer Opportunities</div>
              <h2 style={{ marginBottom: '20px' }}>
                Find your way to <span className="text-gradient">make an impact</span>
              </h2>
              <p style={{ fontSize: '1.125rem', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>
                Choose from various service categories based on your skills, interests, and availability. 
                Every contribution matters.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px' }}>
              {serviceCategories.map((cat, idx) => (
                <div key={cat.title} className="card animate-fade-up" style={{ 
                  display: 'flex', gap: '24px', padding: '0', overflow: 'hidden',
                  animationDelay: `${idx * 0.1}s`,
                }}>
                  {/* Image */}
                  <div style={{ width: 200, flexShrink: 0, position: 'relative' }}>
                    <img src={cat.image} alt={cat.title} style={{ 
                      width: '100%', height: '100%', objectFit: 'cover',
                      minHeight: 220,
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 12, left: 12,
                      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                      padding: '6px 12px', borderRadius: '99px',
                      color: 'white', fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {cat.volunteers}+ volunteers
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div style={{ padding: '24px 24px 24px 0', flex: 1 }}>
                    <div style={{ marginBottom: '8px' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--primary)">
                        <path d={cat.iconPath}/>
                      </svg>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>{cat.title}</h3>
                    <p style={{ 
                      fontSize: '0.9375rem', color: 'var(--on-surface-variant)', 
                      lineHeight: 1.6, marginBottom: '16px',
                    }}>{cat.desc}</p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {cat.roles.map(role => (
                        <span key={role} className="chip chip-outline" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                          {role}
                        </span>
                      ))}
                    </div>
                    
                    <Link to="/volunteer/register" className="btn btn-secondary btn-sm">
                      Join This Program
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="section" style={{ background: 'var(--surface-container-low)' }}>
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              <div>
                <div className="chip" style={{ marginBottom: '20px' }}>How It Works</div>
                <h2 style={{ marginBottom: '24px' }}>
                  Start volunteering in <span className="text-gradient">3 simple steps</span>
                </h2>
                <p style={{ 
                  color: 'var(--on-surface-variant)', lineHeight: 1.8, 
                  marginBottom: '40px', fontSize: '1.0625rem',
                }}>
                  Our platform simplifies the complexities of volunteering. Whether you have two hours a week 
                  or two weeks a year, we find the perfect outlet for your passion.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {steps.map((step, idx) => (
                    <div key={step.num} className="animate-fade-up" style={{ 
                      display: 'flex', gap: '20px',
                      animationDelay: `${idx * 0.1}s`,
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                        background: 'var(--grad-primary)', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1.125rem', fontFamily: 'Manrope',
                        flexShrink: 0, boxShadow: '0 4px 14px rgba(0,82,204,0.3)',
                      }}>{step.num}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '4px' }}>{step.title}</div>
                        <div style={{ fontSize: '0.9375rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/volunteer/register" className="btn btn-primary btn-lg" style={{ marginTop: '40px' }}>
                  Start Your Application
                </Link>
              </div>

              {/* Image collage */}
              <div style={{ position: 'relative' }}>
                <div style={{ 
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px',
                }}>
                  <img 
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&q=80" 
                    alt="Volunteers serving food"
                    className="animate-fade-up"
                    style={{ 
                      width: '100%', height: 240, objectFit: 'cover', 
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-lg)',
                    }} 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80" 
                    alt="Community gathering"
                    className="animate-fade-up delay-100"
                    style={{ 
                      width: '100%', height: 240, objectFit: 'cover', 
                      borderRadius: 'var(--radius-xl)', marginTop: 40,
                      boxShadow: 'var(--shadow-lg)',
                    }} 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&q=80" 
                    alt="Food donation"
                    className="animate-fade-up delay-200"
                    style={{ 
                      width: '100%', height: 200, objectFit: 'cover', 
                      borderRadius: 'var(--radius-xl)', marginTop: -20,
                      boxShadow: 'var(--shadow-lg)',
                    }} 
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=400&q=80" 
                    alt="Team volunteering"
                    className="animate-fade-up delay-300"
                    style={{ 
                      width: '100%', height: 200, objectFit: 'cover', 
                      borderRadius: 'var(--radius-xl)', marginTop: 20,
                      boxShadow: 'var(--shadow-lg)',
                    }} 
                  />
                </div>

                {/* Quote card */}
                <div className="card-glass animate-scale-in" style={{
                  position: 'absolute', bottom: -30, left: -30,
                  padding: '24px', maxWidth: 320,
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)" style={{ marginBottom: '12px', opacity: 0.5 }}>
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                  </svg>
                  <p style={{ 
                    fontSize: '0.9375rem', fontStyle: 'italic', 
                    color: 'var(--on-surface)', lineHeight: 1.6, marginBottom: '12px',
                  }}>
                    The best way to find yourself is to lose yourself in the service of others.
                  </p>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                    — Mahatma Gandhi
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ 
          background: 'var(--grad-dark)', 
          padding: '100px 48px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', right: '10%',
            transform: 'translateY(-50%)',
            width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(38,132,255,0.2) 0%, transparent 60%)',
          }} />
          
          <div className="container" style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center',
            position: 'relative', zIndex: 1,
          }}>
            <div>
              <h2 style={{ color: '#fff', marginBottom: '20px' }}>
                Ready to become a community hero?
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', 
                lineHeight: 1.7, marginBottom: '32px',
              }}>
                Step into a role that matters. We match your unique skills with the communities 
                that need them most — from food service to healthcare support.
              </p>
              <Link to="/volunteer/register" className="btn btn-lg" style={{ 
                background: '#fff', color: 'var(--primary)', fontWeight: 700,
              }}>
                Start Your Application
              </Link>
            </div>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { iconPath: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z', title: 'Verified Organizations', desc: 'All partner NGOs are thoroughly vetted' },
                { iconPath: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z', title: 'Track Your Impact', desc: 'See real-time stats on your contributions' },
                { iconPath: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z', title: 'Earn Certificates', desc: 'Get recognized for your service hours' },
                { iconPath: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z', title: 'Join a Community', desc: 'Connect with like-minded volunteers' },
              ].map(item => (
                <div key={item.title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '16px',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  padding: '20px', borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white" style={{ flexShrink: 0, marginTop: 2 }}>
                    <path d={item.iconPath}/>
                  </svg>
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
