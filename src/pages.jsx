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

          {/* Mascot + CTA — row layout, centered as a block */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 32, maxWidth: 640 }}>
              <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 120, height: "auto", flexShrink: 0 }} />
              <div>
                <p style={{ fontFamily: FONT, fontSize: 17, color: "#2E2D29", lineHeight: 1.65, margin: "0 0 22px" }}>
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

  // ── Study Documents ───────────────────────────────────────────────────

  const BLUE = "#006CB8";

  function SortHeader({ label, dir }) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
        {label}
        <span style={{ color: "#9aa3ab", display: "grid", placeItems: "center", transform: dir === "asc" ? "rotate(180deg)" : "none" }}>
          <I.chevron size={13} />
        </span>
      </span>
    );
  }

  // ── Docs page actions menu ────────────────────────────────────────────
  const DOC_ACTIONS = [
    { id: "upload",   label: "Upload",   icon: "upload" },
    { id: "preview",  label: "Preview",  icon: "eye" },
    { id: "download", label: "Download", icon: "download" },
    { id: "share",    label: "Share",    icon: "share" },
    { id: "delete",   label: "Delete",   icon: "trash", danger: true },
  ];

  function DocActionsMenu({ onAction }) {
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const aRef = React.useRef(null), mRef = React.useRef(null);
    const place = () => { const r = aRef.current.getBoundingClientRect(); setPos({ top: r.bottom + 6, left: Math.max(8, r.right - 160) }); };
    React.useEffect(() => {
      if (!open) return;
      place();
      const onDown = (e) => { if (mRef.current?.contains(e.target) || aRef.current?.contains(e.target)) return; setOpen(false); };
      const close = () => setOpen(false);
      document.addEventListener("mousedown", onDown);
      window.addEventListener("scroll", close, true);
      window.addEventListener("resize", close);
      return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("scroll", close, true); window.removeEventListener("resize", close); };
    }, [open]);
    return (
      <React.Fragment>
        <button ref={aRef} onClick={() => setOpen(o => !o)} style={{ border: "none", background: open ? "#EEF3F8" : "transparent", color: "#6D6C69", cursor: "pointer", padding: 6, borderRadius: 6 }}>
          <I.dots size={20} />
        </button>
        {open && pos && ReactDOM.createPortal(
          <div ref={mRef} style={{ position: "fixed", top: pos.top, left: pos.left, width: 160, zIndex: 200, background: "#fff", border: "1px solid #E3E9EE", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.16)", padding: 6 }}>
            {DOC_ACTIONS.map(a => {
              const Ic = I[a.icon] || I.doc;
              return (
                <button key={a.id} onClick={() => { setOpen(false); onAction(a); }} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", border: "none", background: "transparent", cursor: "pointer", borderRadius: 7, padding: "9px 11px", fontFamily: FONT, fontSize: 14.5, color: "#2E2D29" }}
                  onMouseEnter={e => { e.currentTarget.style.background = a.danger ? "#FDECEC" : "#F2F6FA"; e.currentTarget.style.color = a.danger ? "#B1040E" : "#2E2D29"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2E2D29"; }}>
                  <span>{a.label}</span>
                  <span style={{ color: "inherit", display: "grid", placeItems: "center", opacity: 0.85 }}><Ic size={16} /></span>
                </button>
              );
            })}
          </div>, document.body)}
      </React.Fragment>
    );
  }

  // ── Document detail child page ────────────────────────────────────────
  const MOCK_COMMENTS = [
    { id: 1, author: "Dean Amoroso", initials: "V", date: "6/15/26 9:00am",  text: "Lorem ipsum urna non enim ultrices quisque.", isMe: false },
    { id: 2, author: "You",          initials: "K", date: "6/18/26 8:00am",  text: "Lorem ipsum urna non enim ultrices quisque.", isMe: true },
    { id: 3, author: "Dean Amoroso", initials: "V", date: "6/22/26 10:00am", text: "Lorem ipsum urna non enim ultrices quisque.", hasAttachment: true, isMe: false },
  ];

  function DocDetailPage({ group, ver, onBack }) {
    const [reply, setReply] = React.useState("");
    const [comments, setComments] = React.useState(MOCK_COMMENTS);

    const sendReply = () => {
      if (!reply.trim()) return;
      setComments(prev => [...prev, { id: Date.now(), author: "You", initials: "K", date: "Just now", text: reply, isMe: true }]);
      setReply("");
    };

    const PROTOCOL_ROWS = [
      ["TITLE:", "A Phase II, Randomized, Double-Blind Crossover Study of Hypertena and Placebo in Participants with High Blood Pressure"],
      ["PROTOCOL NUMBER:", "HTN12345"],
      ["IND NUMBER:", "77777"],
      ["TEST PRODUCT:", "Hypertena"],
      ["VERSION NUMBER:", "1"],
      ["DATE PROTOCOL FINAL:", "Version 1: 14 June 2019"],
    ];
    const CONTACT_ROWS = [
      ["COORDINATING CENTER:", "Stanford University School of Medicine\n300 Pasteur Drive\nStanford, CA 94305"],
      ["PRINCIPAL INVESTIGATOR:", "Melinda Smith, M.D., Ph.D.\nStanford University School of Medicine\n300 Pasteur Drive, MC1234\nStanford, CA 94305\n(650) 415-6500\nmelsmith@stanford.edu"],
      ["BIOSTATISTICIAN:", "Abraham Welch, Ph.D.\nBiostatistics, Health Research and Policy\nabwelch@stanford.edu"],
    ];

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
        <div style={{ padding: "32px 48px 56px", maxWidth: 1320 }}>
          {/* Back */}
          <button onClick={onBack} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 15, color: BLUE, marginBottom: 22, padding: 0 }}>
            <span style={{ transform: "rotate(90deg)", display: "grid" }}><I.chevron size={16} /></span> Back to Documents
          </button>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: "#2E2D29", margin: 0 }}>{group.type} {ver.ver}</h2>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, padding: 0 }}><I.pencil size={20} /></button>
            </div>
            <button style={{ width: 44, height: 44, borderRadius: "50%", background: "#B1040E", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
              <I.sparkles size={20} />
            </button>
          </div>

          {/* Meta */}
          <p style={{ fontFamily: FONT, fontSize: 15.5, color: "#2E2D29", margin: "0 0 6px" }}>
            <span style={{ color: "#6D6C69" }}>[Description]</span> {ver.desc}
          </p>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#2E2D29", margin: "0 0 4px" }}><strong>Uploaded by:</strong>  {ver.by}</p>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#2E2D29", margin: "0 0 24px" }}><strong>Latest Version date:</strong>  {ver.versionDate} 10:00am</p>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, marginBottom: 30 }}>
            {["Upload revision", "Show version history"].map(label => (
              <button key={label} style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: BLUE, background: "#fff", border: "1.5px solid " + BLUE, borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}>{label}</button>
            ))}
          </div>

          {/* Viewer + comments */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
            {/* Doc viewer */}
            <div style={{ border: "1px solid #EAEAEA", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "10px 14px", display: "flex", justifyContent: "flex-end", gap: 10, borderBottom: "1px solid #F0F0F0", background: "#FAFAFA" }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6D6C69" }}><I.arrowUpRight size={18} /></button>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6D6C69" }}><I.download size={18} /></button>
              </div>
              <div style={{ padding: "28px 48px 48px", background: "#fff", fontFamily: "'Times New Roman', Georgia, serif", fontSize: 14, lineHeight: 1.6 }}>
                <div style={{ textAlign: "center", marginBottom: 28, fontWeight: 700, letterSpacing: 2, fontSize: 15 }}>PROTOCOL</div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
                  <tbody>
                    {PROTOCOL_ROWS.map(([k, v]) => (
                      <tr key={k} style={{ verticalAlign: "top" }}>
                        <td style={{ fontWeight: 700, paddingRight: 24, paddingBottom: 10, whiteSpace: "nowrap", width: 190 }}>{k}</td>
                        <td style={{ paddingBottom: 10 }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {CONTACT_ROWS.map(([k, v]) => (
                      <tr key={k} style={{ verticalAlign: "top" }}>
                        <td style={{ fontWeight: 700, paddingRight: 24, paddingBottom: 20, whiteSpace: "nowrap", width: 190 }}>{k}</td>
                        <td style={{ paddingBottom: 20 }}>
                          {v.split("\n").map((line, i, arr) => (
                            <React.Fragment key={i}>
                              {line.includes("@") ? <a href={"mailto:" + line} style={{ color: BLUE }}>{line}</a> : line}
                              {i < arr.length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ borderTop: "1px solid #ddd", marginTop: 28, paddingTop: 14, fontSize: 12, color: "#6D6C69" }}>
                  <u>Disclaimer:</u> The information in this protocol document is fictional and is only intended for training purposes. The information in this protocol is based on the fictional Cross-Over Study Design Example provided by ClinicalTrials.gov with additional elements provided by Clinical Research Quality.
                </div>
              </div>
            </div>

            {/* Comments panel */}
            <div style={{ border: "1px solid #EAEAEA", borderRadius: 12, display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: 700 }}>
              <div style={{ padding: "16px 18px 14px", fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#2E2D29", borderBottom: "1px solid #EAEAEA", flexShrink: 0 }}>Comments</div>
              <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 14 }}>
                {comments.map(c => (
                  <div key={c.id}>
                    <div style={{ fontFamily: FONT, fontSize: 12, color: "#9aa3ab", textAlign: "center", marginBottom: 8 }}>{c.date}</div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: c.isMe ? "flex-end" : "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                        <span style={{ width: 26, height: 26, borderRadius: "50%", background: c.isMe ? "#2E2D29" : BLUE, color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 11 }}>{c.initials}</span>
                        <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#2E2D29" }}>{c.author}</span>
                      </div>
                      <div style={{ maxWidth: "90%", background: c.isMe ? "#EFF6FF" : "#F8F9FA", border: "1px solid " + (c.isMe ? "#BFDBFE" : "#EAEAEA"), borderRadius: c.isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px", padding: "10px 14px", fontFamily: FONT, fontSize: 14, color: "#2E2D29", lineHeight: 1.5 }}>
                        {c.text}
                        {c.hasAttachment && <div style={{ marginTop: 8, color: "#6D6C69" }}><I.paperclip size={15} /></div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px 12px", borderTop: "1px solid #EAEAEA", flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #C0C0BF", borderRadius: 999, padding: "7px 10px 7px 14px" }}>
                  <span style={{ color: "#9aa3ab" }}><I.paperclip size={16} /></span>
                  <input value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => e.key === "Enter" && sendReply()} placeholder="Your reply"
                    style={{ flex: 1, border: "none", outline: "none", fontFamily: FONT, fontSize: 14, color: "#2E2D29", background: "transparent" }} />
                  <button onClick={sendReply} style={{ background: "none", border: "none", cursor: "pointer", color: reply.trim() ? BLUE : "#C0C0BF", padding: 0 }}>
                    <I.send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Upload New Document modal ─────────────────────────────────────────
  const DOC_TYPES = ["Research Manual", "IRB Protocol", "Budget Proposal", "Contract", "Protocol Amendment"];

  function UploadModal({ docGroups, onClose, onUploaded }) {
    const [step, setStep] = React.useState("amendment");
    const [isAmendment, setIsAmendment] = React.useState(null);
    const [amendTarget, setAmendTarget] = React.useState(null);
    const [docType, setDocType] = React.useState(null);
    const [file, setFile] = React.useState(null);
    const fileRef = React.useRef(null);

    const btnPrimary = { fontFamily: FONT, fontSize: 16, fontWeight: 600, padding: "13px 0", borderRadius: 8, background: BLUE, color: "#fff", border: "none", cursor: "pointer", flex: 1 };
    const btnOutline = { ...btnPrimary, background: "#fff", color: BLUE, border: "1.5px solid " + BLUE };
    const btnGhost   = { ...btnPrimary, background: "#fff", color: "#6D6C69", border: "1.5px solid #EAEAEA" };

    const selectionRow = (label, sub, isSelected, onClick) => (
      <button key={label} onClick={onClick} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "13px 16px", border: "1.5px solid " + (isSelected ? BLUE : "#EAEAEA"), borderRadius: 8, background: isSelected ? "#EFF6FF" : "#fff", cursor: "pointer", marginBottom: 8, textAlign: "left" }}>
        <div>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#2E2D29" }}>{label}</div>
          {sub && <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69", marginTop: 2 }}>{sub}</div>}
        </div>
        {isSelected && <span style={{ color: BLUE, flexShrink: 0 }}><I.check size={18} sw={2.5} /></span>}
      </button>
    );

    return ReactDOM.createPortal(
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", background: "#fff", borderRadius: 16, padding: "36px 40px", width: 520, maxWidth: "90vw", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", cursor: "pointer", color: "#9aa3ab", borderRadius: "50%", padding: 4 }}><I.x size={20} /></button>

          {/* Step: amendment? */}
          {step === "amendment" && (
            <>
              <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, color: "#2E2D29", margin: "0 0 10px" }}>Upload New Document</h3>
              <p style={{ fontFamily: FONT, fontSize: 16, color: "#6D6C69", margin: "0 0 28px", lineHeight: 1.5 }}>Is this document an amendment to an existing document?</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button style={btnPrimary} onClick={() => { setIsAmendment(true); setStep("pickAmend"); }}>Yes, it's an amendment</button>
                <button style={btnOutline} onClick={() => { setIsAmendment(false); setStep("docType"); }}>No, new document</button>
              </div>
            </>
          )}

          {/* Step: pick document to amend */}
          {step === "pickAmend" && (
            <>
              <button onClick={() => setStep("amendment")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, color: BLUE, padding: "0 0 18px" }}>
                <span style={{ transform: "rotate(90deg)", display: "grid" }}><I.chevron size={14} /></span> Back
              </button>
              <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 8px" }}>Which document are you amending?</h3>
              <p style={{ fontFamily: FONT, fontSize: 14.5, color: "#6D6C69", margin: "0 0 18px" }}>Select the document you'd like to upload an amendment for.</p>
              {docGroups.map(g => selectionRow(g.type, g.versions[0].ver + " — " + g.versions[0].desc, amendTarget?.id === g.id, () => { setAmendTarget(g); setStep("filePicker"); }))}
            </>
          )}

          {/* Step: choose doc type */}
          {step === "docType" && (
            <>
              <button onClick={() => setStep("amendment")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, color: BLUE, padding: "0 0 18px" }}>
                <span style={{ transform: "rotate(90deg)", display: "grid" }}><I.chevron size={14} /></span> Back
              </button>
              <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 8px" }}>What type of document?</h3>
              <p style={{ fontFamily: FONT, fontSize: 14.5, color: "#6D6C69", margin: "0 0 18px" }}>Choose the document type you're uploading.</p>
              {DOC_TYPES.map(t => selectionRow(t, null, docType === t, () => { setDocType(t); setStep("filePicker"); }))}
            </>
          )}

          {/* Step: file picker */}
          {step === "filePicker" && (
            <>
              <button onClick={() => setStep(isAmendment ? "pickAmend" : "docType")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 14, color: BLUE, padding: "0 0 18px" }}>
                <span style={{ transform: "rotate(90deg)", display: "grid" }}><I.chevron size={14} /></span> Back
              </button>
              <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 400, color: "#2E2D29", margin: "0 0 6px" }}>
                {isAmendment ? "Upload amendment" : "Upload " + docType}
              </h3>
              <p style={{ fontFamily: FONT, fontSize: 14.5, color: "#6D6C69", margin: "0 0 20px" }}>
                {isAmendment ? <>Amending: <strong style={{ color: "#2E2D29" }}>{amendTarget?.type}</strong></> : <>Document type: <strong style={{ color: "#2E2D29" }}>{docType}</strong></>}
              </p>

              <input ref={fileRef} type="file" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />

              {!file ? (
                <div onClick={() => fileRef.current.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]); }}
                  style={{ border: "2px dashed #C0C0BF", borderRadius: 12, padding: "44px 24px", textAlign: "center", cursor: "pointer", background: "#FAFAFA", marginBottom: 24 }}>
                  <div style={{ color: "#9aa3ab", marginBottom: 10 }}><I.upload size={32} /></div>
                  <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#2E2D29", marginBottom: 4 }}>Click to choose a file</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, color: "#6D6C69" }}>or drag and drop here</div>
                </div>
              ) : (
                <div style={{ border: "1.5px solid #EAEAEA", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, marginBottom: 24, background: "#FAFAFA" }}>
                  <span style={{ color: BLUE }}><I.doc size={28} /></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#2E2D29", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
                    <div style={{ fontFamily: FONT, fontSize: 13, color: "#6D6C69" }}>{(file.size / 1024).toFixed(1)} KB</div>
                  </div>
                  <button onClick={() => setFile(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa3ab" }}><I.trash size={16} /></button>
                </div>
              )}

              <div style={{ display: "flex", gap: 12 }}>
                <button style={btnGhost} onClick={onClose}>Cancel</button>
                <button style={{ ...btnPrimary, opacity: file ? 1 : 0.5, cursor: file ? "pointer" : "default" }}
                  onClick={() => { if (!file) { fileRef.current.click(); return; } onUploaded({ type: isAmendment ? amendTarget?.type : docType, file, isAmendment }); onClose(); }}>
                  Upload
                </button>
              </div>
            </>
          )}
        </div>
      </div>,
      document.body
    );
  }

  // ── Documents page hero ───────────────────────────────────────────────
  function DocHero({ onGuide }) {
    const [msg, setMsg] = React.useState("");
    return (
      <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "24px 28px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", marginBottom: 26, display: "flex", alignItems: "center", gap: 24 }}>
        <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 90, height: "auto", flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 400, color: "#2E2D29", margin: "0 0 8px", lineHeight: 1.3 }}>Let's explore your Documents</h3>
          <p style={{ fontFamily: FONT, fontSize: 15, color: "#2E2D29", margin: "0 0 10px", lineHeight: 1.55 }}>
            My name is RExI. You can ask me to do just about anything to get your study ready for activation. I'm here to make sure your studies are up-to-date and on track.
          </p>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29", margin: "0 0 14px" }}>I can help you organize and manage your tasks. Ask away!</p>
          <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 500 }}>
            <input type="text" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && msg.trim()) { if (onGuide) onGuide(); setMsg(""); } }} placeholder=""
              style={{ flex: 1, height: 44, border: "1.5px solid #C0C0BF", borderRadius: 999, padding: "0 18px", fontFamily: FONT, fontSize: 14.5, outline: "none", background: "#F8F8F8", color: "#2E2D29" }} />
            <button onClick={() => onGuide && onGuide()} style={{ width: 44, height: 44, borderRadius: "50%", background: "#B1040E", border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
              <I.sparkles size={19} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main documents list page ──────────────────────────────────────────
  function DocumentsPage({ onGuide }) {
    const [docGroups, setDocGroups] = React.useState(STUDY_DOCS);
    const [expanded, setExpanded] = React.useState(new Set());
    const [selected, setSelected] = React.useState(null); // { group, ver }
    const [showUpload, setShowUpload] = React.useState(false);
    const [activeFilter, setActiveFilter] = React.useState("Document type");
    const [toast, setToast] = React.useState(null);

    const flash = msg => { setToast(msg); setTimeout(() => setToast(null), 2500); };

    const toggleExpand = (id, e) => { e.stopPropagation(); setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; }); };

    const handleAction = (a, group, ver) => {
      if (a.id === "upload") { setSelected({ group, ver }); return; }
      if (a.id === "delete") {
        setDocGroups(prev => prev.map(g => g.id !== group.id ? g : { ...g, versions: g.versions.filter(v => v.ver !== ver.ver) }).filter(g => g.versions.length > 0));
        flash("Deleted " + ver.ver + " of " + group.type);
        return;
      }
      flash({ preview: "Opening " + group.type + " " + ver.ver, download: "Downloading…", share: "Share link copied" }[a.id] || a.label);
    };

    const H = { fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#2E2D29", padding: "12px 14px", textAlign: "left", background: "#FAFAFA", whiteSpace: "nowrap" };
    const C = { fontFamily: FONT, fontSize: 14.5, color: "#2E2D29", padding: "12px 14px", verticalAlign: "middle" };

    if (selected) {
      return <DocDetailPage group={selected.group} ver={selected.ver} onBack={() => setSelected(null)} />;
    }

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
        <div style={{ padding: "36px 48px 56px", maxWidth: 1320 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 22px", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>Study Documents</h2>

          <DocHero onGuide={onGuide} />

          <button onClick={() => setShowUpload(true)} style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: FONT, fontSize: 15.5, fontWeight: 700, color: "#fff", background: BLUE, border: "none", borderRadius: 8, padding: "13px 22px", cursor: "pointer", marginBottom: 22 }}>
            Upload new document <I.upload size={17} />
          </button>

          {/* search + filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
            <div style={{ position: "relative", flex: "0 1 340px", minWidth: 240 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9aa3ab" }}><I.search size={17} /></span>
              <input placeholder="Search by protocol, title, or sponsor…" style={{ width: "100%", boxSizing: "border-box", fontFamily: FONT, fontSize: 14.5, color: "#2E2D29", padding: "10px 12px 10px 38px", borderRadius: 999, border: "1.5px solid #C0C0BF", outline: "none" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 600, color: "#2E2D29" }}>Filter by</span>
              {DOC_FILTERS.map(f => {
                const on = activeFilter === f;
                return <button key={f} onClick={() => setActiveFilter(f)} style={{ fontFamily: FONT, fontSize: 14, cursor: "pointer", padding: "7px 14px", borderRadius: 999, border: on ? "1.5px solid " + BLUE : "1.5px solid #C7CDD2", background: on ? BLUE : "#fff", color: on ? "#fff" : "#2E2D29", fontWeight: on ? 600 : 500 }}>{f}</button>;
              })}
            </div>
          </div>

          {/* table */}
          <div style={{ border: "1px solid #DCE3E9", borderRadius: 10, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E3E9EE" }}>
                  <th style={{ ...H, width: 36 }} />
                  <th style={{ ...H, width: 90 }}>Version</th>
                  <th style={H}>Type</th>
                  <th style={H}>Description</th>
                  <th style={H}><SortHeader label="Version Date" dir="asc" /></th>
                  <th style={H}><SortHeader label="Date attached" dir="asc" /></th>
                  <th style={H}><SortHeader label="Comments" dir="desc" /></th>
                  <th style={{ ...H, textAlign: "center", width: 60 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {docGroups.map((group, gi) => {
                  const latest = group.versions[0];
                  const isOpen = expanded.has(group.id);
                  const subVersions = group.versions.slice(1);
                  return (
                    <React.Fragment key={group.id}>
                      {/* Latest version row */}
                      <tr onClick={() => setSelected({ group, ver: latest })}
                        style={{ borderTop: gi ? "1px solid #EEF2F5" : "none", cursor: "pointer", background: "#fff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F7FAFD"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                        <td style={{ ...C, textAlign: "center", padding: "10px 6px 10px 14px" }}>
                          {subVersions.length > 0 && (
                            <button onClick={e => toggleExpand(group.id, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6D6C69", padding: 2, display: "grid", placeItems: "center", transform: isOpen ? "none" : "rotate(-90deg)", transition: "transform .15s" }}>
                              <I.chevron size={14} />
                            </button>
                          )}
                        </td>
                        <td style={{ ...C, fontWeight: 700, color: BLUE }}>
                          {latest.ver}{subVersions.length > 0 ? <span style={{ fontWeight: 400, color: "#9aa3ab", fontSize: 13 }}> ({group.versions.length})</span> : ""}
                        </td>
                        <td style={{ ...C, fontWeight: 600 }}>{group.type}</td>
                        <td style={{ ...C, color: "#6D6C69", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{latest.desc}</td>
                        <td style={C}>{latest.versionDate}</td>
                        <td style={C}>{latest.dateAttached}</td>
                        <td style={C}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 26, height: 26, borderRadius: "50%", background: BLUE, color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials(latest.by)}</span>
                            {latest.comment && <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13.5, color: "#2E2D29" }}>{latest.comment}</span>}
                          </span>
                        </td>
                        <td style={{ ...C, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                          <DocActionsMenu onAction={a => handleAction(a, group, latest)} />
                        </td>
                      </tr>
                      {/* Expanded sub-version rows */}
                      {isOpen && subVersions.map((ver, vi) => (
                        <tr key={ver.ver} onClick={() => setSelected({ group, ver })}
                          style={{ borderTop: "1px solid #EEF2F5", background: "#FAFCFF", cursor: "pointer" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#EFF6FF"}
                          onMouseLeave={e => e.currentTarget.style.background = "#FAFCFF"}>
                          <td style={{ ...C, padding: "9px 6px 9px 14px" }} />
                          <td style={{ ...C, color: "#6D6C69", paddingLeft: 18 }}>{ver.ver}</td>
                          <td style={{ ...C, color: "#6D6C69" }}>{group.type}</td>
                          <td style={{ ...C, color: "#6D6C69", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ver.desc}</td>
                          <td style={{ ...C, color: "#6D6C69" }}>{ver.versionDate}</td>
                          <td style={{ ...C, color: "#6D6C69" }}>{ver.dateAttached}</td>
                          <td style={C}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#9aa3ab", color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{initials(ver.by)}</span>
                              {ver.comment && <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13.5, color: "#6D6C69" }}>{ver.comment}</span>}
                            </span>
                          </td>
                          <td style={{ ...C, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                            <DocActionsMenu onAction={a => handleAction(a, group, ver)} />
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {showUpload && <UploadModal docGroups={docGroups} onClose={() => setShowUpload(false)} onUploaded={({ type, file }) => { flash("Uploaded " + file.name); }} />}

        {toast && (
          <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 250, background: "#2E2D29", color: "#fff", fontFamily: FONT, fontSize: 15, padding: "12px 22px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>{toast}</div>
        )}
      </div>
    );
  }

  window.RExPages = { OverviewPage, DocumentsPage };
})();
