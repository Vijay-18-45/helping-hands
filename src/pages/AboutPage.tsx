import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const coreValues = [
  {
    title: "Compassion First",
    description:
      "Every decision we make is guided by empathy and a genuine desire to uplift communities facing hardship.",
    iconPath:
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    color: "var(--accent)",
  },
  {
    title: "Radical Transparency",
    description:
      "We believe trust is earned through openness. Every donation, every meal, every impact metric is tracked and shared.",
    iconPath:
      "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    color: "var(--primary)",
  },
  {
    title: "Community Power",
    description:
      "We harness the collective strength of volunteers, donors, and partners to create lasting, systemic change.",
    iconPath:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    color: "var(--success)",
  },
  {
    title: "Innovation Driven",
    description:
      "We leverage technology to maximize efficiency, reduce waste, and scale our impact exponentially.",
    iconPath:
      "M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z",
    color: "var(--warning)",
  },
];

const teamMembers = [
  {
    name: "Priya Sharma",
    role: "Founder & CEO",
    bio: "Former McKinsey consultant turned social entrepreneur. Priya founded Helping Hands after witnessing food insecurity firsthand during the pandemic.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Arjun Mehta",
    role: "Head of Operations",
    bio: "Supply chain expert with 15 years of experience. Arjun ensures our food distribution network runs efficiently across all 48 cities.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Sneha Reddy",
    role: "Community Director",
    bio: "Grassroots organizer who has built volunteer networks in 12 states. Sneha brings communities together with infectious enthusiasm.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  {
    name: "Vikram Singh",
    role: "Technology Lead",
    bio: "Former Google engineer who built our real-time tracking platform. Vikram believes technology should serve humanity first.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

const milestones = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Started as a small group of friends distributing meals during the pandemic lockdown in Mumbai.",
  },
  {
    year: "2021",
    title: "Going Digital",
    description:
      "Launched our volunteer matching platform and expanded to 8 cities across Maharashtra and Gujarat.",
  },
  {
    year: "2022",
    title: "Scaling Impact",
    description:
      "Crossed 500,000 meals milestone. Partnered with 200+ NGOs and corporate sponsors nationwide.",
  },
  {
    year: "2023",
    title: "National Reach",
    description:
      "Expanded to 32 cities, introduced the donor dashboard, and hit 8,000 active volunteers.",
  },
  {
    year: "2024",
    title: "Today & Beyond",
    description:
      "Serving 2.4M+ meals annually with 15,000 volunteers across 48 cities. And we're just getting started.",
  },
];

const partners = [
  "Tata Trusts",
  "Infosys Foundation",
  "UNICEF India",
  "Akshaya Patra",
  "Robin Hood Army",
  "Feeding India",
  "Give India",
  "United Way",
];

