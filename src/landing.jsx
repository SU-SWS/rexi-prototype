import React from 'react';
// landing.jsx — Full-screen RExI landing / home page (no sidebar, no app header)
(function () {
  const I = window.RExIcons;
  const FONT = "'Source Sans 3', sans-serif";
  const SERIF = "'Source Serif 4', Georgia, serif";
  const STANFORD_RED = "#B1040E";

  function LandingPage({ onPortfolio, onGuide }) {
    const [search, setSearch] = React.useState("");

    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Stanford Medicine top bar */}
        <div style={{ background: STANFORD_RED, padding: "0 32px", height: 40, display: "flex", alignItems: "center", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Stanford shield SVG */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 1L2 5v6c0 5 4 9.5 9 10.5C16 20.5 20 16 20 11V5L11 1z" fill="#fff" opacity="0.9"/>
              <path d="M11 3L4 6.5V11c0 4 3 7.5 7 8.5 4-1 7-4.5 7-8.5V6.5L11 3z" fill={STANFORD_RED}/>
              <text x="11" y="14" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="bold" fontFamily="serif">S</text>
            </svg>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.5 }}>Stanford</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>|</span>
            <span style={{ fontFamily: FONT, fontSize: 14, color: "rgba(255,255,255,0.9)", letterSpacing: 1.5, textTransform: "uppercase" }}>Medicine</span>
          </div>
        </div>

        {/* Main content area — scrollable */}
        <div style={{ flex: 1, overflowY: "auto", position: "relative", background: "#E8EEF4" }}>

          {/* Top nav row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px 0" }}>
            {/* RExI wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, letterSpacing: "-1px", color: "#2E2D29", lineHeight: 1 }}>
                R<span style={{ fontWeight: 700 }}>Ex</span>I
              </div>
              <div style={{ borderLeft: "1.5px solid #C0C0BF", paddingLeft: 12 }}>
                <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69", lineHeight: 1.4 }}>Research</div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69", lineHeight: 1.4 }}>Exchange</div>
                <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69", lineHeight: 1.4 }}>Interface</div>
              </div>
            </div>
            {/* Help */}
            <button style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 15, color: "#2E2D29" }}>
              Help
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: STANFORD_RED, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700 }}>?</span>
            </button>
          </div>

          {/* Hero */}
          <div style={{ padding: "48px 40px 40px", maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 32 }}>
              <img src="assets/rexi-mascot.png" alt="RExI mascot" style={{ width: 110, height: "auto", flexShrink: 0, marginTop: 4 }} />
              <h1 style={{
                fontFamily: SERIF, fontSize: 37, fontWeight: 400, color: "#2E2D29",
                margin: 0, lineHeight: 1.4, letterSpacing: 1,
              }}>
                RExI is the Research Exchange Interface here to help you navigate the Stanford research study lifecycle.
              </h1>
            </div>

            {/* Search bar */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 720 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder=""
                style={{
                  flex: 1, height: 48, border: "1.5px solid #C8D4DC",
                  borderRadius: 8, padding: "0 16px",
                  fontFamily: FONT, fontSize: 16, outline: "none",
                  background: "#fff", color: "#2E2D29",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              />
              <button style={{
                width: 48, height: 48, borderRadius: "50%",
                background: STANFORD_RED, border: "none", cursor: "pointer",
                display: "grid", placeItems: "center", color: "#fff", flexShrink: 0,
              }}>
                <I.sparkles size={20} />
              </button>
            </div>
          </div>

          {/* Three feature cards */}
          <div style={{ padding: "0 40px 48px", maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>

              {/* Card 1 — Portfolio */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 10px", lineHeight: 1.4 }}>
                    Already have a RExI portfolio?
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "#6D6C69", margin: 0, lineHeight: 1.6 }}>
                    Find and view progress of all your studies in your research portfolio.
                  </p>
                </div>
                <button onClick={onPortfolio} style={{
                  display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start",
                  fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#fff",
                  background: STANFORD_RED, border: "none", borderRadius: 6,
                  padding: "12px 20px", cursor: "pointer",
                }}>
                  RExI Portfolio <I.arrowUpRight size={16} />
                </button>
              </div>

              {/* Card 2 — Guide Me */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 10px", lineHeight: 1.4 }}>
                    Try RExI's easy-start guide from set-up to activation.
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "#6D6C69", margin: 0, lineHeight: 1.6 }}>
                    Use Guide Me to set up your research study stress-free.
                  </p>
                </div>
                <button onClick={onGuide} style={{
                  display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start",
                  fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#fff",
                  background: STANFORD_RED, border: "none", borderRadius: 6,
                  padding: "12px 20px", cursor: "pointer",
                }}>
                  Guide Me <I.sparkles size={16} />
                </button>
              </div>

              {/* Card 3 — Tour */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 10px", lineHeight: 1.4 }}>
                    Take a tour of the RExI dashboards.
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "#6D6C69", margin: 0, lineHeight: 1.6 }}>
                    RExI has made it easier to get research studies started let us show you around.
                  </p>
                </div>
                <button style={{
                  display: "inline-flex", alignItems: "center", gap: 10, alignSelf: "flex-start",
                  fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#fff",
                  background: STANFORD_RED, border: "none", borderRadius: 6,
                  padding: "12px 20px", cursor: "pointer",
                }}>
                  Take a Tour <I.checkO size={16} />
                </button>
              </div>

            </div>
          </div>

          {/* Campus background — sky gradient + placeholder for campus photo */}
          {/* To use a real photo: replace the background below with `url('assets/stanford-campus.jpg') center/cover` */}
          <div style={{
            minHeight: 240,
            background: "linear-gradient(180deg, #B8CDD9 0%, #8AAABB 40%, #6D8C9A 70%, #5C7A88 100%)",
            position: "relative", overflow: "hidden",
          }}>
            {/* Hoover Tower silhouette approximation */}
            <svg viewBox="0 0 1400 240" preserveAspectRatio="xMidYMax meet" style={{ position: "absolute", bottom: 0, width: "100%", opacity: 0.35 }}>
              {/* Ground/treeline */}
              <path d="M0 180 Q200 140 400 160 Q500 168 600 155 Q700 142 800 158 Q900 172 1000 160 Q1100 148 1200 162 Q1300 172 1400 165 L1400 240 L0 240 Z" fill="#2E4A2E" />
              {/* Trees */}
              <ellipse cx="120" cy="160" rx="60" ry="35" fill="#3A5C3A" />
              <ellipse cx="280" cy="155" rx="70" ry="40" fill="#2E4A2E" />
              <ellipse cx="480" cy="162" rx="55" ry="30" fill="#3A5C3A" />
              <ellipse cx="650" cy="150" rx="65" ry="38" fill="#2E4A2E" />
              <ellipse cx="850" cy="158" rx="58" ry="32" fill="#3A5C3A" />
              <ellipse cx="1050" cy="152" rx="72" ry="42" fill="#2E4A2E" />
              <ellipse cx="1250" cy="160" rx="60" ry="34" fill="#3A5C3A" />
              {/* Hoover Tower */}
              <rect x="680" y="60" width="40" height="120" fill="#C4A87A" />
              <rect x="675" y="55" width="50" height="10" fill="#B89860" />
              <rect x="688" y="20" width="24" height="40" fill="#C4A87A" />
              <rect x="692" y="10" width="16" height="14" fill="#B89860" />
              <polygon points="700,2 692,10 708,10" fill="#A07840" />
              {/* Windows on tower */}
              <rect x="688" y="65" width="8" height="12" fill="rgba(100,80,40,0.4)" />
              <rect x="704" y="65" width="8" height="12" fill="rgba(100,80,40,0.4)" />
              <rect x="688" y="90" width="8" height="12" fill="rgba(100,80,40,0.4)" />
              <rect x="704" y="90" width="8" height="12" fill="rgba(100,80,40,0.4)" />
              <rect x="688" y="115" width="8" height="12" fill="rgba(100,80,40,0.4)" />
              <rect x="704" y="115" width="8" height="12" fill="rgba(100,80,40,0.4)" />
            </svg>
          </div>

        </div>
      </div>
    );
  }

  window.RExLanding = { LandingPage };
})();
