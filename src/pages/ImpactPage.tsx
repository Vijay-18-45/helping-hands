import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const impactMetrics = [
  {
    value: "2.4M+",
    label: "Meals Served",
    description: "Nutritious meals delivered to families facing food insecurity",
    iconPath:
      "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z",
    color: "var(--primary)",
  },
  {
    value: "15K+",
    label: "Active Volunteers",
    description: "Dedicated individuals making a difference every day",
    iconPath:
      "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
    color: "var(--success)",
  },
  {
    value: "500+",
    label: "Partner Organizations",
    description: "NGOs, shelters, and community centers across the network",
    iconPath:
      "M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z",
    color: "var(--warning)",
  },
  {
    value: "48",
    label: "Cities Reached",
    description: "Expanding our reach to communities nationwide",
    iconPath:
      "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    color: "var(--accent)",
  },
];

const impactStories = [
  {
    title: "Community Kitchen Initiative",
    location: "Mumbai, Maharashtra",
    impact: "12,000 meals served monthly",
    description:
      "What started as a small weekend project has grown into a full-scale operation serving 12,000 meals every month to families in need.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80",
    stats: [
      { label: "Families Fed", value: "2,400+" },
      { label: "Volunteers", value: "85" },
      { label: "Partners", value: "12" },
    ],
  },
  {
    title: "School Nutrition Program",
    location: "Delhi NCR",
    impact: "5,000 children served daily",
    description:
      "Ensuring every child has access to nutritious meals during school hours, improving attendance and academic performance.",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&q=80",
    stats: [
      { label: "Schools", value: "45" },
      { label: "Daily Meals", value: "5,000" },
      { label: "Districts", value: "8" },
    ],
  },
  {
    title: "Elder Care Program",
    location: "Bangalore, Karnataka",
    impact: "Weekly support for 500+ seniors",
    description:
      "Providing weekly grocery delivery and meal preparation assistance to senior citizens living alone.",
    image:
      "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80",
    stats: [
      { label: "Seniors Helped", value: "500+" },
      { label: "Weekly Visits", value: "1,200" },
      { label: "Volunteers", value: "120" },
    ],
  },
];

const transparencyMetrics = [
  {
    label: "Fund Utilization",
    value: 94,
    description: "94% of funds go directly to programs",
  },
  {
    label: "Volunteer Retention",
    value: 87,
    description: "87% of volunteers return for more",
  },
  {
    label: "On-Time Delivery",
    value: 98,
    description: "98% of meals delivered on schedule",
  },
  {
    label: "Partner Satisfaction",
    value: 96,
    description: "96% partner satisfaction rate",
  },
];

const yearlyGrowth = [
  { year: "2021", meals: "120K", volunteers: "800", cities: "8" },
  { year: "2022", meals: "450K", volunteers: "2,500", cities: "18" },
  { year: "2023", meals: "1.2M", volunteers: "8,000", cities: "32" },
  { year: "2024", meals: "2.4M", volunteers: "15,000", cities: "48" },
];