export default function AboutPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "72px" }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "100px 48px 140px",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920&q=80"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(0,82,204,0.92) 0%, rgba(38,132,255,0.85) 100%)",
              }}
            />
          </div>

          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                className="chip animate-fade-up"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  marginBottom: "24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                About Helping Hands
              </div>

              <h1
                className="animate-fade-up"
                style={{
                  color: "#fff",
                  marginBottom: "24px",
                  animationDelay: "0.1s",
                }}
              >
                Fighting hunger through{" "}
                <span style={{ opacity: 0.9 }}>collective action</span>
              </h1>

              <p
                className="animate-fade-up"
                style={{
                  fontSize: "1.25rem",
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.7,
                  maxWidth: 560,
                  animationDelay: "0.2s",
                }}
              >
                We're a community-driven platform connecting donors, volunteers,
                and organizations to ensure no one goes hungry. Together, we're
                building a future where food reaches every table.
              </p>

              <div
                className="animate-fade-up"
                style={{
                  display: "flex",
                  gap: "40px",
                  marginTop: "48px",
                  animationDelay: "0.3s",
                }}
              >
                {[
                  { value: "2.4M+", label: "Meals Served" },
                  { value: "15K+", label: "Volunteers" },
                  { value: "48", label: "Cities" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#fff",
                        fontFamily: "Manrope",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9375rem",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section
          style={{
            marginTop: "-60px",
            position: "relative",
            zIndex: 2,
            padding: "0 48px",
          }}
        >
          <div className="container">
            <div
              className="card-elevated"
              style={{
                padding: "56px 72px",
                textAlign: "center",
                maxWidth: 900,
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "var(--primary-fixed)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  color: "var(--primary)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <h2
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  marginBottom: "20px",
                }}
              >
                Our Mission
              </h2>
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "var(--on-surface-variant)",
                  lineHeight: 1.8,
                  maxWidth: 700,
                  margin: "0 auto",
                }}
              >
                To create a hunger-free India by building the most efficient,
                transparent, and community-driven food redistribution network.
                We envision a world where surplus food reaches those in need
                before it goes to waste.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section">
          <div className="container">
            <div
              style={{
                textAlign: "center",
                marginBottom: "64px",
                maxWidth: 640,
                margin: "0 auto 64px",
              }}
            >
              <div className="chip" style={{ marginBottom: "20px" }}>
                What We Stand For
              </div>
              <h2 style={{ marginBottom: "20px" }}>
                Values that <span className="text-gradient">guide us</span>
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--on-surface-variant)",
                  lineHeight: 1.7,
                }}
              >
                Every action we take is rooted in these core principles that
                define who we are and how we serve our communities.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "32px",
              }}
            >
              {coreValues.map((value, idx) => (
                <div
                  key={value.title}
                  className="card animate-fade-up"
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-xl)",
                      background: `${value.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      color: value.color,
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={value.iconPath} />
                    </svg>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      marginBottom: "12px",
                    }}
                  >
                    {value.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9375rem",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.6,
                    }}
                  >
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section
          className="section"
          style={{ background: "var(--surface-container-low)" }}
        >
          <div className="container">
            <div
              style={{
                textAlign: "center",
                marginBottom: "64px",
                maxWidth: 640,
                margin: "0 auto 64px",
              }}
            >
              <div className="chip" style={{ marginBottom: "20px" }}>
                Our Journey
              </div>
              <h2 style={{ marginBottom: "20px" }}>
                From <span className="text-gradient">small beginnings</span> to
                national impact
              </h2>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0",
                maxWidth: 800,
                margin: "0 auto",
                position: "relative",
              }}
            >
              {/* Timeline line */}
              <div
                style={{
                  position: "absolute",
                  left: 28,
                  top: 40,
                  bottom: 40,
                  width: 2,
                  background:
                    "linear-gradient(to bottom, var(--primary), var(--success))",
                }}
              />

              {milestones.map((milestone, idx) => (
                <div
                  key={milestone.year}
                  className="animate-fade-up"
                  style={{
                    display: "flex",
                    gap: "32px",
                    padding: "24px 0",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background:
                        idx === milestones.length - 1
                          ? "var(--grad-primary)"
                          : "var(--surface-container-lowest)",
                      border:
                        idx === milestones.length - 1
                          ? "none"
                          : "2px solid var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.8125rem",
                      color:
                        idx === milestones.length - 1
                          ? "#fff"
                          : "var(--primary)",
                      flexShrink: 0,
                      zIndex: 1,
                      boxShadow: "0 4px 12px rgba(0,82,204,0.15)",
                    }}
                  >
                    {milestone.year}
                  </div>
                  <div
                    className="card"
                    style={{
                      flex: 1,
                      padding: "24px 28px",
                      border:
                        idx === milestones.length - 1
                          ? "2px solid var(--primary)"
                          : "1px solid transparent",
                      background:
                        idx === milestones.length - 1
                          ? "var(--primary-fixed)"
                          : "var(--surface-container-lowest)",
                    }}
                  >
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        marginBottom: "8px",
                        color:
                          idx === milestones.length - 1
                            ? "var(--primary)"
                            : "var(--on-surface)",
                      }}
                    >
                      {milestone.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.9375rem",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.6,
                      }}
                    >
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="section">
          <div className="container">
            <div
              style={{
                textAlign: "center",
                marginBottom: "64px",
                maxWidth: 640,
                margin: "0 auto 64px",
              }}
            >
              <div className="chip" style={{ marginBottom: "20px" }}>
                Leadership Team
              </div>
              <h2 style={{ marginBottom: "20px" }}>
                Meet the people{" "}
                <span className="text-gradient">driving change</span>
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--on-surface-variant)",
                  lineHeight: 1.7,
                }}
              >
                Our diverse team brings together expertise in technology,
                operations, community organizing, and social impact.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "32px",
              }}
            >
              {teamMembers.map((member, idx) => (
                <div
                  key={member.name}
                  className="card animate-fade-up"
                  style={{
                    padding: 0,
                    overflow: "hidden",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: "100%",
                        height: 280,
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(23,43,77,0.6), transparent 50%)",
                      }}
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <h4
                      style={{
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        marginBottom: "4px",
                      }}
                    >
                      {member.name}
                    </h4>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--primary)",
                        fontWeight: 600,
                        marginBottom: "12px",
                      }}
                    >
                      {member.role}
                    </div>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.6,
                      }}
                    >
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section
          style={{
            background: "var(--surface-container-low)",
            padding: "64px 48px",
            borderTop: "1px solid rgba(23,43,77,0.06)",
            borderBottom: "1px solid rgba(23,43,77,0.06)",
          }}
        >
          <div className="container">
            <div style={{ textAlign: "center", marginBottom: "48px" }}>
              <div className="chip" style={{ marginBottom: "16px" }}>
                Our Partners
              </div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                Trusted by leading organizations
              </h3>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "48px",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {partners.map((partner) => (
                <span
                  key={partner}
                  style={{
                    fontFamily: "Manrope, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.125rem",
                    color: "var(--outline)",
                    opacity: 0.7,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = "0.7")
                  }
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Join Us CTA */}
        <section
          style={{
            background: "var(--grad-dark)",
            padding: "100px 48px",
            textAlign: "center",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(38,132,255,0.15) 0%, transparent 60%)",
            }}
          />

          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="white"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                marginBottom: "20px",
                color: "white",
              }}
            >
              Join our mission
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.85,
                marginBottom: "40px",
                maxWidth: 560,
                margin: "0 auto 40px",
              }}
            >
              Whether you volunteer, donate, or simply spread the word — every
              action brings us closer to a hunger-free future.
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                to="/serve"
                className="btn btn-lg"
                style={{
                  background: "#fff",
                  color: "var(--primary)",
                  fontWeight: 700,
                }}
              >
                Become a Volunteer
              </Link>
              <Link
                to="/donor/login"
                className="btn btn-lg"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                Start Donating
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
