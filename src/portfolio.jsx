import React from 'react';
import ReactDOM from 'react-dom/client';
// portfolio.jsx — Research Portfolio: welcome banner, phase scatter plot, studies table
(function () {
  const I = window.RExIcons;
  const { FONT } = window.RExFields;
  const SERIF = "'Source Serif 4', Georgia, serif";
  const STANFORD_RED = "#8C1515";
  const { PORTFOLIO_STUDIES } = window.RExPortfolioData;

  const PHASES = ["Exploration", "Pre-Startup", "Start up", "Regulatory", "Activation", "Active Study", "Done"];
  const PHASE_PILLS = ["All Phases", ...PHASES];

  // Risk status → dot color (matched to screenshot palette)
  const RISK_COLOR = {
    "At Risk": "#EF4444",
    "Delayed": "#F59E0B",
    "On Track": "#14B8A6",
  };

  // Table status badge — matches scatter plot dot colors
  const STATUS_BADGE = {
    "At Risk":  { bg: "#FDECEA", color: "#EF4444" },
    "Delayed":  { bg: "#FEF3C7", color: "#D97706" },
    "On Track": { bg: "#D1FAF5", color: "#0D9488" },
  };

  // Phase → badge color config
  const PHASE_BADGE = {
    "Exploration":  { bg: "#F0F4FF", color: "#3730A3" },
    "Pre-Startup":  { bg: "#FFF0F9", color: "#9D174D" },
    "Start up":     { bg: "#FFF7E6", color: "#92400E" },
    "Regulatory":   { bg: "#FEF2F2", color: "#991B1B" },
    "Activation":   { bg: "#ECFDF5", color: "#065F46" },
    "Active Study": { bg: "#EFF6FF", color: "#1E40AF" },
    "Done":         { bg: "#F0FDF4", color: "#166534" },
  };

  // ── Donut Chart ─────────────────────────────────────────────────────────
  function DonutChart({ score }) {
    const SIZE = 160;
    const R = 58;
    const CX = SIZE / 2, CY = SIZE / 2;
    const circumference = 2 * Math.PI * R;

    const segments = [
      { pct: 0.12, color: "#EF4444", label: "Needs attention" },
      { pct: 0.18, color: "#3B82F6", label: "Active studies" },
      { pct: 0.70, color: "#14B8A6", label: "On track" },
    ];

    let cumulative = -0.25;
    const arcs = segments.map((seg) => {
      const offset = circumference * (1 - seg.pct);
      const rotate = cumulative * 360;
      cumulative += seg.pct;
      return { ...seg, offset, rotate };
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx={CX} cy={CY} r={R}
                fill="none"
                stroke={arc.color}
                strokeWidth={18}
                strokeDasharray={`${circumference * arcs[i].pct} ${circumference * (1 - arcs[i].pct)}`}
                strokeDashoffset={0}
                transform={`rotate(${arc.rotate}, ${CX}, ${CY})`}
              />
            ))}
          </svg>
          <div style={{
            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 700, color: "#0A0A0A", lineHeight: 1 }}>{score}</span>
            <span style={{ fontFamily: FONT, fontSize: 11, color: "#76746F", marginTop: 3, textAlign: "center", lineHeight: 1.3 }}>Active<br/>Studies</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[
            { color: "#EF4444", label: "Needs attention" },
            { color: "#3B82F6", label: "Active studies" },
            { color: "#14B8A6", label: "On track" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 10, height: 10, borderRadius: 10, background: item.color, flexShrink: 0 }} />
              <span style={{ fontFamily: FONT, fontSize: 12, color: "#53565A" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Welcome Banner ──────────────────────────────────────────────────────
  function WelcomeBanner({ onNewStudy }) {
    return (
      <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "stretch" }}>
        {/* RExI actions card — matches Study Overview agentic card style */}
        <div style={{
          flex: 1, background: "#fff", border: "1px solid #DCE3E9", borderRadius: 16,
          padding: "26px 32px", display: "flex", alignItems: "center", gap: 28,
          boxShadow: "0 2px 10px rgba(10,90,160,0.06)",
        }}>
          <img src="assets/rexi-mascot.png" alt="RExI mascot" style={{ width: 120, height: "auto", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontFamily: FONT, fontSize: 17, color: "#2E2D29", margin: "0 0 18px", lineHeight: 1.5 }}>
              You've been busy! Here are all your studies. Use the filters to see visualizations of your portfolio.
            </p>
            <button
              onClick={onNewStudy}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: STANFORD_RED, color: "#fff", border: "none", borderRadius: 10,
                padding: "12px 24px", cursor: "pointer", fontFamily: FONT, fontSize: 15, fontWeight: 700,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#6B0E0E"}
              onMouseLeave={(e) => e.currentTarget.style.background = STANFORD_RED}
            >
              + Start a new study
            </button>
          </div>
        </div>
        {/* Portfolio Health card */}
        <div style={{
          flexShrink: 0, background: "#fff", border: "1px solid #DCE3E9", borderRadius: 16,
          padding: "24px 28px", display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", boxShadow: "0 2px 10px rgba(10,90,160,0.06)",
        }}>
          <div style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#53565A", marginBottom: 12, textAlign: "center" }}>
            Portfolio Health
          </div>
          <DonutChart score={80} />
        </div>
      </div>
    );
  }

  // ── Phase Scatter Plot ──────────────────────────────────────────────────
  const CHART_W = 900;
  const CHART_H = 280;
  const PAD_L = 130, PAD_R = 30, PAD_T = 20, PAD_B = 40;
  const PLOT_W = CHART_W - PAD_L - PAD_R;
  const PLOT_H = CHART_H - PAD_T - PAD_B;

  function ScatterChart({ studies, selectedId, phaseFilter, onDotClick }) {
    const [tooltip, setTooltip] = React.useState(null);

    // Position each dot with deterministic jitter so dots scatter visually
    // but positions are stable across renders (no Math.random).
    const phaseCount = PHASES.length;
    const bandH = PLOT_H / phaseCount;
    function hash(n, salt) {
      let h = (n * 2654435761 + salt * 40503) >>> 0;
      h = ((h ^ (h >>> 16)) * 0x45d9f3b) >>> 0;
      return (h >>> 0) / 0xffffffff;
    }
    const dots = studies.map((s, idx) => {
      const phaseIdx = PHASES.indexOf(s.phase);
      // X: scatter across full plot width using index-based hash
      const x = PAD_L + hash(idx, 1) * PLOT_W;
      // Y: center of phase band ± jitter of up to 38% of band height
      const bandCenter = PAD_T + (phaseIdx + 0.5) * bandH;
      const jitter = (hash(idx, 2) - 0.5) * bandH * 0.76;
      const y = bandCenter + jitter;
      return { ...s, x, y, phaseIdx };
    });

    const isFiltered = phaseFilter && phaseFilter !== "All Phases";

    return (
      <div style={{ background: "#fff", border: "1px solid #DCE3E9", borderRadius: 12, padding: "20px 28px 16px", marginBottom: 24 }}>
        <div style={{ fontFamily: SERIF, fontSize: 20, color: "#0A0A0A", marginBottom: 14 }}>Phase</div>
        <div style={{ overflowX: "auto" }}>
          <svg width={CHART_W} height={CHART_H} style={{ display: "block" }}>
            {/* Y-axis phase labels */}
            {PHASES.map((ph, i) => {
              const y = PAD_T + ((i + 0.5) / phaseCount) * PLOT_H;
              return (
                <React.Fragment key={ph}>
                  <text
                    x={PAD_L - 10} y={y + 4}
                    textAnchor="end"
                    style={{ fontFamily: FONT, fontSize: 12, fill: "#76746F" }}
                  >{ph}</text>
                  <line x1={PAD_L} y1={y} x2={PAD_L + PLOT_W} y2={y}
                    stroke="#F0F2F4" strokeWidth={1} />
                </React.Fragment>
              );
            })}

            {/* X-axis ticks */}
            {[1, 20, 40, 60, 80].map((n) => {
              const x = PAD_L + ((n - 1) / (studies.length - 1)) * PLOT_W;
              return (
                <React.Fragment key={n}>
                  <line x1={x} y1={PAD_T + PLOT_H} x2={x} y2={PAD_T + PLOT_H + 5} stroke="#C0C0BF" strokeWidth={1} />
                  <text x={x} y={PAD_T + PLOT_H + 17} textAnchor="middle"
                    style={{ fontFamily: FONT, fontSize: 11, fill: "#9aa3ab" }}>{n}</text>
                </React.Fragment>
              );
            })}

            {/* Chart border lines */}
            <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={PAD_T + PLOT_H} stroke="#DCE3E9" strokeWidth={1.5} />
            <line x1={PAD_L} y1={PAD_T + PLOT_H} x2={PAD_L + PLOT_W} y2={PAD_T + PLOT_H} stroke="#DCE3E9" strokeWidth={1.5} />

            {/* Dots */}
            {dots.map((dot) => {
              const isSelected = dot.id === selectedId;
              const isMatch = !isFiltered || dot.phase === phaseFilter;
              const opacity = isMatch ? 1 : 0.12;
              const r = isSelected ? 10 : 7;
              const color = RISK_COLOR[dot.riskStatus] || "#76746F";

              return (
                <g key={dot.id} style={{ cursor: "pointer" }}
                  onClick={() => onDotClick(dot.id)}
                  onMouseEnter={(e) => setTooltip({ id: dot.id, x: dot.x, y: dot.y, title: dot.title })}
                  onMouseLeave={() => setTooltip(null)}>
                  <circle
                    cx={dot.x} cy={dot.y} r={r}
                    fill={color}
                    opacity={opacity}
                    stroke={isSelected ? "#0A0A0A" : "transparent"}
                    strokeWidth={isSelected ? 2 : 0}
                    style={{ transition: "r 0.15s, opacity 0.15s" }}
                  />
                </g>
              );
            })}

            {/* Tooltip */}
            {tooltip && (() => {
              const maxW = 180;
              const tx = Math.min(tooltip.x + 10, CHART_W - maxW - 4);
              const ty = tooltip.y - 36;
              return (
                <g pointerEvents="none">
                  <rect x={tx} y={ty} width={maxW} height={28} rx={5} fill="#0A0A0A" opacity={0.88} />
                  <text x={tx + 8} y={ty + 18} style={{ fontFamily: FONT, fontSize: 11, fill: "#fff" }}>
                    {tooltip.title.length > 28 ? tooltip.title.slice(0, 28) + "…" : tooltip.title}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 10, paddingLeft: PAD_L }}>
          {Object.entries(RISK_COLOR).map(([label, color]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 10, height: 10, borderRadius: 10, background: color, display: "block" }} />
              <span style={{ fontFamily: FONT, fontSize: 12, color: "#53565A" }}>{label}</span>
            </div>
          ))}
          <span style={{ fontFamily: FONT, fontSize: 12, color: "#9aa3ab", marginLeft: 8 }}>
            Each dot = one study &nbsp;·&nbsp; x-axis = study index (1–80)
          </span>
        </div>
      </div>
    );
  }

  // ── Badge helpers ───────────────────────────────────────────────────────
  function StatusBadge({ status }) {
    const cfg = STATUS_BADGE[status] || { bg: "#EEF2F7", color: "#53565A" };
    return (
      <span style={{
        display: "inline-block", background: cfg.bg, color: cfg.color,
        borderRadius: 999, padding: "3px 10px", fontFamily: FONT, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
      }}>{status}</span>
    );
  }

  function PhaseBadge({ phase }) {
    const cfg = PHASE_BADGE[phase] || { bg: "#F5F5F5", color: "#53565A" };
    return (
      <span style={{
        display: "inline-block", background: cfg.bg, color: cfg.color,
        borderRadius: 999, padding: "3px 10px", fontFamily: FONT, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
      }}>{phase}</span>
    );
  }

  // ── Studies Table ───────────────────────────────────────────────────────
  const PAGE_SIZE = 12;

  function StudiesTable({ studies, selectedId, phaseFilter, onPhaseFilter, onRowSelect, searchQ, onSearchQ }) {
    const [sortCol, setSortCol] = React.useState(null);
    const [sortDir, setSortDir] = React.useState("asc");
    const [page, setPage] = React.useState(1);

    const handleSort = (col) => {
      if (sortCol === col) { setSortDir((d) => d === "asc" ? "desc" : "asc"); }
      else { setSortCol(col); setSortDir("asc"); }
      setPage(1);
    };

    // Filter
    const filtered = React.useMemo(() => {
      const q = searchQ.trim().toLowerCase();
      return studies.filter((s) => {
        if (phaseFilter && phaseFilter !== "All Phases" && s.phase !== phaseFilter) return false;
        if (q && !(s.protocol + " " + s.title + " " + s.sponsor + " " + s.pi).toLowerCase().includes(q)) return false;
        return true;
      });
    }, [studies, phaseFilter, searchQ]);

    // Sort
    const sorted = React.useMemo(() => {
      if (!sortCol) return filtered;
      return [...filtered].sort((a, b) => {
        const av = a[sortCol] || "", bv = b[sortCol] || "";
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "asc" ? cmp : -cmp;
      });
    }, [filtered, sortCol, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
    const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const SortIcon = ({ col }) => {
      if (sortCol !== col) return <span style={{ color: "#C0C0BF", marginLeft: 4 }}>↕</span>;
      return <span style={{ color: STANFORD_RED, marginLeft: 4 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
    };

    const TH = ({ col, label, style: extraStyle }) => (
      <th
        onClick={() => handleSort(col)}
        style={{
          fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#2E2D29",
          padding: "11px 14px", textAlign: "left", whiteSpace: "nowrap",
          cursor: "pointer", userSelect: "none", background: "#F7F9FB",
          borderBottom: "2px solid #E3E9EE", ...extraStyle,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = "#EEF3F8"}
        onMouseLeave={(e) => e.currentTarget.style.background = "#F7F9FB"}
      >
        {label}<SortIcon col={col} />
      </th>
    );

    return (
      <div style={{ background: "#fff", border: "1px solid #DCE3E9", borderRadius: 12, overflow: "hidden" }}>
        {/* Table toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 14px", borderBottom: "1px solid #EEF2F5" }}>
          <div style={{ position: "relative", flex: "0 1 340px" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9aa3ab" }}>
              <I.search size={16} />
            </span>
            <input
              value={searchQ}
              onChange={(e) => { onSearchQ(e.target.value); setPage(1); }}
              placeholder="Search protocol, title, sponsor, PI…"
              style={{
                width: "100%", boxSizing: "border-box",
                fontFamily: FONT, fontSize: 14, color: "#2E2D29",
                padding: "9px 12px 9px 34px", borderRadius: 999,
                border: "1.5px solid #C0C0BF", outline: "none",
              }}
            />
          </div>
          <button style={{
            background: "transparent", border: "none", color: STANFORD_RED,
            fontFamily: FONT, fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "underline",
          }}>View archived studies →</button>
        </div>

        {/* Phase filter pills */}
        <div style={{ display: "flex", gap: 8, padding: "12px 20px", borderBottom: "1px solid #EEF2F5", flexWrap: "wrap" }}>
          {PHASE_PILLS.map((pill) => {
            const active = (phaseFilter || "All Phases") === pill;
            return (
              <button
                key={pill}
                onClick={() => { onPhaseFilter(pill); setPage(1); }}
                style={{
                  fontFamily: FONT, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  padding: "5px 14px", borderRadius: 999, border: "none",
                  background: active ? STANFORD_RED : "#F0F2F4",
                  color: active ? "#fff" : "#53565A",
                  transition: "background 0.12s, color 0.12s",
                }}
              >{pill}</button>
            );
          })}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <TH col="protocol" label="Protocol #" />
                <TH col="title" label="Study Title" />
                <TH col="sponsor" label="Sponsor" />
                <TH col="phase" label="Phase" />
                <TH col="riskStatus" label="Status" />
                <TH col="budget" label="Budget" />
                <TH col="date" label="Dates" />
                <TH col="pi" label="Principal Investigator" />
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ fontFamily: FONT, fontSize: 15, color: "#9aa3ab", textAlign: "center", padding: "32px 0" }}>
                    No studies match your filters.
                  </td>
                </tr>
              )}
              {pageRows.map((s, i) => {
                const isSelected = s.id === selectedId;
                return (
                  <tr
                    key={s.id}
                    data-study-id={s.id}
                    onClick={() => onRowSelect(s.id)}
                    style={{
                      borderTop: "1px solid #EEF2F5", cursor: "pointer",
                      background: isSelected ? "#E8F3FB" : "transparent",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#F7FAFC"; }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
                  >
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 13.5, fontWeight: 700, color: STANFORD_RED, whiteSpace: "nowrap" }}>
                      {s.protocol}
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 14, color: "#0A0A0A", maxWidth: 260 }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 250 }} title={s.title}>
                        {s.title}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 13.5, color: "#53565A", whiteSpace: "nowrap" }}>{s.sponsor}</td>
                    <td style={{ padding: "11px 14px" }}><PhaseBadge phase={s.phase} /></td>
                    <td style={{ padding: "11px 14px" }}><StatusBadge status={s.riskStatus} /></td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 13.5, color: "#2E2D29", whiteSpace: "nowrap" }}>{s.budget}</td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 13.5, color: "#76746F", whiteSpace: "nowrap" }}>{s.date}</td>
                    <td style={{ padding: "11px 14px", fontFamily: FONT, fontSize: 13.5, color: "#2E2D29", whiteSpace: "nowrap" }}>{s.pi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: "1px solid #EEF2F5" }}>
          <span style={{ fontFamily: FONT, fontSize: 13, color: "#76746F" }}>
            {filtered.length} {filtered.length === 1 ? "study" : "studies"}
            {filtered.length !== studies.length ? ` of ${studies.length}` : ""}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const n = i + 1;
              const isActive = n === page;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    fontFamily: FONT, fontSize: 13.5, fontWeight: isActive ? 700 : 500,
                    width: 30, height: 30, borderRadius: 6, border: isActive ? "1.5px solid " + STANFORD_RED : "1.5px solid transparent",
                    background: isActive ? STANFORD_RED : "transparent",
                    color: isActive ? "#fff" : "#2E2D29",
                    cursor: "pointer",
                  }}
                >{n}</button>
              );
            })}
            {totalPages > 7 && <span style={{ fontFamily: FONT, fontSize: 13, color: "#9aa3ab" }}>…</span>}
            {page < totalPages && (
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                style={{
                  fontFamily: FONT, fontSize: 13.5, fontWeight: 600,
                  padding: "5px 12px", borderRadius: 6, border: "1.5px solid #C0C0BF",
                  background: "#fff", color: "#2E2D29", cursor: "pointer",
                }}
              >Next →</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Portfolio Page ──────────────────────────────────────────────────────
  function PortfolioPage({ onNewStudy }) {
    const [selectedId, setSelectedId] = React.useState(null);
    const [phaseFilter, setPhaseFilter] = React.useState("All Phases");
    const [searchQ, setSearchQ] = React.useState("");

    const handleRowSelect = (id) => {
      setSelectedId((prev) => prev === id ? null : id);
    };

    const handleDotClick = (id) => {
      setSelectedId((prev) => prev === id ? null : id);
      // Scroll to the table row
      setTimeout(() => {
        const el = document.querySelector("[data-study-id='" + id + "']");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    };

    const handlePhaseFilter = (pill) => {
      setPhaseFilter(pill);
      setSelectedId(null);
    };

    return (
      <div style={{ height: "100%", overflowY: "auto", background: "#faf9f5" }}>
        <div style={{ padding: "32px 40px 56px", maxWidth: 1320, margin: "0 auto" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 36, color: "#0A0A0A", margin: "0 0 24px" }}>Research Portfolio</h2>

          <WelcomeBanner onNewStudy={onNewStudy} />

          <ScatterChart
            studies={PORTFOLIO_STUDIES}
            selectedId={selectedId}
            phaseFilter={phaseFilter}
            onDotClick={handleDotClick}
          />

          <div style={{ fontFamily: SERIF, fontSize: 22, color: "#0A0A0A", margin: "0 0 14px" }}>All Studies</div>
          <StudiesTable
            studies={PORTFOLIO_STUDIES}
            selectedId={selectedId}
            phaseFilter={phaseFilter}
            onPhaseFilter={handlePhaseFilter}
            onRowSelect={handleRowSelect}
            searchQ={searchQ}
            onSearchQ={setSearchQ}
          />
        </div>
      </div>
    );
  }

  window.RExPortfolio = { PortfolioPage };
})();