export default function ImpactPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingTop: "72px" }}>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "100px 48px 120px",
            background: "var(--grad-dark)",
            color: "#fff",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              right: "10%",
              transform: "translateY(-50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(38,132,255,0.2) 0%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <div style={{ maxWidth: 720 }}>
              <div
                className="chip animate-fade-up"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "#fff",
                  marginBottom: "24px",
                  backdropFilter: "blur(10px)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block",
                    marginRight: 8,
                  }}
                />
                Real-Time Impact Tracking
              </div>

              <h1
                className="animate-fade-up"
                style={{
                  color: "#fff",
                  marginBottom: "24px",
                  animationDelay: "0.1s",
                }}
              >
                Measuring our{" "}
                <span style={{ opacity: 0.9 }}>collective impact</span>
              </h1>

              <p
                className="animate-fade-up"
                style={{
                  fontSize: "1.25rem",
                  color: "rgba(255,255,255,0.85)",
                  lineHeight: 1.7,
                  maxWidth: 560,
                  animationDelay: "0.2s",
                }}
              >
                Every meal served, every volunteer hour logged, every family
                helped — we track it all with complete transparency. See the
                real difference your contributions make.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
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
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "40px",
                padding: "48px 56px",
              }}
            >
              {impactMetrics.map((metric, idx) => (
                <div
                  key={metric.label}
                  className="animate-fade-up"
                  style={{
                    textAlign: "center",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "var(--radius-xl)",
                      background: `${metric.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      color: metric.color,
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d={metric.iconPath} />
                    </svg>
                  </div>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: 800,
                      fontFamily: "Manrope, sans-serif",
                      color: metric.color,
                      marginBottom: "4px",
                    }}
                  >
                    {metric.value}
                  </div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      marginBottom: "8px",
                    }}
                  >
                    {metric.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--on-surface-variant)",
                      lineHeight: 1.5,
                    }}
                  >
                    {metric.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Stories */}
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
                Success Stories
              </div>
              <h2 style={{ marginBottom: "20px" }}>
                Programs making a{" "}
                <span className="text-gradient">real difference</span>
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "var(--on-surface-variant)",
                  lineHeight: 1.7,
                }}
              >
                From community kitchens to school nutrition programs, see how
                our initiatives are transforming lives across the country.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "48px",
              }}
            >
              {impactStories.map((story, idx) => (
                <div
                  key={story.title}
                  className="card animate-fade-up"
                  style={{
                    display: "grid",
                    gridTemplateColumns: idx % 2 === 0 ? "1fr 1.2fr" : "1.2fr 1fr",
                    gap: "0",
                    padding: 0,
                    overflow: "hidden",
                    animationDelay: `${idx * 0.1}s`,
                  }}
                >
                  <div
                    style={{
                      order: idx % 2 === 0 ? 1 : 2,
                      position: "relative",
                    }}
                  >
                    <img
                      src={story.image}
                      alt={story.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        minHeight: 320,
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        background: "rgba(0,0,0,0.7)",
                        backdropFilter: "blur(8px)",
                        padding: "8px 16px",
                        borderRadius: "99px",
                        color: "white",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      </svg>
                      {story.location}
                    </div>
                  </div>

                  <div
                    style={{
                      order: idx % 2 === 0 ? 2 : 1,
                      padding: "48px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="chip chip-success"
                      style={{ marginBottom: "16px", width: "fit-content" }}
                    >
                      {story.impact}
                    </div>
                    <h3
                      style={{
                        fontSize: "1.75rem",
                        fontWeight: 800,
                        marginBottom: "16px",
                      }}
                    >
                      {story.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--on-surface-variant)",
                        lineHeight: 1.7,
                        fontSize: "1.0625rem",
                        marginBottom: "32px",
                      }}
                    >
                      {story.description}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "24px",
                        padding: "24px",
                        background: "var(--surface-container-low)",
                        borderRadius: "var(--radius-lg)",
                      }}
                    >
                      {story.stats.map((stat) => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                          <div
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: 800,
                              color: "var(--primary)",
                              fontFamily: "Manrope",
                            }}
                          >
                            {stat.value}
                          </div>
                          <div
                            style={{
                              fontSize: "0.8125rem",
                              color: "var(--on-surface-variant)",
                            }}
                          >
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Transparency Section */}
        <section
          className="section"
          style={{ background: "var(--surface-container-low)" }}
        >
          <div className="container">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "80px",
                alignItems: "center",
              }}
            >
              <div>
                <div className="chip" style={{ marginBottom: "20px" }}>
                  Transparency Report
                </div>
                <h2 style={{ marginBottom: "24px" }}>
                  Accountability you can{" "}
                  <span className="text-gradient">trust</span>
                </h2>
                <p
                  style={{
                    color: "var(--on-surface-variant)",
                    lineHeight: 1.8,
                    fontSize: "1.0625rem",
                    marginBottom: "40px",
                  }}
                >
                  We believe in radical transparency. Every rupee donated, every
                  meal served, every volunteer hour — everything is tracked,
                  verified, and reported in real-time.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {transparencyMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{ fontWeight: 600, fontSize: "0.9375rem" }}
                        >
                          {metric.label}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: "var(--primary)",
                            fontSize: "0.9375rem",
                          }}
                        >
                          {metric.value}%
                        </span>
                      </div>
                      <div className="progress-track" style={{ height: 10 }}>
                        <div
                          className="progress-fill"
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.8125rem",
                          color: "var(--on-surface-variant)",
                          marginTop: "6px",
                        }}
                      >
                        {metric.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Timeline */}
              <div className="card-elevated" style={{ padding: "40px" }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    marginBottom: "32px",
                    fontFamily: "Manrope",
                  }}
                >
                  Year-over-Year Growth
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  {yearlyGrowth.map((year, idx) => (
                    <div
                      key={year.year}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "24px",
                        padding: "20px 24px",
                        background:
                          idx === yearlyGrowth.length - 1
                            ? "var(--primary-fixed)"
                            : "var(--surface-container-low)",
                        borderRadius: "var(--radius-lg)",
                        border:
                          idx === yearlyGrowth.length - 1
                            ? "2px solid var(--primary)"
                            : "1px solid transparent",
                      }}
                    >
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: "var(--radius-lg)",
                          background:
                            idx === yearlyGrowth.length - 1
                              ? "var(--primary)"
                              : "var(--surface-container)",
                          color:
                            idx === yearlyGrowth.length - 1
                              ? "#fff"
                              : "var(--on-surface)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1rem",
                          fontFamily: "Manrope",
                        }}
                      >
                        {year.year}
                      </div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: "24px",
                          flex: 1,
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color:
                                idx === yearlyGrowth.length - 1
                                  ? "var(--primary)"
                                  : "var(--on-surface)",
                            }}
                          >
                            {year.meals}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--on-surface-variant)",
                            }}
                          >
                            Meals
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color:
                                idx === yearlyGrowth.length - 1
                                  ? "var(--primary)"
                                  : "var(--on-surface)",
                            }}
                          >
                            {year.volunteers}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--on-surface-variant)",
                            }}
                          >
                            Volunteers
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: "1.25rem",
                              fontWeight: 700,
                              color:
                                idx === yearlyGrowth.length - 1
                                  ? "var(--primary)"
                                  : "var(--on-surface)",
                            }}
                          >
                            {year.cities}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--on-surface-variant)",
                            }}
                          >
                            Cities
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            background: "var(--grad-primary)",
            padding: "100px 48px",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div className="container">
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: 800,
                marginBottom: "20px",
                color: "white",
              }}
            >
              Be part of the impact
            </h2>
            <p
              style={{
                fontSize: "1.25rem",
                opacity: 0.9,
                marginBottom: "40px",
                maxWidth: 560,
                margin: "0 auto 40px",
              }}
            >
              Join thousands of volunteers and donors who are making a
              measurable difference in communities across the country.
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
                Start Volunteering
              </Link>
              <Link
                to="/donor/login"
                className="btn btn-lg"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                Make a Donation
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
