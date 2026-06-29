import React from 'react';
// admin-services.jsx — Research Administrative Services pages
(function () {
  const I = window.RExIcons;
  const FONT = "'Source Sans 3', sans-serif";
  const SERIF = "'Source Serif 4', Georgia, serif";
  const GREEN = "#1B7A5E";
  const BLUE = "#006CB8";
  const RED = "#B1040E";

  // ── Phase data ───────────────────────────────────────────────────────

  const BUDGET_PHASES = [
    { label: "Child intake",    pct: 100 },
    { label: "Assignment",      pct: 100 },
    { label: "In Review",       pct: 40  },
    { label: "Kickoff meeting", pct: 0   },
    { label: "Approval",        pct: 0   },
  ];

  const CONTRACT_PHASES = [
    { label: "Child intake",    pct: 100 },
    { label: "Assignment",      pct: 100 },
    { label: "In Review",       pct: 100 },
    { label: "Kickoff meeting", pct: 30  },
    { label: "Approval",        pct: 0   },
  ];

  const BUDGET_DETAIL_PHASES = [
    { label: "Child intake",    pct: 100 },
    { label: "Assignment",      pct: 28  },
    { label: "In Review",       pct: 8   },
    { label: "Kickoff meeting", pct: 0   },
    { label: "Approval",        pct: 0   },
  ];

  // ── Notifications data ───────────────────────────────────────────────

  const BUDGET_NOTIFS = [
    { type: "comment", text: "Dean Amoroso commented on Budget" },
    { type: "comment", text: "Anthea Buchin commented on Contract" },
    { type: "pencil",  text: "PSOS needs approval" },
    { type: "pencil",  text: "Protocol has been updated" },
  ];

  const CONTRACT_NOTIFS = [
    { type: "comment", text: "Lorem ipsum dolor sit amet consectetur." },
    { type: "comment", text: "Lorem ipsum dolor sit amet consectetur. Gravida." },
    { type: "pencil",  text: "Lorem ipsum potenti purus" },
    { type: "pencil",  text: "Lorem ipsum dui" },
  ];

  // ── Budget request history ───────────────────────────────────────────

  const BUDGET_REQUESTS = [
    {
      status: "Pending RSVP", statusColor: "#C05C0A",
      updated: "2026-04-20", icon: "calendar",
      title: "Schedule kick off meeting",
      newMsg: true, newComments: 0,
      actions: ["Upload docs", "Send a message", "Schedule meeting"],
      person: { name: "Anthea Buchin", role: "Staff Member", initials: "AB" },
      requestId: "REQ-94021",
    },
    {
      status: "Blocked", statusColor: "#B91C1C",
      updated: "2026-04-20", icon: "doc",
      title: "Contract ipsum dolor sit amet consectetur. In nulla cursus fringilla vitae. Ridiculus.",
      newMsg: false, newComments: 2,
      actions: ["Upload docs", "Send a message", "Signature needed"],
      person: { name: "Anthea Buchin", role: "Staff Member", initials: "AB" },
      requestId: "REQ-94021",
    },
    {
      status: "Pending message", statusColor: "#C05C0A",
      updated: "2026-04-20", icon: "mail",
      title: "Respond to coordinator ipsum dolor sit amet consectetur. In nulla cursus fringilla vitae. Ridiculus.",
      newMsg: false, newComments: 2,
      actions: ["Upload docs", "Send a message", "Signature needed"],
      person: { name: "Anthea Buchin", role: "Staff Member", initials: "AB" },
      requestId: "REQ-94021",
    },
  ];

  // ── Comments thread ──────────────────────────────────────────────────

  const COMMENT_THREAD = [
    { date: "6/15/26 9:00am",  author: "Dean Amoroso", initials: "V", color: "#006CB8", text: "Lorem ipsum urna non enim ultrices quisque." },
    { date: "6/22/26 10:00am", author: "You",          initials: "K", color: "#2D8C6B", text: "Lorem ipsum urna non enim ultrices quisque." },
    { date: "6/22/26 10:00am", author: "Dean Amoroso", initials: "V", color: "#006CB8", text: "Lorem ipsum urna non enim ultrices quisque.", attachment: true },
  ];

  // ── Shared helpers ───────────────────────────────────────────────────

  function PageTitleRow({ title }) {
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontFamily: FONT, fontSize: 30, color: "#2E2D29", margin: 0, fontWeight: 600 }}>
          {title}
        </h2>
        <button style={{
          width: 38, height: 38, borderRadius: "50%", background: RED,
          border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "#fff",
        }}>
          <I.sparkles size={18} />
        </button>
      </div>
    );
  }

  function PhaseProgressRow({ phases }) {
    return (
      <div>
        <div style={{ display: "flex", gap: 8, marginBottom: 5 }}>
          {phases.map((ph, i) => (
            <div key={i} style={{ flex: 1, fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#2E2D29", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {ph.label}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {phases.map((ph, i) => (
            <div key={i} style={{ flex: 1, height: 6, borderRadius: 99, background: "#E8ECEF", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 99, width: ph.pct + "%", background: GREEN }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function NotifList({ notifs, small }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: small ? 8 : 10 }}>
        {notifs.map((n, i) => {
          const Ic = n.type === "comment" ? I.comment : I.pencil;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontFamily: FONT, fontSize: small ? 13 : 14, color: "#2E2D29" }}>
              <span style={{ color: "#767674", flexShrink: 0, marginTop: 1 }}><Ic size={small ? 13 : 14} /></span>
              {n.text}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Research Admin Services landing ─────────────────────────────────

  function ServiceCard({ title, phases, notifs, onDetails }) {
    return (
      <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "22px 24px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#2E2D29" }}>{title}</span>
          <button onClick={onDetails} style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, padding: 0 }}>
            <I.arrowUpRight size={22} />
          </button>
        </div>
        <PhaseProgressRow phases={phases} />
        <div style={{ borderTop: "1px solid #F0F0F0", marginTop: 18, paddingTop: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <I.bolt size={17} />
            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700 }}>Notifications</span>
          </div>
          <NotifList notifs={notifs} />
          <button onClick={onDetails} style={{
            marginTop: 16, background: "none", border: "none", cursor: "pointer",
            fontFamily: FONT, fontSize: 14, color: BLUE, padding: 0,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            See more details <I.chevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  function ResearchAdminServicesPage({ onGuide, onBudget }) {
    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#F2F4F6" }}>
        <div style={{ padding: "28px 40px 56px" }}>
          <PageTitleRow title="Research Administrative Services" />

          {/* RExI intro card */}
          <div style={{
            background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12,
            padding: "22px 28px", marginBottom: 24, boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
            display: "flex", alignItems: "center", gap: 24,
          }}>
            <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 110, height: "auto", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: SERIF, fontSize: 22, fontWeight: 700, color: "#2E2D29", marginBottom: 8 }}>
                Start another Administrative requests.
              </div>
              <div style={{ fontFamily: FONT, fontSize: 15, color: "#2E2D29", marginBottom: 18 }}>
                There are services to unlock. I can help you unlock them. Or unlock it on your own.
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={onGuide} style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  fontFamily: FONT, fontSize: 15, fontWeight: 600,
                  color: "#B1040E", background: "#fff", border: "2px solid #B1040E",
                  borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                }}>
                  <I.sparkles size={16} /> Guide Me
                </button>
                <button style={{
                  fontFamily: FONT, fontSize: 15, fontWeight: 600,
                  color: "#2E2D29", background: "#fff", border: "1.5px solid #C0C0BF",
                  borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                }}>
                  Request a service
                </button>
                <button style={{
                  fontFamily: FONT, fontSize: 15, fontWeight: 500,
                  color: "#9aa3ab", background: "#F5F5F5", border: "1.5px solid #E8ECEF",
                  borderRadius: 8, padding: "9px 18px", cursor: "pointer",
                }}>
                  Unlock [service name]
                </button>
              </div>
            </div>
          </div>

          {/* Service cards grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <ServiceCard title="Budget request progress" phases={BUDGET_PHASES} notifs={BUDGET_NOTIFS} onDetails={onBudget} />
            <ServiceCard title="Contract request progress" phases={CONTRACT_PHASES} notifs={CONTRACT_NOTIFS} onDetails={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  // ── Research Admin Services — Budget detail ──────────────────────────

  function CommentsPanel({ onClose }) {
    const [reply, setReply] = React.useState("");
    return (
      <div style={{
        width: 300, flexShrink: 0,
        background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, boxShadow: "0 3px 6px rgba(0,0,0,0.08)",
        display: "flex", flexDirection: "column",
        alignSelf: "flex-start",
        position: "sticky", top: 0,
      }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #E8ECEF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700 }}>Comments</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#6D6C69", padding: 4 }}>
            <I.x size={18} />
          </button>
        </div>

        <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 18 }}>
          {COMMENT_THREAD.map((c, i) => {
            const isMe = c.author === "You";
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ fontFamily: FONT, fontSize: 11, color: "#9aa3ab", textAlign: isMe ? "right" : "left" }}>
                  {c.date}
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flexDirection: isMe ? "row-reverse" : "row" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: c.color, color: "#fff",
                    display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 11, flexShrink: 0,
                  }}>
                    {c.initials}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#2E2D29", marginBottom: 4, textAlign: isMe ? "right" : "left" }}>
                      {c.author}
                    </div>
                    <div style={{
                      background: isMe ? "#EEF5FC" : "#F5F5F5", borderRadius: 10,
                      padding: "9px 12px", fontFamily: FONT, fontSize: 13, color: "#2E2D29",
                    }}>
                      {c.text}
                      {c.attachment && <div style={{ marginTop: 6, color: BLUE }}><I.upload size={14} /></div>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid #E8ECEF" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F8F8F8", border: "1px solid #E0E0E0", borderRadius: 999, padding: "7px 12px",
          }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9aa3ab", padding: 0 }}>
              <I.upload size={15} />
            </button>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Your reply"
              style={{ flex: 1, background: "none", border: "none", fontFamily: FONT, fontSize: 13, outline: "none", color: "#2E2D29" }}
            />
            <button style={{ background: "none", border: "none", cursor: "pointer", color: BLUE, padding: 0 }}>
              <I.send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  function RequestCard({ req, onOpenComments }) {
    const Ic = I[req.icon] || I.doc;
    return (
      <div style={{ border: "1px solid #EAEAEA", borderRadius: 10, padding: "18px 20px", boxShadow: "0 2px 4px rgba(0,0,0,0.06)" }}>
        {/* Status + date */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#767674", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>STATUS</div>
            <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: req.statusColor }}>{req.status}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#767674", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>LAST UPDATED</div>
            <div style={{ fontFamily: FONT, fontSize: 14, color: "#2E2D29" }}>{req.updated}</div>
          </div>
        </div>

        {/* Icon + description + actions */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{ width: 46, height: 46, border: "1.5px solid #EAEAEA", borderRadius: 8, display: "grid", placeItems: "center", color: "#6D6C69", flexShrink: 0 }}>
            <Ic size={22} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: FONT, fontSize: 15, color: "#2E2D29", marginBottom: 6 }}>{req.title}</div>
            {req.newMsg && (
              <button onClick={onOpenComments} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: BLUE, padding: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
                New message <I.comment size={13} />
              </button>
            )}
            {req.newComments > 0 && (
              <button onClick={onOpenComments} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: BLUE, padding: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
                {req.newComments} new comments <I.comment size={13} />
              </button>
            )}
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, width: 152 }}>
            {req.actions.map((a, j) => (
              <button key={j} style={{
                fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "#2E2D29",
                background: "#fff", border: "1.5px solid #C0C0BF", borderRadius: 6,
                padding: "7px 10px", cursor: "pointer", textAlign: "center",
              }}>{a}</button>
            ))}
          </div>
        </div>

        {/* Footer: person + request ID */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, paddingTop: 12, borderTop: "1px solid #F0F0F0" }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "#767674", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>CURRENTLY WITH</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#2D8C6B", color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                {req.person.initials}
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#2E2D29" }}>{req.person.name}</div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: "#767674" }}>{req.person.role}</div>
              </div>
            </div>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: "#767674" }}>REQUEST ID: {req.requestId}</div>
        </div>
      </div>
    );
  }

  function ResearchAdminBudgetPage({ onGuide }) {
    const [commentsOpen, setCommentsOpen] = React.useState(false);

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#F2F4F6" }}>
        <div style={{ padding: "28px 40px 56px" }}>
          <PageTitleRow title="Research Administrative Services - Budget" />

          {/* Status card */}
          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "24px 28px", marginBottom: 24, boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", gap: 28 }}>
              {/* Left: mascot + stacked progress bars */}
              <div style={{ display: "flex", gap: 20, flex: 1, minWidth: 0 }}>
                <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 88, height: "auto", flexShrink: 0, alignSelf: "flex-start" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, color: "#2E2D29", marginBottom: 18 }}>
                    You're request is being processed and can be tracked here.
                  </div>
                  {BUDGET_DETAIL_PHASES.map((ph, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                      <div style={{ fontFamily: FONT, fontSize: 13, color: "#2E2D29", marginBottom: 4 }}>{ph.label}</div>
                      <div style={{ height: 7, borderRadius: 99, background: "#E8ECEF", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 99, width: ph.pct + "%", background: GREEN }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: notifications */}
              <div style={{ width: 220, flexShrink: 0, background: "#F8F9FA", border: "1px solid #E8ECEF", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                  <I.bolt size={17} />
                  <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700 }}>Notifications</span>
                </div>
                <NotifList notifs={BUDGET_NOTIFS} small />
                <button style={{ marginTop: 14, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, fontSize: 13, color: BLUE, padding: 0 }}>
                  See more details →
                </button>
              </div>
            </div>
          </div>

          {/* Budget Request History + inline Comments */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>

            {/* History card */}
            <div style={{ flex: 1, minWidth: 0, background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "22px 24px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <I.listLines size={20} />
                <span style={{ fontFamily: SERIF, fontSize: 20, fontWeight: 700, color: "#2E2D29" }}>Budget Request History</span>
              </div>

              {/* Search + filter row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ position: "relative", flex: 1, maxWidth: 380 }}>
                  <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#9aa3ab" }}><I.search size={16} /></span>
                  <input placeholder="Search by protocol, title, or sponsor..." style={{
                    width: "100%", boxSizing: "border-box",
                    fontFamily: FONT, fontSize: 14, color: "#2E2D29",
                    padding: "9px 12px 9px 34px", borderRadius: 999,
                    border: "1.5px solid #C0C0BF", outline: "none", background: "#FAFAF8",
                  }} />
                </div>
                <button style={{
                  fontFamily: FONT, fontSize: 14, color: "#2E2D29",
                  background: "#fff", border: "1.5px solid #C0C0BF",
                  borderRadius: 6, padding: "8px 14px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  Filter by <I.chevron size={14} />
                </button>
                <button style={{
                  fontFamily: FONT, fontSize: 14, color: BLUE,
                  background: "none", border: "none", cursor: "pointer", marginLeft: "auto",
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  View full history <I.arrowUpRight size={14} />
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {BUDGET_REQUESTS.map((req, i) => (
                  <RequestCard key={i} req={req} onOpenComments={() => setCommentsOpen(true)} />
                ))}
              </div>
            </div>

            {/* Inline comments column */}
            {commentsOpen && <CommentsPanel onClose={() => setCommentsOpen(false)} />}
          </div>
        </div>
      </div>
    );
  }

  window.RExAdminServices = { ResearchAdminServicesPage, ResearchAdminBudgetPage };
})();
