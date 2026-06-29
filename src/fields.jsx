import React from 'react';
import ReactDOM from 'react-dom/client';
// fields.jsx — form field renderers for RExI intake questions
(function () {
  const I = window.RExIcons;

  const FONT = "'Source Sans Pro','Source Sans 3',sans-serif";

  function Chip({ label, selected, onClick }) {
    const [hover, setHover] = React.useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{
          fontFamily: FONT, fontSize: 17, lineHeight: 1, cursor: "pointer",
          padding: "12px 22px", borderRadius: 999, transition: "all .12s",
          border: selected ? "1.5px solid #00548F" : "1.5px solid #1271BE",
          background: selected ? "#00548F" : hover ? "#EAF4FB" : "#fff",
          color: selected ? "#fff" : "#0A5A99", fontWeight: selected ? 600 : 500,
        }}>{label}</button>
    );
  }

  function ChipGroup({ q, value, onChange, multi }) {
    const sel = multi ? (Array.isArray(value) ? value : []) : value;
    const isSel = (o) => multi ? sel.includes(o) : sel === o;
    const toggle = (o) => {
      if (!multi) return onChange(o);
      if (o === "None") return onChange(["None"]);
      let next = sel.filter((x) => x !== "None");
      next = next.includes(o) ? next.filter((x) => x !== o) : [...next, o];
      onChange(next.length ? next : []);
    };
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {q.options.map((o) => <Chip key={o} label={o} selected={isSel(o)} onClick={() => toggle(o)} />)}
      </div>
    );
  }

  function TextField({ q, value, onChange, type = "text" }) {
    const [focus, setFocus] = React.useState(false);
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 620 }}>
        <input type={type} value={value || ""} placeholder={q.placeholder || ""}
          onChange={(e) => onChange(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            flex: 1, fontFamily: FONT, fontSize: 18, color: "#2E2D29", padding: "12px 14px", borderRadius: 4,
            outline: "none", background: "#fff",
            border: focus ? "1.5px solid #006CB8" : "1.5px solid #C0C0BF",
            boxShadow: focus ? "0 0 0 3px rgba(0,108,184,0.12)" : "none",
          }} />
        {q.suffix && <span style={{ fontFamily: FONT, fontSize: 16, color: "#76746F" }}>{q.suffix}</span>}
      </div>
    );
  }

  function PeopleField({ q, value, onChange }) {
    const list = Array.isArray(value) ? value : [];
    const [name, setName] = React.useState("");
    const [role, setRole] = React.useState(q.roleOptions[0]);
    const add = () => {
      if (!name.trim()) return;
      onChange([...list, { name: name.trim(), role }]);
      setName(""); setRole(q.roleOptions[0]);
    };
    const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
    return (
      <div style={{ maxWidth: 700 }}>
        {list.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {list.map((m, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 14, background: "#F3F8FC",
                border: "1px solid #CFE3F1", borderRadius: 6, padding: "10px 12px",
              }}>
                <span style={{ width: 34, height: 34, borderRadius: 34, background: "#006CB8", color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 15 }}>
                  {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: 17, color: "#2E2D29", fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontFamily: FONT, fontSize: 14, color: "#53565A" }}>{m.role}</div>
                </div>
                <button onClick={() => remove(i)} style={{ border: "none", background: "transparent", color: "#B1040E", cursor: "pointer", fontFamily: FONT, fontSize: 15 }}>Remove</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "stretch", flexWrap: "wrap" }}>
          <input value={name} placeholder="Full name" onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            style={{ flex: "1 1 220px", fontFamily: FONT, fontSize: 17, padding: "10px 12px", borderRadius: 4, border: "1.5px solid #C0C0BF", outline: "none" }} />
          <select value={role} onChange={(e) => setRole(e.target.value)}
            style={{ fontFamily: FONT, fontSize: 16, padding: "10px 12px", borderRadius: 4, border: "1.5px solid #C0C0BF", background: "#fff", color: "#2E2D29" }}>
            {q.roleOptions.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button onClick={add} style={{
            display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 16, fontWeight: 600,
            color: "#006CB8", background: "#fff", border: "1.5px solid #006CB8", borderRadius: 6, padding: "0 18px", cursor: "pointer",
          }}><I.plus size={18} sw={2.2} /> Add</button>
        </div>
      </div>
    );
  }

  function Field({ q, value, onChange }) {
    switch (q.type) {
      case "single": return <ChipGroup q={q} value={value} onChange={onChange} />;
      case "multi": return <ChipGroup q={q} value={value} onChange={onChange} multi />;
      case "text": return <TextField q={q} value={value} onChange={onChange} />;
      case "number": return <TextField q={q} value={value} onChange={onChange} type="number" />;
      case "date": return <TextField q={q} value={value} onChange={onChange} type="date" />;
      case "people": return <PeopleField q={q} value={value} onChange={onChange} />;
      default: return null;
    }
  }

  // Has this question been answered?
  function isAnswered(q, v) {
    if (q.type === "multi" || q.type === "people") return Array.isArray(v) && v.length > 0;
    return v !== undefined && v !== null && String(v).trim() !== "";
  }

  // Human-readable answer for the review screen.
  function displayValue(q, v) {
    if (!isAnswered(q, v)) return "—";
    if (q.type === "people") return v.map((m) => `${m.name} (${m.role})`).join(", ");
    if (q.type === "multi") return v.join(", ");
    if (q.type === "date") {
      try { return new Date(v + "T00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }); }
      catch (e) { return v; }
    }
    if (q.suffix) return `${v} ${q.suffix}`;
    return v;
  }

  // Deep-ish equality for answer values (handles arrays + people objects).
  function valuesEqual(a, b) {
    if (Array.isArray(a) || Array.isArray(b)) {
      const aa = a || [], bb = b || [];
      if (aa.length !== bb.length) return false;
      const norm = (x) => (x && typeof x === "object" ? JSON.stringify(x) : String(x));
      const sa = aa.map(norm).sort(), sb = bb.map(norm).sort();
      return sa.every((v, i) => v === sb[i]);
    }
    return (a == null ? "" : String(a)) === (b == null ? "" : String(b));
  }

  window.RExFields = { Field, isAnswered, displayValue, valuesEqual, FONT };
})();
