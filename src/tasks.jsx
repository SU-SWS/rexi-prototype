import React from 'react';
import ReactDOM from 'react-dom/client';
// tasks.jsx — Study Tasks: at-risk hero, kanban board (group-by), table view
(function () {
  const I = window.RExIcons;
  const { FONT } = window.RExFields;
  const { TASKS, ATRISK_TOP, TASK_GROUPBY, TASK_COLUMNS, PRIORITY_META, STATUS_META, TASK_TODAY } = window.RExData;
  const SERIF = "'Source Serif 4', Georgia, serif";
  const ME = "Dean Amoroso";

  function fmtDate(iso) {
    if (!iso) return "";
    try { return new Date(iso + "T00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return iso; }
  }
  function dateBucket(iso) {
    if (!iso) return "No Date";
    if (iso < TASK_TODAY) return "Past";
    if (iso === TASK_TODAY) return "Today";
    return "Upcoming";
  }
  function groupKey(task, by) {
    if (by === "date") return dateBucket(task.date);
    if (by === "assignee") return task.assignee || "";
    return task[by];
  }
  function colLabel(by, key) {
    if (by === "assignee" && key === "") return "Unassigned";
    return key;
  }

  const ASSIGNEES = ["", "Central Services", "Anthea Buchin", "Kat Velasquez", "Dean Amoroso"];

  function initialsOf(name) {
    return name.replace(/,.*$/, "").split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }
  function Avatar({ name, size = 22 }) {
    if (!name) return <span style={{ width: size, height: size, borderRadius: size, border: "1.5px dashed #C0C0BF", color: "#9aa3ab", display: "grid", placeItems: "center" }}><I.user size={size * 0.62} /></span>;
    return <span style={{
      width: size, height: size, borderRadius: size, background: name === "Central Services" ? "#B1040E" : "#006CB8",
      color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: size * 0.42, flexShrink: 0,
    }}>{name === "Central Services" ? "Rx" : initialsOf(name)}</span>;
  }

  // Generic dropdown that portals its menu to <body> with fixed positioning
  // (so it never gets clipped by a scroll container or card). Clicking the
  // anchor stops propagation so an underlying card/row click won't fire.
  function Dropdown({ button, children, minW = 200, align = "left" }) {
    const [open, setOpen] = React.useState(false);
    const [pos, setPos] = React.useState(null);
    const aRef = React.useRef(null), mRef = React.useRef(null);
    const place = () => {
      const r = aRef.current.getBoundingClientRect();
      const left = align === "right" ? r.right - minW : r.left;
      setPos({ top: r.bottom + 5, left: Math.max(8, left), minWidth: Math.max(minW, r.width) });
    };
    React.useEffect(() => {
      if (!open) return;
      place();
      const onDown = (e) => {
        if (mRef.current && mRef.current.contains(e.target)) return;
        if (aRef.current && aRef.current.contains(e.target)) return;
        setOpen(false);
      };
      const onScroll = () => setOpen(false);
      document.addEventListener("mousedown", onDown);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => { document.removeEventListener("mousedown", onDown); window.removeEventListener("scroll", onScroll, true); window.removeEventListener("resize", onScroll); };
    }, [open]);
    return (
      <React.Fragment>
        <span ref={aRef} onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }} style={{ display: "inline-flex" }}>
          {button(open)}
        </span>
        {open && pos && ReactDOM.createPortal(
          <div ref={mRef} onClick={(e) => e.stopPropagation()} style={{
            position: "fixed", top: pos.top, left: pos.left, minWidth: pos.minWidth, zIndex: 95,
            background: "#fff", border: "1px solid #E3E9EE", borderRadius: 10, boxShadow: "0 12px 30px rgba(0,0,0,0.18)", padding: 6,
          }}>{children(() => setOpen(false))}</div>,
          document.body)}
      </React.Fragment>
    );
  }

  // Inline "reassign" control used on cards and table rows
  function InlineAssignee({ value, onChange, subtle }) {
    return (
      <Dropdown minW={210} button={() => (
        <button title="Reassign" style={{
          display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "transparent", cursor: "pointer",
          padding: "2px 4px", borderRadius: 6, fontFamily: FONT, fontSize: 13.5, color: value ? "#2E2D29" : "#9aa3ab",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#EEF3F8"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <Avatar name={value} size={subtle ? 20 : 22} />
          <span style={{ whiteSpace: "nowrap" }}>{value || "Unassigned"}</span>
          <span style={{ color: "#9aa3ab", display: "grid", placeItems: "center" }}><I.chevron size={13} /></span>
        </button>
      )}>
        {(close) => ASSIGNEES.map((a) => {
          const on = a === value;
          return (
            <button key={a || "un"} onClick={() => { onChange(a); close(); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", border: "none", cursor: "pointer",
              background: on ? "rgba(1,97,165,0.10)" : "transparent", borderRadius: 7, padding: "9px 10px",
              fontFamily: FONT, fontSize: 14.5, color: "#2E2D29", fontWeight: on ? 600 : 400,
            }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(1,97,165,0.05)"; }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
              <Avatar name={a} size={24} /> {a || "Unassigned"}
              {on && <span style={{ marginLeft: "auto", color: "#006CB8" }}><I.check size={16} sw={2.4} /></span>}
            </button>
          );
        })}
      </Dropdown>
    );
  }

  // Inline due-date control used on cards and table rows
  function InlineDate({ value, dateType, onPatch, subtle }) {
    return (
      <Dropdown minW={250} align="right" button={() => (
        <button title="Change date" style={{
          display: "inline-flex", alignItems: "center", gap: 5, border: "none", background: "transparent", cursor: "pointer",
          padding: "2px 4px", borderRadius: 6, fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color: value ? "#2E2D29" : "#9aa3ab",
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = "#EEF3F8"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          <span style={{ color: "#76746F" }}><I.calendar size={15} /></span>
          <span style={{ whiteSpace: "nowrap" }}>{value ? `${dateType}: ${fmtDate(value)}` : "Set date"}</span>
        </button>
      )}>
        {(close) => (
          <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#76746F" }}>Schedule</div>
            <select value={dateType} onChange={(e) => onPatch({ dateType: e.target.value })} style={{ ...inputStyle, cursor: "pointer", padding: "8px 10px" }}>
              <option>Due</option><option>Start by</option>
            </select>
            <input type="date" value={value || ""} onChange={(e) => onPatch({ date: e.target.value })} style={{ ...inputStyle, padding: "8px 10px" }} />
            <button onClick={close} style={{ alignSelf: "flex-end", border: "none", background: "#006CB8", color: "#fff", borderRadius: 7, padding: "7px 16px", cursor: "pointer", fontFamily: FONT, fontSize: 13.5, fontWeight: 700 }}>Done</button>
          </div>
        )}
      </Dropdown>
    );
  }

  // ── Chart constants ────────────────────────────────────────────────
  const CHART_COLORS = {
    "Not Started": "#F4A261",
    "In Progress": "#FAD5A5",
    "Late":        "#C53030",
    "Completed":   "#279989",
  };
  const CHART_ORDER = ["Not Started", "In Progress", "Late", "Completed"];
  const CHART_FONT  = "’Source Sans 3’, sans-serif";

  function polarXY(cx, cy, r, deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }
  function donutArc(cx, cy, inner, outer, startDeg, endDeg) {
    const sweep = Math.min(endDeg - startDeg, 359.9);
    const end = startDeg + sweep;
    const [sx, sy] = polarXY(cx, cy, outer, startDeg);
    const [ex, ey] = polarXY(cx, cy, outer, end);
    const [ix, iy] = polarXY(cx, cy, inner, startDeg);
    const [ox, oy] = polarXY(cx, cy, inner, end);
    const lg = sweep > 180 ? 1 : 0;
    return `M${sx},${sy} A${outer},${outer} 0 ${lg},1 ${ex},${ey} L${ox},${oy} A${inner},${inner} 0 ${lg},0 ${ix},${iy} Z`;
  }

  // ── Status donut chart ─────────────────────────────────────────────
  function TaskStatusDonut({ tasks }) {
    const counts = { "Not Started": 0, "In Progress": 0, "Late": 0, "Completed": 0 };
    tasks.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++; });
    const total = tasks.length || 1;
    const remaining = tasks.length - counts["Completed"];
    const CX = 95, CY = 95, OUTER = 78, INNER = 52, GAP = 2;
    let angle = 0;
    const slices = CHART_ORDER.reduce((acc, s) => {
      if (!counts[s]) return acc;
      const sweep = (counts[s] / total) * 360;
      acc.push({ s, start: angle + GAP / 2, end: angle + sweep - GAP / 2 });
      angle += sweep;
      return acc;
    }, []);
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <svg width={190} height={190} viewBox="0 0 190 190">
          {!tasks.length ? (
            <circle cx={CX} cy={CY} r={65} fill="none" stroke="#EAEAEA" strokeWidth={26} />
          ) : slices.map(sl => (
            <path key={sl.s} d={donutArc(CX, CY, INNER, OUTER, sl.start, sl.end)} fill={CHART_COLORS[sl.s]} />
          ))}
          <text x={CX} y={CY - 4} textAnchor="middle" style={{ fontFamily: CHART_FONT, fontSize: 28, fontWeight: 700 }} fill="#2E2D29">{remaining}</text>
          <text x={CX} y={CY + 18} textAnchor="middle" style={{ fontFamily: CHART_FONT, fontSize: 13 }} fill="#6D6C69">Tasks left</text>
        </svg>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 14px" }}>
          {CHART_ORDER.map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[s], flexShrink: 0 }} />
              <span style={{ fontFamily: CHART_FONT, fontSize: 12, color: "#6D6C69" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Members stacked bar chart ──────────────────────────────────────
  function MembersBarChart({ tasks }) {
    const dataMap = {};
    tasks.forEach(t => {
      const a = t.assignee || "Unassigned";
      if (!dataMap[a]) dataMap[a] = { "Not Started": 0, "In Progress": 0, "Late": 0, "Completed": 0 };
      if (dataMap[a][t.status] !== undefined) dataMap[a][t.status]++;
    });
    const rows = Object.entries(dataMap)
      .map(([name, counts]) => ({ name, counts, total: CHART_ORDER.reduce((s, k) => s + counts[k], 0) }))
      .filter(r => r.total > 0)
      .sort((a, b) => b.total - a.total);
    if (!rows.length) return null;
    const maxTotal = Math.max(...rows.map(r => r.total));
    const chartMax = Math.max(Math.ceil(maxTotal / 2) * 2, 2);
    const ticks = Array.from({ length: 4 }, (_, i) => Math.round((i * chartMax) / 3));
    const LW = 110, ROW_H = 26, ROW_GAP = 18, AX_H = 26, W = 600, BW = W - LW;
    const H = rows.length * (ROW_H + ROW_GAP) + AX_H;
    return (
      <div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible", display: "block" }}>
          {ticks.map((v, i) => {
            const x = LW + (v / chartMax) * BW;
            return (
              <g key={i}>
                <line x1={x} y1={0} x2={x} y2={H - AX_H} stroke="#EAEAEA" strokeWidth={0.5} />
                <text x={x} y={H - 6} textAnchor="middle" style={{ fontFamily: CHART_FONT, fontSize: 12 }} fill="#6D6C69">{v}</text>
              </g>
            );
          })}
          {rows.map((row, ri) => {
            const y = ri * (ROW_H + ROW_GAP);
            const segs = [];
            let bx = LW;
            CHART_ORDER.forEach(s => {
              if (!row.counts[s]) return;
              const w = Math.max(2, (row.counts[s] / chartMax) * BW);
              segs.push({ s, x: bx, w });
              bx += w;
            });
            const parts = row.name.split(" ");
            const midY = y + ROW_H / 2 + 4;
            return (
              <g key={row.name}>
                {parts.length === 1 ? (
                  <text x={LW - 8} y={midY} textAnchor="end" style={{ fontFamily: CHART_FONT, fontSize: 13 }} fill="#2E2D29">{row.name}</text>
                ) : parts.map((p, pi) => (
                  <text key={pi} x={LW - 8} y={y + ROW_H / 2 + (pi - (parts.length - 1) / 2) * 15 + 4} textAnchor="end" style={{ fontFamily: CHART_FONT, fontSize: 13 }} fill="#2E2D29">{p}</text>
                ))}
                {segs.map(seg => (
                  <rect key={seg.s} x={seg.x} y={y} width={seg.w} height={ROW_H} fill={CHART_COLORS[seg.s]} />
                ))}
              </g>
            );
          })}
        </svg>
        <div style={{ display: "flex", gap: 20, marginTop: 10, paddingLeft: 110 }}>
          {CHART_ORDER.map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[s], flexShrink: 0 }} />
              <span style={{ fontFamily: CHART_FONT, fontSize: 13, color: "#6D6C69" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Task board dashboard hero ──────────────────────────────────────
  function TasksDashboard({ tasks, onGuide }) {
    const [msg, setMsg] = React.useState("");
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: 16 }}>
          {/* Intro card */}
          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "28px 32px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 18 }}>
              <img src="assets/rexi-mascot.png" alt="RExI" style={{ width: 110, height: "auto", flexShrink: 0 }} />
              <h3 style={{ fontFamily: SERIF, fontSize: 30, color: "#2E2D29", margin: 0, fontWeight: 400, lineHeight: 1.3 }}>
                Let’s explore your Task Board
              </h3>
            </div>
            <p style={{ fontFamily: FONT, fontSize: 16, color: "#2E2D29", lineHeight: 1.6, margin: "0 0 16px" }}>
              My name is RExI. You can ask me to do just about anything to get your study ready for activation. I’m here to make sure your studies are up-to-date and on track.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#2E2D29", margin: "0 0 18px", lineHeight: 1.5 }}>
              I can help you organize and manage your tasks.<br />How can I help?
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="text"
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && msg.trim()) { if (onGuide) onGuide(); setMsg(""); } }}
                placeholder=""
                style={{
                  flex: 1, height: 48, border: "1.5px solid #C0C0BF", borderRadius: 999,
                  padding: "0 20px", fontFamily: FONT, fontSize: 15, outline: "none",
                  background: "#F8F8F8", color: "#2E2D29",
                }}
              />
              <button onClick={() => onGuide && onGuide()} style={{
                width: 48, height: 48, borderRadius: "50%", background: "#B1040E",
                border: "none", cursor: "pointer", display: "grid", placeItems: "center", color: "#fff", flexShrink: 0,
              }}>
                <I.sparkles size={20} />
              </button>
            </div>
          </div>
          {/* Status donut */}
          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "22px 24px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
            <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29", marginBottom: 10 }}>Status</div>
            <TaskStatusDonut tasks={tasks} />
          </div>
        </div>
        {/* Members bar chart */}
        <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 12, padding: "22px 28px", boxShadow: "0 3px 6px rgba(0,0,0,0.08)" }}>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#2E2D29", marginBottom: 14 }}>Members</div>
          <MembersBarChart tasks={tasks} />
        </div>
      </div>
    );
  }

  // ── Board card ──────────────────────────────────────────────────────
  function TaskCard({ t, showAssignee, onOpen, onQuick }) {
    const pri = PRIORITY_META[t.priority] || { color: "#C0C0BF" };
    const st = STATUS_META[t.status] || { color: "#76746F" };
    return (
      <div onClick={() => onOpen && onOpen(t)} style={{
        background: "#fff", border: "1px solid #E3E3E1", borderLeft: "4px solid " + pri.color, borderRadius: 6,
        padding: "13px 15px", cursor: "pointer", transition: "box-shadow .12s",
      }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 3px 12px rgba(0,0,0,0.10)"}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
          <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#0A0A0A", lineHeight: 1.2 }}>{t.title}</span>
          <span style={{ fontFamily: FONT, fontSize: 13, color: st.color, whiteSpace: "nowrap", flexShrink: 0 }}>{t.status}</span>
        </div>
        <p style={{ fontFamily: FONT, fontSize: 14, color: "#76746F", margin: "0 0 12px", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t.desc}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#76746F", marginBottom: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><I.comment size={17} />{t.comments > 0 && <span style={{ fontFamily: FONT, fontSize: 13 }}>{t.comments}</span>}</span>
          {t.attachments > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><I.paperclip size={15} /><span style={{ fontFamily: FONT, fontSize: 13 }}>{t.attachments}</span></span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {showAssignee
            ? <InlineAssignee value={t.assignee} subtle onChange={(v) => onQuick(t.id, { assignee: v })} />
            : <span />}
          <InlineDate value={t.date} dateType={t.dateType} subtle onPatch={(p) => onQuick(t.id, p)} />
        </div>
      </div>
    );
  }

  function Column({ by, colKey, tasks, onOpen, onQuick }) {
    const [expanded, setExpanded] = React.useState(false);
    const CAP = 5;
    const shown = expanded ? tasks : tasks.slice(0, CAP);
    return (
      <div style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{
          background: "#EDEDEC", borderRadius: "8px 8px 0 0", padding: "13px 16px",
          fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#2E2D29",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{colLabel(by, colKey)}</span>
          <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#76746F" }}>{tasks.length}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 4px 0" }}>
          {shown.map((t) => <TaskCard key={t.id} t={t} showAssignee={by !== "assignee"} onOpen={onOpen} onQuick={onQuick} />)}
          {tasks.length === 0 && (
            <div style={{ fontFamily: FONT, fontSize: 14, color: "#9aa3ab", padding: "18px 12px", textAlign: "center" }}>No tasks</div>
          )}
          {tasks.length > CAP && (
            <button onClick={() => setExpanded((v) => !v)} style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%",
              border: "none", background: "transparent", color: "#006CB8", fontFamily: FONT, fontSize: 15, fontWeight: 600,
              cursor: "pointer", padding: "10px 0 16px",
            }}>
              {expanded ? "Show less" : "Load more"} <span style={{ transform: expanded ? "rotate(180deg)" : "none", display: "grid", placeItems: "center" }}><I.chevron size={16} /></span>
            </button>
          )}
        </div>
      </div>
    );
  }

  function Board({ by, tasks, onOpen, onQuick }) {
    const cols = TASK_COLUMNS[by] || [];
    return (
      <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 12 }}>
        {cols.map((key) => (
          <Column key={key} by={by} colKey={key} tasks={tasks.filter((t) => groupKey(t, by) === key)} onOpen={onOpen} onQuick={onQuick} />
        ))}
      </div>
    );
  }

  // ── Simplified table view ───────────────────────────────────────────
  function Pill({ text, color, soft }) {
    return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 13.5, fontWeight: 600, color, background: soft, borderRadius: 999, padding: "4px 11px" }}>
      <span style={{ width: 7, height: 7, borderRadius: 7, background: color }} /> {text}
    </span>;
  }

  function TableView({ tasks, onOpen, onQuick }) {
    const head = { fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#2E2D29", padding: "13px 16px", textAlign: "left", whiteSpace: "nowrap" };
    const cell = { fontFamily: FONT, fontSize: 15, color: "#2E2D29", padding: "13px 16px", verticalAlign: "middle" };
    return (
      <div style={{ border: "1px solid #DCE3E9", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #E3E9EE", background: "#F7F9FB" }}>
              <th style={head}>Task</th>
              <th style={head}>Status</th>
              <th style={head}>Priority</th>
              <th style={head}>Assigned to</th>
              <th style={head}>Due / Start</th>
              <th style={{ ...head, textAlign: "center" }}>Activity</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const pri = PRIORITY_META[t.priority] || {};
              const st = STATUS_META[t.status] || {};
              return (
                <tr key={t.id} onClick={() => onOpen && onOpen(t)} style={{ borderTop: i ? "1px solid #EEF2F5" : "none", borderLeft: "4px solid " + pri.color, cursor: "pointer" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F7FAFC"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ ...cell, fontWeight: 600, maxWidth: 320 }}>{t.title}</td>
                  <td style={cell}><span style={{ display: "inline-flex", alignItems: "center", gap: 7, color: st.color, fontFamily: FONT, fontSize: 14, fontWeight: 600 }}><span style={{ width: 8, height: 8, borderRadius: 8, background: st.dot }} /> {t.status}</span></td>
                  <td style={cell}><Pill text={t.priority} color={pri.color} soft={pri.soft} /></td>
                  <td style={cell} onClick={(e) => e.stopPropagation()}>
                    <InlineAssignee value={t.assignee} onChange={(v) => onQuick(t.id, { assignee: v })} />
                  </td>
                  <td style={cell} onClick={(e) => e.stopPropagation()}>
                    <InlineDate value={t.date} dateType={t.dateType} onPatch={(p) => onQuick(t.id, p)} />
                  </td>
                  <td style={{ ...cell, textAlign: "center" }}><ActivityCell t={t} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // comment + attachment indicators, with a notification dot for unread activity
  function ActivityCell({ t }) {
    const hasC = t.comments > 0, hasA = t.attachments > 0;
    if (!hasC && !hasA) return <span style={{ color: "#C7CDD2" }}>—</span>;
    const Item = ({ icon, n, label }) => (
      <span title={n + " " + label + (n === 1 ? "" : "s")} style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#53565A" }}>
        {icon} <span style={{ fontFamily: FONT, fontSize: 13.5, fontWeight: 600 }}>{n}</span>
      </span>
    );
    return (
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 14 }}>
        {hasC && <Item icon={<I.comment size={17} />} n={t.comments} label="comment" />}
        {hasA && <Item icon={<I.paperclip size={16} />} n={t.attachments} label="attachment" />}
        {t.unread && (
          <span title="New activity" style={{
            position: "absolute", top: -5, right: -9, width: 9, height: 9, borderRadius: 9,
            background: "#E50808", border: "2px solid #fff", boxShadow: "0 0 0 1px #E50808",
          }} />
        )}
      </span>
    );
  }

  // ── Group-by dropdown ───────────────────────────────────────────────
  function GroupByMenu({ value, onChange }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
    }, []);
    const current = TASK_GROUPBY.find((g) => g.id === value);
    return (
      <div ref={ref} style={{ position: "relative" }}>
        <button onClick={() => setOpen((v) => !v)} style={{
          display: "flex", alignItems: "center", gap: 8, border: "none", background: "transparent", cursor: "pointer",
          fontFamily: FONT, fontSize: 15, color: "#2E2D29", padding: "4px 0",
        }}>
          <span style={{ color: "#53565A" }}><I.listLines size={20} /></span>
          <span style={{ fontWeight: 600, letterSpacing: ".3px" }}>GROUP BY: {current ? current.label : value}</span>
          <span style={{ transform: open ? "rotate(180deg)" : "none", display: "grid", placeItems: "center", color: "#53565A" }}><I.chevron size={16} /></span>
        </button>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 30, minWidth: 200, background: "#fff",
            border: "1px solid #E3E9EE", borderRadius: 10, boxShadow: "0 8px 26px rgba(0,0,0,0.14)", padding: 6,
          }}>
            {TASK_GROUPBY.map((g) => {
              const Ic = I[g.icon] || I.tag;
              const on = g.id === value;
              return (
                <button key={g.id} onClick={() => { onChange(g.id); setOpen(false); }} style={{
                  display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", border: "none", cursor: "pointer",
                  background: on ? "rgba(1,97,165,0.10)" : "transparent", borderRadius: 7, padding: "10px 12px",
                  fontFamily: FONT, fontSize: 15.5, color: "#2E2D29", fontWeight: on ? 600 : 400,
                }}
                  onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = "rgba(1,97,165,0.05)"; }}
                  onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                  <span style={{ color: "#53565A", display: "grid", placeItems: "center" }}><Ic size={19} /></span>
                  {g.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  function Segmented({ view, setView }) {
    const Btn = ({ id, icon, label }) => {
      const on = view === id;
      return (
        <button onClick={() => setView(id)} style={{
          display: "flex", alignItems: "center", gap: 7, fontFamily: FONT, fontSize: 15, fontWeight: 600, cursor: "pointer",
          padding: "8px 16px", border: "1.5px solid #006CB8", borderRadius: id === "board" ? "8px 0 0 8px" : "0 8px 8px 0",
          marginLeft: id === "table" ? -1.5 : 0,
          background: on ? "#006CB8" : "#fff", color: on ? "#fff" : "#006CB8",
        }}>{icon} {label}</button>
      );
    };
    return (
      <div style={{ display: "flex" }}>
        <Btn id="board" icon={<I.board size={18} />} label="Board" />
        <Btn id="table" icon={<I.tablev size={18} />} label="Table" />
      </div>
    );
  }

  // ── Task edit modal ─────────────────────────────────────────────────
  function MField({ label, children }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#2E2D29" }}>{label}</label>
        {children}
      </div>
    );
  }
  const inputStyle = { width: "100%", boxSizing: "border-box", fontFamily: FONT, fontSize: 15.5, color: "#2E2D29", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #C0C0BF", outline: "none", background: "#fff" };
  function MSelect({ value, onChange, options, render }) {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
        {options.map((o) => <option key={o} value={o}>{render ? render(o) : o}</option>)}
      </select>
    );
  }

  // file kind → icon + accent
  const FILE_KIND = {
    pdf:   { icon: "doc",   color: "#C8102E", label: "PDF" },
    doc:   { icon: "doc",   color: "#0A5A99", label: "DOC" },
    sheet: { icon: "table", color: "#1f8a4d", label: "XLS" },
  };

  function FilePreview({ file, onClose }) {
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
      document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h);
    }, []);
    const k = FILE_KIND[file.kind] || FILE_KIND.doc;
    const Ic = I[k.icon] || I.doc;
    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 90, background: "rgba(10,20,30,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 560, maxHeight: "88vh", background: "#fff", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 26px 64px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: "1px solid #E3E9EE" }}>
            <span style={{ color: k.color }}><Ic size={22} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
              <div style={{ fontFamily: FONT, fontSize: 13, color: "#76746F" }}>{k.label} · {file.size}</div>
            </div>
            <button title="Download" style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1.5px solid #006CB8", background: "#fff", color: "#006CB8", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontFamily: FONT, fontSize: 13.5, fontWeight: 600 }}><I.download size={16} /> Download</button>
            <button onClick={onClose} style={{ border: "none", background: "transparent", color: "#53565A", cursor: "pointer", padding: 4 }}><I.x size={22} /></button>
          </div>
          {/* faux document page */}
          <div style={{ flex: 1, overflowY: "auto", background: "#F1F4F7", padding: 22 }}>
            <div style={{ background: "#fff", borderRadius: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.12)", padding: "34px 36px", minHeight: 360 }}>
              <div style={{ display: "inline-block", fontFamily: FONT, fontSize: 11, fontWeight: 700, color: k.color, border: "1px solid " + k.color, borderRadius: 4, padding: "2px 7px", marginBottom: 18 }}>{k.label} PREVIEW</div>
              {file.kind === "sheet" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#D7DEE4", border: "1px solid #D7DEE4" }}>
                  {Array.from({ length: 28 }).map((_, i) => (
                    <div key={i} style={{ background: i < 4 ? "#EEF3F8" : "#fff", height: 26, display: "flex", alignItems: "center", padding: "0 8px" }}>
                      <span style={{ width: i < 4 ? "70%" : (40 + (i * 13) % 50) + "%", height: 7, borderRadius: 3, background: i < 4 ? "#9DB4C6" : "#E3E9EE" }} />
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  <div style={{ width: "62%", height: 16, borderRadius: 4, background: "#D7DEE4" }} />
                  <div style={{ height: 8 }} />
                  {[100, 96, 99, 88, 0, 94, 100, 91, 70].map((w, i) => (
                    <div key={i} style={{ width: w ? w + "%" : 0, height: 9, borderRadius: 3, background: "#EAEEF2", marginTop: w ? 0 : 8 }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ textAlign: "center", fontFamily: FONT, fontSize: 13, color: "#9aa3ab", marginTop: 14 }}>Rendered preview — demo document</div>
          </div>
        </div>
      </div>
    );
  }

  function FileRow({ file, onPreview }) {
    const k = FILE_KIND[file.kind] || FILE_KIND.doc;
    const Ic = I[k.icon] || I.doc;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 13px", border: "1px solid #E3E9EE", borderRadius: 10, background: "#fff" }}>
        <span style={{ width: 38, height: 38, borderRadius: 8, display: "grid", placeItems: "center", background: k.color + "14", color: k.color, flexShrink: 0 }}><Ic size={20} /></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0A0A0A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: "#76746F" }}>{k.label} · {file.size}</div>
        </div>
        <button onClick={() => onPreview(file)} style={{ border: "1.5px solid #006CB8", background: "#fff", color: "#006CB8", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: FONT, fontSize: 13.5, fontWeight: 600 }}>Preview</button>
        <button title="Download" style={{ border: "none", background: "transparent", color: "#53565A", cursor: "pointer", padding: 5 }}><I.download size={19} /></button>
      </div>
    );
  }

  function TaskModal({ task, onClose, onSave, onStart }) {
    const [d, setD] = React.useState(task);
    const [tab, setTab] = React.useState("details");
    const [reply, setReply] = React.useState("");
    const [preview, setPreview] = React.useState(null);
    const threadRef = React.useRef(null);
    React.useEffect(() => { setD(task); setTab("details"); }, [task]);
    const set = (k, v) => setD((p) => ({ ...p, [k]: v }));
    React.useEffect(() => {
      const h = (e) => { if (e.key === "Escape" && !preview) onClose(); };
      document.addEventListener("keydown", h); return () => document.removeEventListener("keydown", h);
    }, [preview]);
    React.useEffect(() => { if (tab === "comments" && threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [tab, d.thread]);
    if (!task) return null;
    const pri = PRIORITY_META[d.priority] || {};
    const thread = d.thread || [], files = d.files || [];

    const sendReply = () => {
      const text = reply.trim(); if (!text) return;
      setD((p) => ({ ...p, thread: [...(p.thread || []), { author: "Jordan Avery", text, time: "Just now", me: true }] }));
      setReply("");
    };
    const addFile = () => {
      const n = (d.files || []).length + 1;
      setD((p) => ({ ...p, files: [...(p.files || []), { name: `Uploaded_file_${n}.pdf`, kind: "pdf", size: "1.2 MB" }] }));
    };
    const commit = () => onSave({ ...d, comments: (d.thread || []).length, attachments: (d.files || []).length, unread: false });

    const Tab = ({ id, label, count }) => {
      const on = tab === id;
      return (
        <button onClick={() => setTab(id)} style={{
          display: "inline-flex", alignItems: "center", gap: 7, border: "none", background: "transparent", cursor: "pointer",
          padding: "12px 4px", margin: "0 16px -1px 0", borderBottom: "3px solid " + (on ? "#006CB8" : "transparent"),
          fontFamily: FONT, fontSize: 15.5, fontWeight: on ? 700 : 500, color: on ? "#006CB8" : "#53565A",
        }}>
          {label}
          {count != null && <span style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: on ? "#fff" : "#53565A", background: on ? "#006CB8" : "#E3E9EE", borderRadius: 999, padding: "1px 8px" }}>{count}</span>}
        </button>
      );
    };

    return (
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(15,30,45,0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div onClick={(e) => e.stopPropagation()} style={{
          width: "100%", maxWidth: 640, height: "min(680px, 90vh)", background: "#fff", borderRadius: 14, overflow: "hidden",
          display: "flex", flexDirection: "column", boxShadow: "0 24px 60px rgba(0,0,0,0.32)", borderTop: "5px solid " + pri.color,
        }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 22px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{ color: "#006CB8" }}><I.clipboard size={22} /></span>
              <h3 style={{ fontFamily: SERIF, fontSize: 21, color: "#0A0A0A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.title || "Edit task"}</h3>
            </div>
            <button onClick={onClose} style={{ border: "none", background: "transparent", color: "#53565A", cursor: "pointer", padding: 4 }}><I.x size={22} /></button>
          </div>
          {/* tabs */}
          <div style={{ display: "flex", padding: "6px 22px 0", borderBottom: "1px solid #E3E9EE" }}>
            <Tab id="details" label="Details" />
            <Tab id="comments" label="Comments" count={thread.length} />
            <Tab id="attachments" label="Attachments" count={files.length} />
          </div>

          {/* body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "22px" }}>
            {tab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <MField label="Task title"><input value={d.title} onChange={(e) => set("title", e.target.value)} style={inputStyle} /></MField>
                <MField label="Description"><textarea value={d.desc} onChange={(e) => set("desc", e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.45 }} /></MField>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <MField label="Status"><MSelect value={d.status} onChange={(v) => set("status", v)} options={Object.keys(STATUS_META)} /></MField>
                  <MField label="Priority"><MSelect value={d.priority} onChange={(v) => set("priority", v)} options={Object.keys(PRIORITY_META)} /></MField>
                  <MField label="Assigned to"><MSelect value={d.assignee} onChange={(v) => set("assignee", v)} options={ASSIGNEES} render={(o) => o || "Unassigned"} /></MField>
                  <MField label="Phase"><MSelect value={d.phase} onChange={(v) => set("phase", v)} options={TASK_COLUMNS.phase} /></MField>
                  <MField label="Label"><MSelect value={d.label} onChange={(v) => set("label", v)} options={TASK_COLUMNS.label} /></MField>
                  <MField label="Date">
                    <div style={{ display: "flex", gap: 8 }}>
                      <select value={d.dateType} onChange={(e) => set("dateType", e.target.value)} style={{ ...inputStyle, width: "auto", cursor: "pointer" }}><option>Due</option><option>Start by</option></select>
                      <input type="date" value={d.date || ""} onChange={(e) => set("date", e.target.value)} style={inputStyle} />
                    </div>
                  </MField>
                </div>
              </div>
            )}

            {tab === "comments" && (
              <div ref={threadRef} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {thread.length === 0 && <div style={{ fontFamily: FONT, fontSize: 15, color: "#9aa3ab", textAlign: "center", padding: "30px 0" }}>No messages yet. Start the conversation below.</div>}
                {thread.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, flexDirection: m.me ? "row-reverse" : "row" }}>
                    <Avatar name={m.author} size={34} />
                    <div style={{ maxWidth: "78%" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, justifyContent: m.me ? "flex-end" : "flex-start", marginBottom: 3 }}>
                        <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#2E2D29" }}>{m.me ? "You" : m.author}</span>
                        <span style={{ fontFamily: FONT, fontSize: 12.5, color: "#9aa3ab" }}>{m.time}</span>
                      </div>
                      <div style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.45, color: m.me ? "#fff" : "#2E2D29", background: m.me ? "#006CB8" : "#F1F4F7", border: m.me ? "none" : "1px solid #E3E9EE", borderRadius: 12, padding: "10px 13px" }}>{m.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "attachments" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {files.length === 0 && <div style={{ fontFamily: FONT, fontSize: 15, color: "#9aa3ab", textAlign: "center", padding: "24px 0" }}>No attachments yet.</div>}
                {files.map((f, i) => <FileRow key={i} file={f} onPreview={setPreview} />)}
                <button onClick={addFile} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, alignSelf: "flex-start", border: "1.5px dashed #006CB8", background: "#F3F8FC", color: "#006CB8", borderRadius: 10, padding: "11px 18px", cursor: "pointer", fontFamily: FONT, fontSize: 14.5, fontWeight: 600 }}><I.upload size={17} /> Upload attachment</button>
              </div>
            )}
          </div>

          {/* footer */}
          {tab === "comments" ? (
            <div style={{ padding: "12px 16px", borderTop: "1px solid #E3E9EE", display: "flex", alignItems: "flex-end", gap: 10 }}>
              <textarea value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                rows={1} placeholder="Write a reply…" style={{ ...inputStyle, resize: "none", minHeight: 44, lineHeight: 1.4 }} />
              <button onClick={sendReply} disabled={!reply.trim()} style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "none", background: reply.trim() ? "#006CB8" : "#9FB9CC", color: "#fff", borderRadius: 9, padding: "12px 18px", cursor: reply.trim() ? "pointer" : "default", fontFamily: FONT, fontSize: 14.5, fontWeight: 700, whiteSpace: "nowrap" }}><I.send size={15} /> Send</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 22px", borderTop: "1px solid #E3E9EE" }}>
              <button onClick={() => onStart && onStart(d)} title="Start this task with Guide Me" style={{
                display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#B1040E",
                background: "#fff", border: "1.5px solid #B1040E", borderRadius: 9, padding: "11px 18px", cursor: "pointer",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FDECEC"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <span style={{ color: "#E50808", display: "grid", placeItems: "center" }}><I.sparkles size={18} /></span> Guide Me
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button onClick={onClose} style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#53565A", background: "#fff", border: "1.5px solid #C0C0BF", borderRadius: 9, padding: "11px 22px", cursor: "pointer" }}>Cancel</button>
                <button onClick={commit} disabled={!d.title.trim()} style={{
                  fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff", background: d.title.trim() ? "#006CB8" : "#9FB9CC",
                  border: "none", borderRadius: 9, padding: "11px 26px", cursor: d.title.trim() ? "pointer" : "default", whiteSpace: "nowrap",
                }}>Save changes</button>
              </div>
            </div>
          )}
        </div>

        {preview && <FilePreview file={preview} onClose={() => setPreview(null)} />}
      </div>
    );
  }

  // ── Page ────────────────────────────────────────────────────────────
  function TasksPage({ onGuide }) {
    const [view, setView] = React.useState("board");
    const [by, setBy] = React.useState("status");
    const [scope, setScope] = React.useState("all");   // 'mine' | 'all'
    const [q, setQ] = React.useState("");
    const [tasks, setTasks] = React.useState(TASKS);
    const [editing, setEditing] = React.useState(null); // task being edited
    const [toast, setToast] = React.useState(null);

    const filtered = React.useMemo(() => {
      const needle = q.trim().toLowerCase();
      return tasks.filter((t) => {
        if (scope === "mine" && t.assignee !== ME) return false;
        if (needle && !(t.title + " " + t.desc + " " + t.assignee).toLowerCase().includes(needle)) return false;
        return true;
      });
    }, [q, scope, tasks]);

    const saveTask = (updated) => {
      setTasks((list) => list.map((t) => (t.id === updated.id ? updated : t)));
      setEditing(null);
      setToast("Task updated");
      setTimeout(() => setToast(null), 1800);
    };

    const startTaskWithGuide = (task) => {
      setEditing(null);
      setToast("Starting “" + task.title + "” with Guide Me");
      setTimeout(() => setToast(null), 2200);
      if (onGuide) onGuide();
    };

    const quickEdit = (id, patch) => {
      setTasks((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
      setToast(patch.assignee !== undefined ? (patch.assignee ? "Reassigned to " + patch.assignee : "Set to Unassigned") : "Date updated");
      setTimeout(() => setToast(null), 1600);
    };

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#fff" }}>
        <div style={{ padding: "34px 48px 56px", maxWidth: 1320 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 37, fontWeight: 400, color: "#2E2D29", margin: "0 0 24px", letterSpacing: 1 }}>Study Tasks</h2>

          <TasksDashboard tasks={filtered} onGuide={onGuide} />

          {/* toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, margin: "30px 0 18px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "#53565A" }}><I.listLines size={22} /></span>
                <span style={{ fontFamily: SERIF, fontSize: 22, color: "#0A0A0A" }}>Task Board</span>
              </span>
              <button style={{ display: "flex", alignItems: "center", gap: 7, border: "none", background: "transparent", cursor: "pointer", color: "#006CB8", fontFamily: FONT, fontSize: 15.5, fontWeight: 600 }}>
                <I.plusCircle size={20} /> Add new task
              </button>
            </div>
            <Segmented view={view} setView={setView} />
          </div>

          {/* controls */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "0 1 360px", minWidth: 240 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9aa3ab" }}><I.search size={18} /></span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by protocol, title, or sponsor…" style={{
                width: "100%", boxSizing: "border-box", fontFamily: FONT, fontSize: 15, color: "#2E2D29",
                padding: "11px 12px 11px 40px", borderRadius: 999, border: "1.5px solid #C0C0BF", outline: "none",
              }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#2E2D29" }}>Filter by</span>
              {[["mine", "My Tasks"], ["all", "All tasks"]].map(([id, label]) => {
                const on = scope === id;
                return (
                  <button key={id} onClick={() => setScope(id)} style={{
                    fontFamily: FONT, fontSize: 14.5, fontWeight: 600, cursor: "pointer", padding: "8px 18px", borderRadius: 999,
                    border: on ? "1.5px solid #006CB8" : "1.5px solid #C7CDD2",
                    background: on ? "#006CB8" : "#fff", color: on ? "#fff" : "#2E2D29",
                  }}>{label}</button>
                );
              })}
            </div>
          </div>

          {view === "board" && (
            <div style={{ marginBottom: 18 }}><GroupByMenu value={by} onChange={setBy} /></div>
          )}

          {view === "board" ? <Board by={by} tasks={filtered} onOpen={setEditing} onQuick={quickEdit} /> : <TableView tasks={filtered} onOpen={setEditing} onQuick={quickEdit} />}
        </div>

        {editing && <TaskModal task={editing} onClose={() => setEditing(null)} onSave={saveTask} onStart={startTaskWithGuide} />}

        {toast && (
          <div style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 80, background: "#0A0A0A", color: "#fff", fontFamily: FONT, fontSize: 15, padding: "12px 22px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}>{toast}</div>
        )}
      </div>
    );
  }

  window.RExTasks = { TasksPage };
})();
