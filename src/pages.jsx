import React from 'react';
import ReactDOM from 'react-dom/client';
// pages.jsx — static Study Overview dashboard + Study Documents register
(function () {
  const I = window.RExIcons;
  const { FONT } = window.RExFields;
  const { OVERVIEW, STUDY_DOCS, DOC_FILTERS } = window.RExData;
  const SERIF = "'Source Serif 4', Georgia, serif";

  function initials(name) {
    return name.replace(/,.*$/, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  // ── Study Overview dashboard ────────────────────────────────────────
const NOTIFS = [
    "Dean Amoroso commented on Budget",
    "Anthea Buchin commented on Contract",
    "Todd Ferris commented on protocol changes",
  ];

  const ACTIVITIES = [
    { text: "PSOS needs approval",        icon: "exclaimO" },
    { text: "Protocol has been updated",  icon: "pencil"   },
    { text: "Revised IRB uploaded",       icon: "upload"   },
    { text: "Budget revision uploaded",   icon: "doc"      },
  ];

  const TODOS = [
    "Turn on the RExI project management",
    "Complete CDA",
    "Submission date to local or central IRB",
  ];

  const STUDY_TEAM_DISPLAY = [
    { name: "Dr. Albert Chiou", role: "Principal Investigator" },
    { name: "Amthea Buchin",    role: "Project Manager"        },
  ];

  const IDENTIFIERS_DISPLAY = [
    "SPO - 1234-ABCD-0000",
    "IRB - 1234-ABCD-0000",
    "ONCO-1234-ABCD",
  ];

  function InfoCard({ title, icon, children, footer }) {
    return (
      <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "20px 22px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ color: "#2E2D29" }}>{icon}</span>
          <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29" }}>{title}</span>
        </div>
        <div style={{ flex: 1 }}>{children}</div>
        {footer && (
          <button style={{ marginTop: 18, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, color: "#006CB8", padding: 0, textAlign: "left" }}>
            {footer}
          </button>
        )}
      </div>
    );
  }

  function OverviewPage({ onGuide, onActivate, onEditTeam }) {
    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>

        {/* ── Main content ─────────────────────────────────────────── */}
        <div style={{ padding: "32px 40px 56px" }}>

          {/* Page heading */}
          <h2 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 28px", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>
            You’ve finished exploration
          </h2>

          {/* Mascot + CTA — centered */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 40 }}>
            <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 120, height: "auto", marginBottom: 18 }} />
            <p style={{ fontFamily: FONT, fontSize: 17, color: "#2E2D29", lineHeight: 1.65, margin: "0 0 22px", maxWidth: 560 }}>
              I am here to guide you through the process. Want to continue on your own? Begin study activation to set up your tasks and I’ll manage your study behind the scenes.
            </p>
            <div style={{ display: "flex", gap: 14 }}>
              <button onClick={onGuide} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontFamily: FONT, fontSize: 16, fontWeight: 700,
                color: "#B1040E", background: "#fff", border: "2px solid #B1040E",
                borderRadius: 8, padding: "11px 22px", cursor: "pointer",
              }}>
                <I.sparkles size={18} /> Guide Me
              </button>
              <button onClick={onActivate} style={{
                fontFamily: FONT, fontSize: 16, fontWeight: 700,
                color: "#fff", background: "#1E3A5F",
                border: "none", borderRadius: 8, padding: "11px 24px", cursor: "pointer",
              }}>
                Assign Project Manager
              </button>
            </div>
          </div>

          {/* Three info cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>

            <InfoCard title="Notifications" icon={<I.bolt size={20} />} footer="See all notifications →">
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {NOTIFS.map((n, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: FONT, fontSize: 14, color: "#2E2D29" }}>
                    <span style={{ flexShrink: 0, marginTop: 1, color: "#76746F" }}><I.comment size={15} /></span>
                    {n}
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Recent Activity" icon={<I.sparkles size={20} />} footer="See all activity →">
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {ACTIVITIES.map((a, i) => {
                  const Ic = I[a.icon] || I.doc;
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: FONT, fontSize: 14, color: "#2E2D29" }}>
                      <span style={{ flexShrink: 0, marginTop: 1, color: "#76746F" }}><Ic size={15} /></span>
                      {a.text}
                    </div>
                  );
                })}
              </div>
            </InfoCard>

            {/* My to do list — mascot floats in corner */}
            <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "20px 22px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", position: "relative", overflow: "visible", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ color: "#2E2D29" }}><I.checkO size={20} /></span>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29" }}>My to do list</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 11, flex: 1 }}>
                {TODOS.map((t, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontFamily: FONT, fontSize: 14, color: "#2E2D29" }}>
                    <span style={{ flexShrink: 0, marginTop: 1, color: "#B1040E" }}><I.bolt size={15} /></span>
                    {t}
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 18, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, color: "#006CB8", padding: 0, textAlign: "left" }}>
                See all tasks →
              </button>
              {/* Floating mascot with Ask me badge */}
              <div style={{ position: "absolute", bottom: -8, right: -8, zIndex: 2 }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 56, height: "auto", display: "block" }} />
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    background: "#B1040E", color: "#fff",
                    fontFamily: FONT, fontSize: 10, fontWeight: 700,
                    borderRadius: 999, padding: "2px 7px", whiteSpace: "nowrap",
                  }}>Ask me</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row: Study Team + Identifier List */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 16 }}>

            {/* Study Team */}
            <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "20px 24px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#2E2D29" }}><I.peopleGroup size={20} /></span>
                  <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29" }}>Study Team</span>
                </div>
                <button style={{ border: "none", background: "none", cursor: "pointer", color: "#6D6C69", padding: 4 }}>
                  <I.dots size={20} />
                </button>
              </div>
              <div style={{ display: "flex", gap: 32 }}>
                {STUDY_TEAM_DISPLAY.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#E8ECEF", color: "#9aa3ab",
                      display: "grid", placeItems: "center", flexShrink: 0,
                    }}>
                      <I.user size={22} />
                    </div>
                    <div>
                      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#2E2D29" }}>{p.name}</div>
                      <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69" }}>{p.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Identifier List */}
            <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "20px 24px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29" }}>Study Identifier List</span>
                <button style={{ border: "none", background: "none", cursor: "pointer", color: "#6D6C69", padding: 4 }}>
                  <I.dots size={20} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {IDENTIFIERS_DISPLAY.map((id, i) => (
                  <a key={i} href="#" onClick={(e) => e.preventDefault()}
                    style={{ fontFamily: FONT, fontSize: 15, color: "#006CB8", textDecoration: "none" }}>
                    {id}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Study Documents register ────────────────────────────────────────
  function SortHeader({ label, sortable, caretDown }) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {label}
        {sortable && <span style={{ color: "#9aa3ab", transform: caretDown ? "none" : "rotate(180deg)", display: "grid", placeItems: "center" }}><I.chevron size={14} /></span>}
      </span>
    );
  }

  // ── Actions dropdown for a document row ─────────────────────────────
  const DOC_ACTIONS = [
    { id: "upload", label: "Upload", icon: "upload" },
    { id: "edit", label: "Edit", icon: "pencil" },
    { id: "preview", label: "Preview", icon: "eye" },
    { id: "download", label: "Download", icon: "download" },
    { id: "share", label: "Share", icon: "share" },
    { id: "delete", label: "Delete", icon: "trash", danger: true },
  ];

  function DocActionsMenu({ onAction }) {
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const aRef = React.useRef(null), mRef = React.useRef(null);
    const place = () => { const r = aRef.current.getBoundingClientRect(); setPos({ top: r.bottom + 6, left: Math.max(8, r.right - 172) }); };
    React.useEffect(() => {
      if (!open) return;
      place();
      const onDown = (e) => { if (mRef.current && mRef.current.contains(e.target)) return; if (aRef.current && aRef.current.contains(e.target)) return; setOpen(false); };
      const onScroll = () => setOpen(false);
      document.addEventListener("mousedown", onDown);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onScroll); };
    }, [open]);
    return (
      <React.Fragment>
        <button ref={aRef} title="Actions" onClick={() => setOpen((o) => !o)} style={{
          border: "none", background: open ? "#EEF3F8" : "transparent", color: "#6D6C69", cursor: "pointer", padding: 6, borderRadius: 6,
        }}><I.dots size={20} /></button>
        {open && pos && ReactDOM.createPortal(
          <div ref={mRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: 172, zIndex: 95, background: "#fff", border: "1px solid #E3E9EE", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.16)", padding: 6 }}>
            {DOC_ACTIONS.map((a) => {
              const Ic = I[a.icon] || I.doc;
              return (
                <button key={a.id} onClick={() => { setOpen(false); onAction(a); }} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: "none", background: "transparent",
                  cursor: "pointer", borderRadius: 7, padding: "9px 11px", fontFamily: FONT, fontSize: 15, color: "#2E2D29",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = a.danger ? "#FDECEC" : "#F2F6FA"; e.currentTarget.style.color = a.danger ? "#B1040E" : "#2E2D29"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2E2D29"; }}>
                  <span>{a.label}</span>
                  <span style={{ color: "inherit", display: "grid", placeItems: "center", opacity: 0.85 }}><Ic size={17} /></span>
                </button>
              );
            })}
          </div>, document.body)}
      </React.Fragment>
    );
  }

  function DocumentsPage() {
    const [active, setActive] = React.useState("Document type");
    const [docs, setDocs] = React.useState(STUDY_DOCS);
    const [toast, setToast] = React.useState(null);
    const headerCell = { fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#2E2D29", padding: "14px 16px", textAlign: "left", whiteSpace: "nowrap" };
    const cell = { fontFamily: FONT, fontSize: 15.5, color: "#2E2D29", padding: "14px 16px", verticalAlign: "middle" };

    const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };
    const handleAction = (a, doc, i) => {
      if (a.id === "delete") { setDocs((list) => list.filter((_, idx) => idx !== i)); flash("Deleted " + doc.type); return; }
      const msg = {
        upload: "Upload a new version of " + doc.type,
        edit: "Editing " + doc.type,
        preview: "Opening preview of " + doc.type,
        download: "Downloading " + doc.type + "…",
        share: "Share link copied for " + doc.type,
      }[a.id];
      flash(msg);
    };

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
        <div style={{ padding: "36px 48px 56px", maxWidth: 1320 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 26px", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>Study Documents</h2>

          <button style={{
            display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff",
            background: "#006CB8", border: "none", borderRadius: 8, padding: "13px 22px", cursor: "pointer", marginBottom: 26,
          }}>Upload new document <I.upload size={18} /></button>

          {/* search + filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{ position: "relative", flex: "0 1 360px", minWidth: 260 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9aa3ab" }}><I.search size={18} /></span>
              <input placeholder="Search by protocol, title, or sponsor…" style={{
                width: "100%", boxSizing: "border-box", fontFamily: FONT, fontSize: 15, color: "#2E2D29",
                padding: "11px 12px 11px 40px", borderRadius: 999, border: "1.5px solid #C0C0BF", outline: "none",
              }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#2E2D29" }}>Filter by</span>
              {DOC_FILTERS.map((f) => {
                const on = active === f;
                return (
                  <button key={f} onClick={() => setActive(f)} style={{
                    fontFamily: FONT, fontSize: 14.5, cursor: "pointer", padding: "8px 16px", borderRadius: 999, transition: "all .12s",
                    border: on ? "1.5px solid #006CB8" : "1.5px solid #C7CDD2",
                    background: on ? "#006CB8" : "#fff", color: on ? "#fff" : "#2E2D29", fontWeight: on ? 600 : 500,
                  }}>{f}</button>
                );
              })}
            </div>
          </div>

          {/* table */}
          <div style={{ border: "1px solid #DCE3E9", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E3E9EE" }}>
                  <th style={headerCell}>Type</th>
                  <th style={headerCell}>Description</th>
                  <th style={headerCell}><SortHeader label="Received" sortable /></th>
                  <th style={headerCell}><SortHeader label="Expiration" sortable /></th>
                  <th style={headerCell}><SortHeader label="Received by" sortable /></th>
                  <th style={headerCell}><SortHeader label="Comments" sortable caretDown /></th>
                  <th style={{ ...headerCell, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d, i) => (
                  <tr key={d.type + i} style={{ borderTop: i ? "1px solid #EEF2F5" : "none" }}>
                    <td style={{ ...cell, fontWeight: 600 }}>{d.type}</td>
                    <td style={{ ...cell, color: "#6D6C69", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.desc}</td>
                    <td style={cell}>{d.received}</td>
                    <td style={cell}>{d.expires}</td>
                    <td style={cell}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
                        <span style={{ width: 28, height: 28, borderRadius: 28, background: "#006CB8", color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 12 }}>{initials(d.by)}</span>
                        {d.by}
                      </span>
                    </td>
                    <td style={cell}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: d.comment ? "#2E2D29" : "#9aa3ab" }}>
                        <span style={{ color: "#76746F" }}><I.comment size={18} /></span>
                        {d.comment && <span style={{ maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.comment}</span>}
                      </span>
                    </td>
                    <td style={{ ...cell, textAlign: "center" }}>
                      <DocActionsMenu onAction={(a) => handleAction(a, d, i)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {toast && (
          <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 90, background: "#2E2D29", color: "#fff", fontFamily: FONT, fontSize: 15, padding: "12px 22px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>{toast}</div>
        )}
      </div>
    );
  }

  window.RExPages = { OverviewPage, DocumentsPage };
})();
