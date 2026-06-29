import React from 'react';
import ReactDOM from 'react-dom/client';
// shell.jsx — RExI sidebar navigation + top header
(function () {
  const I = window.RExIcons;

  // ── Logo ──────────────────────────────────────────────────────────
  function Logo() {
    return (
      <div style={{ padding: "10px 0 6px" }}>
        <div style={{
          fontFamily: "'Source Sans 3', sans-serif", fontWeight: 800, fontSize: 30,
          letterSpacing: "-0.5px", color: "#006CB8", lineHeight: 1,
        }}>
          R<span style={{ fontWeight: 700 }}>Ex</span>I
        </div>
        <div style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: 14, color: "#006CB8", marginTop: 4,
        }}>Research Exchange Interface</div>
      </div>
    );
  }

  // ── A single primary nav row (Home / Portfolio / Guide Me) ─────────
  function NavRow({ icon, label, color = "#2E2D29", onClick, active, badge, iconColor }) {
    const [hover, setHover] = React.useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "center", gap: 12, width: "100%",
          padding: "9px 12px", border: "none", borderRadius: 4, cursor: "pointer", textAlign: "left",
          background: active ? "rgba(1,97,165,0.12)" : hover ? "rgba(1,97,165,0.06)" : "transparent",
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, color,
          transition: "background .12s",
        }}>
        <span style={{ width: 24, height: 24, display: "grid", placeItems: "center", color: iconColor || "#53565A" }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {badge}
      </button>
    );
  }

  // ── A flow step row (indented, with status dot/check) ──────────────
  function StepRow({ label, status, active, onClick }) {
    // status: 'done' | 'current' | 'todo'
    const [hover, setHover] = React.useState(false);
    let mark;
    if (status === "done") mark = <span style={{ color: "#1f8a4d" }}><I.check size={18} sw={2.4} /></span>;
    else if (active) mark = <span style={{ width: 9, height: 9, borderRadius: 9, background: "#006CB8" }} />;
    else mark = <span style={{ width: 9, height: 9, borderRadius: 9, border: "1.5px solid #b9c2cb" }} />;
    return (
      <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          display: "flex", alignItems: "center", gap: 12, width: "100%",
          padding: "8px 12px 8px 14px", border: "none", borderRadius: 4, cursor: "pointer", textAlign: "left",
          background: active ? "rgba(1,97,165,0.14)" : hover ? "rgba(1,97,165,0.06)" : "transparent",
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 18,
          color: "#2E2D29", fontWeight: active ? 600 : 400, transition: "background .12s",
        }}>
        <span style={{ width: 24, display: "grid", placeItems: "center" }}>{mark}</span>
        <span>{label}</span>
      </button>
    );
  }

  function SectionHeader({ icon, label, attention, onClick, active }) {
    const [hover, setHover] = React.useState(false);
    const clickable = !!onClick;
    return (
      <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
        display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 4,
        fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, color: "#2E2D29",
        cursor: clickable ? "pointer" : "default",
        fontWeight: active ? 600 : 400,
        background: active ? "rgba(1,97,165,0.14)" : (clickable && hover ? "rgba(1,97,165,0.06)" : "transparent"),
        transition: "background .12s",
      }}>
        <span style={{ width: 24, height: 24, display: "grid", placeItems: "center", color: attention ? "#2E2D29" : "#53565A" }}>{icon}</span>
        <span>{label}</span>
      </div>
    );
  }

  function Sidebar({ steps, current, completed, onNavigate, onGuideMe, study, guidePulse }) {
    const stepStatus = (id) => {
      if (current === id) return "current";
      return completed.has(id) ? "done" : "todo";
    };
    const overviewDone = steps.every((s) => completed.has(s.id));
    return (
      <nav style={{
        width: 320, flexShrink: 0, height: "100%", overflowY: "auto", boxSizing: "border-box",
        background: "#E7F5FF", borderRight: "1px solid #66A7D4", padding: "16px 12px",
        display: "flex", flexDirection: "column",
      }}>
        <Logo />
        <div style={{ height: 10 }} />
        <NavRow icon={<I.home size={22} />} label="Home" active={current === "home"} onClick={() => onNavigate("home")} />
        <NavRow icon={<I.table size={22} />} label="Research Portfolio" active={current === "portfolio"} onClick={() => onNavigate("portfolio")} />
        <NavRow
          icon={<I.sparkles size={22} />} iconColor="#E50808" label="Guide Me" color="#B1040E"
          onClick={onGuideMe}
          badge={<span style={{
            width: 8, height: 8, borderRadius: 8, background: "#E50808",
            boxShadow: guidePulse ? "0 0 0 0 rgba(229,8,8,0.6)" : "none",
            animation: guidePulse ? "rexiPulse 1.6s infinite" : "none",
          }} />}
        />

        {/* Study selector */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "10px 4px 12px" }}>
          <div style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "#fff", border: "1px solid #ABABA9", borderRadius: 2, padding: "7px 10px",
            fontFamily: "'Source Sans 3',sans-serif", fontSize: 17, color: "#2E2D29",
          }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{study.title}</span>
            <I.chevron size={18} />
          </div>
          <button title="New study" style={{
            width: 30, height: 30, display: "grid", placeItems: "center", border: "none",
            background: "transparent", color: "#006CB8", cursor: "pointer",
          }}><I.plus size={22} /></button>
        </div>

        <NavRow icon={<I.table size={22} />} label="Study Overview" active={current === "overview"} onClick={() => onNavigate("overview")} />
        <div style={{ paddingLeft: 14 }}>
          {steps.map((s) => (
            <StepRow key={s.id} label={s.label} status={stepStatus(s.id)}
              active={current === s.id} onClick={() => onNavigate(s.id)} />
          ))}
        </div>

        <div style={{ marginTop: 6 }}>
          <SectionHeader
            icon={overviewDone ? <span style={{ color: "#1f8a4d" }}><I.checkSolid size={22} /></span> : <span style={{ color: "#c9a200" }}><I.exclaim size={22} /></span>}
            label="Study Intake Review" attention
            active={current === "review" || current === "activation"}
            onClick={() => onNavigate("review")} />
        </div>

        {/* Documents + Tasks with action buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <NavRow icon={<I.upload size={22} />} label="Documents" active={current === "documents"} onClick={() => onNavigate("documents")} />
          </div>
          <button title="Upload document" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "none", background: "#006CB8", color: "#fff", borderRadius: 4, cursor: "pointer", flexShrink: 0 }}>
            <I.upload size={16} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <NavRow icon={<I.clipboard size={22} />} label="Tasks" active={current === "tasks"} onClick={() => onNavigate("tasks")} />
          </div>
          <button title="New task" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "none", background: "#006CB8", color: "#fff", borderRadius: 4, cursor: "pointer", flexShrink: 0 }}>
            <I.plus size={16} />
          </button>
        </div>

        <div style={{ borderTop: "1px solid #B7D4E8", margin: "10px 6px" }} />

        {/* Research Admin Services — expandable */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <NavRow
              icon={<I.building size={22} />} label="Research Admin Services"
              active={current === "adminServices"}
              onClick={() => onNavigate("adminServices")}
            />
          </div>
          <button title="New service request" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: "none", background: "#006CB8", color: "#fff", borderRadius: 4, cursor: "pointer", flexShrink: 0 }}>
            {(current === "adminServices" || current === "adminBudget") ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><line x1="2" y1="7" x2="12" y2="7"/></svg>
            ) : (
              <I.plus size={16} />
            )}
          </button>
        </div>
        {(current === "adminServices" || current === "adminBudget") && (
          <div style={{ paddingLeft: 14 }}>
            <StepRow label="Budget" status={current === "adminBudget" ? "current" : "todo"} active={current === "adminBudget"} onClick={() => onNavigate("adminBudget")} />
          </div>
        )}

        <SectionHeader icon={<I.beaker size={22} />} label="Research Clinical Services" />

        {/* Bottom user block */}
        <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", flexDirection: "column", gap: 2 }}>
          <NavRow icon={<I.user size={20} />} label="Jordan Avery" color="#76746F" />
          <NavRow icon={<I.bell size={20} />} label="Notifications" color="#76746F" />
          <NavRow icon={<I.video size={20} />} label="Tutorials" color="#76746F" />
          <NavRow icon={<I.cog size={20} />} label="Settings" color="#76746F" />
        </div>
      </nav>
    );
  }

  // ── Subway-map style lifecycle progress ─────────────────────────────
  function SubwayMap({ phases }) {
    const Bar = ({ ph }) => {
      if (ph.state === "locked") {
        return <div style={{ height: 4, borderRadius: 4, borderTop: "2px dotted rgba(255,255,255,0.45)" }} />;
      }
      if (ph.state === "current") {
        return (
          <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.28)", overflow: "hidden" }}>
            <div style={{ width: (ph.pct || 40) + "%", height: "100%", background: "#7DC0F0", borderRadius: 4 }} />
          </div>
        );
      }
      return <div style={{ height: 4, borderRadius: 4, background: "#7DC0F0" }} />;
    };
    const left = phases.filter((p) => p.state !== "locked");
    const right = phases.filter((p) => p.state === "locked");
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginTop: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {left.map((ph) => (
            <div key={ph.label} style={{ width: 118 }}>
              <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 14, marginBottom: 8, whiteSpace: "nowrap" }}>{ph.label}</div>
              <Bar ph={ph} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, alignSelf: "flex-end", height: 4, borderTop: "2px dotted rgba(255,255,255,0.4)", margin: "0 4px 0px" }} />
        <div style={{ display: "flex", gap: 22 }}>
          {right.map((ph) => (
            <div key={ph.label} style={{ minWidth: 110 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'Source Sans 3',sans-serif", fontSize: 14, marginBottom: 8, opacity: 0.92, whiteSpace: "nowrap" }}>
                {ph.label} <I.lock size={14} />
              </div>
              <Bar ph={ph} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Top header (blue banner) ───────────────────────────────────────
  function Header({ study, progressOn, onToggleProgress }) {
    return (
      <header style={{
        background: "linear-gradient(118deg,#1a82c8 0%,#0d6cb6 52%,#0a5ea4 100%)",
        color: "#fff", padding: "20px 40px 16px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: ".3px", opacity: 0.95 }}>
              RExI ID: {study.rexiId}
            </div>
            <h1 style={{
              fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize: 34, margin: "3px 0 4px", lineHeight: 1.05,
            }}>{study.title}</h1>
            <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, opacity: 0.96 }}>{study.subtitle}</div>
            {study.pi && <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize: 18, marginTop: 4 }}>PI: {study.pi}</div>}
          </div>
          {study.activationDays != null && (
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 12, letterSpacing: ".8px", fontWeight: 600, opacity: 0.92 }}>ACTIVATION GOAL</div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: "#0A5A99",
                borderRadius: 8, padding: "8px 16px", margin: "6px 0 6px", boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
              }}>
                <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontWeight: 800, fontSize: 34, lineHeight: 1 }}>{study.activationDays}</span>
                <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: ".5px" }}>DAYS</span>
                <I.chevron size={16} />
              </div>
              <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontWeight: 700, fontSize: 14 }}>You’re making progress!</div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 15 }}>
            RExI progress {progressOn ? "on" : "off"}
          </span>
          <button onClick={onToggleProgress} aria-label="Toggle progress" style={{
            width: 50, height: 26, borderRadius: 26, border: "none", cursor: "pointer", position: "relative",
            background: progressOn ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.35)", transition: "background .2s",
          }}>
            <span style={{
              position: "absolute", top: 3, left: progressOn ? 27 : 3, width: 20, height: 20, borderRadius: 20,
              background: progressOn ? "#0a6cb8" : "#fff", transition: "left .2s", boxShadow: "0 1px 2px rgba(0,0,0,.3)",
            }} />
          </button>
        </div>

        {progressOn && study.phases && <SubwayMap phases={study.phases} />}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
            color: "#fff", fontFamily: "'Source Sans 3',sans-serif", fontSize: 14, cursor: "pointer", opacity: 0.95,
          }}><I.chevron size={16} /> Open subway map</button>
        </div>
      </header>
    );
  }

  window.RExShell = { Sidebar, Header };
})();
