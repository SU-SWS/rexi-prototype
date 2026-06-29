import React from 'react';
import ReactDOM from 'react-dom/client';
// guideme-agent.jsx — Full-screen "Guide Me" conversational agent screen
(function () {
  const SERIF = "'Source Serif 4', Georgia, serif";
  const SANS = "'Source Sans 3', sans-serif";
  const RED = "#B1040E";
  const BLUE = "#006CB8";
  const BG = "#ffffff";

  // ── Shared micro-components ──────────────────────────────────────────

  function SendButton({ onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 48, height: 48, borderRadius: "50%",
          background: disabled ? "#ccc" : RED,
          border: "none", cursor: disabled ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    );
  }

  function TextInput({ value, onChange, onSubmit, placeholder }) {
    return (
      <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%" }}>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onSubmit(); }}
          placeholder={placeholder}
          style={{
            flex: 1, height: 52, borderRadius: 10,
            border: "1px solid #C0C0BF", padding: "0 16px",
            fontFamily: SANS, fontSize: 20, background: "#fff",
            outline: "none", color: "#2E2D29",
          }}
        />
        <SendButton onClick={onSubmit} disabled={!value.trim()} />
      </div>
    );
  }

  function BlueButton({ children, onClick, fullWidth }) {
    return (
      <button
        onClick={onClick}
        style={{
          background: BLUE, color: "#fff", border: "none", borderRadius: 8,
          padding: "14px 32px", fontFamily: SANS, fontSize: 20,
          cursor: "pointer", width: fullWidth ? "100%" : undefined,
          fontWeight: 600,
        }}
      >
        {children}
      </button>
    );
  }

  function OutlineButton({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          background: "#fff", color: "#2E2D29",
          border: "1.5px solid #C0C0BF", borderRadius: 8,
          padding: "14px 32px", fontFamily: SANS, fontSize: 20,
          cursor: "pointer", fontWeight: 500,
        }}
      >
        {children}
      </button>
    );
  }

  function ExitButton({ onExit }) {
    return (
      <button
        onClick={onExit}
        style={{
          position: "absolute", top: 24, right: 24,
          border: "1px solid #C0C0BF", borderRadius: 20,
          background: "#fff", padding: "8px 18px",
          fontFamily: SANS, fontSize: 16, color: "#6D6C69",
          cursor: "pointer", zIndex: 10,
        }}
      >
        Exit Guide Me ×
      </button>
    );
  }

  function Mascot() {
    return (
      <img
        src="assets/rexi-mascot.png"
        alt="RExI mascot"
        style={{ width: 130, height: "auto", flexShrink: 0, marginTop: -10 }}
      />
    );
  }

  function AskAnything({ onSend }) {
    const [val, setVal] = React.useState("");
    return (
      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: SANS, fontSize: 19, color: "#6D6C69", marginBottom: 10 }}>
          Have a different question? Ask me anything.
        </div>
        <TextInput
          value={val}
          onChange={setVal}
          onSubmit={() => { onSend(val); setVal(""); }}
          placeholder="Type your question…"
        />
      </div>
    );
  }

  // ── Step 1 — Welcome ─────────────────────────────────────────────────

  function Step1({ onNext }) {
    const [role, setRole] = React.useState("");
    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 22px 0", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>
          Welcome to Guide Me
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 21, color: "#2E2D29", margin: "0 0 32px 0", lineHeight: 1.4 }}>
          My name is RExI. You can ask me to do just about anything to get your study ready for activation. I'm here to make sure your studies are up-to-date and on track.
        </p>
        <div style={{ fontFamily: SANS, fontSize: 19, color: "#2E2D29", marginBottom: 12, fontWeight: 600 }}>
          First thing I need to know, what's your role?
        </div>
        <TextInput
          value={role}
          onChange={setRole}
          onSubmit={() => { if (role.trim()) onNext(role.trim()); }}
          placeholder="Type your role…"
        />
      </div>
    );
  }

  // ── Step 2 — Greet + ask PI ──────────────────────────────────────────

  function Step2({ roleInput, onNext }) {
    const [pi, setPi] = React.useState("");

    const firstName = roleInput.includes(",")
      ? roleInput.split(",")[0].trim()
      : roleInput.trim().split(" ")[0];

    const role = roleInput.includes(",")
      ? roleInput.split(",").slice(1).join(",").trim()
      : roleInput.trim();

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 28px 0", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>
          Hello {firstName}, nice to meet you! If you're the {role}, who is the Principal Investigator?
        </h1>
        <TextInput
          value={pi}
          onChange={setPi}
          onSubmit={() => { if (pi.trim()) onNext(pi.trim()); }}
          placeholder="Principal Investigator name…"
        />
      </div>
    );
  }

  // ── Step 3 — Protocol document ───────────────────────────────────────

  function Step3({ onNext }) {
    const fileRef = React.useRef(null);
    const [dragging, setDragging] = React.useState(false);

    const handleDrop = (e) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onNext("yes");
    };

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 14px 0", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>
          Do you have a protocol document started?
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 19, color: "#6D6C69", margin: "0 0 24px 0" }}>
          Upload it and I'll extract the study details for you automatically.
        </p>

        <input type="file" ref={fileRef} style={{ display: "none" }} onChange={() => onNext("yes")} />
        <div
          onClick={() => fileRef.current && fileRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragging ? BLUE : "#C0BFB8"}`,
            borderRadius: 12, padding: "36px 28px",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            cursor: "pointer", background: dragging ? "#EEF5FC" : "#FAFAF8",
            transition: "border-color 0.15s, background 0.15s",
            marginBottom: 24,
          }}
        >
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div style={{ fontFamily: SANS, fontSize: 20, fontWeight: 600, color: BLUE }}>
            Upload protocol document
          </div>
          <div style={{ fontFamily: SANS, fontSize: 16, color: "#ABABA9" }}>
            PDF, Word, or text file — drag & drop or click to browse
          </div>
        </div>

        <div style={{ fontFamily: SANS, fontSize: 18, color: "#6D6C69", textAlign: "center", marginBottom: 20 }}>— or —</div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <OutlineButton onClick={() => onNext("no")}>No protocol yet, skip</OutlineButton>
          <BlueButton onClick={() => onNext("yes")}>I'll add it later</BlueButton>
        </div>

        <AskAnything onSend={() => onNext("no")} />
      </div>
    );
  }

  // ── Step 4 — Review pre-populated fields ─────────────────────────────

  const FIELD_ROWS = [
    { label: "Name of Principal Investigator", key: "_pi" },
    { label: "Name of Study", value: "Pembrolizumab + Chemotherapy in NSCLC" },
    { label: "Name of Sponsor", value: "Merck Sharp & Dohme LLC" },
    { label: "Study Phase", value: "Phase III" },
    { label: "Enrollment Target", value: "120 participants" },
    { label: "IRB Protocol #", value: "IRB-2026-0142" },
    { label: "NCT Number", value: "NCT04875013" },
  ];

  function Step4({ piName, onComplete }) {
    const [correction, setCorrection] = React.useState("");

    const initial = FIELD_ROWS.reduce((acc, f) => {
      acc[f.label] = f.key === "_pi" ? piName : f.value;
      return acc;
    }, {});
    const [values, setValues] = React.useState(initial);

    const handleDone = () => {
      onComplete({
        _guideme_pi: values["Name of Principal Investigator"],
        sponsorName: values["Name of Sponsor"],
        phase: values["Study Phase"],
        enrollment: values["Enrollment Target"].replace(/\D+$/, "").trim(),
        irb: values["IRB Protocol #"],
        nct: values["NCT Number"],
      });
    };

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 37, color: "#2E2D29", margin: "0 0 12px 0", fontWeight: 400, lineHeight: 1.4, letterSpacing: 1 }}>
          Great start! I found 13 study details that will pre-populate your study in RExI. Does this look right?
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 19, color: "#6D6C69", margin: "0 0 24px 0" }}>
          Edit any field below before confirming.
        </p>

        <div style={{
          background: "#fff", border: "1px solid #EAEAEA", borderRadius: 10,
          boxShadow: "0 3px 6px rgba(0,0,0,0.10)",
          padding: 22, marginBottom: 22,
        }}>
          {FIELD_ROWS.map((f, i) => (
            <div key={i} style={{
              padding: "12px 0",
              borderBottom: i < FIELD_ROWS.length - 1 ? "1px solid #F0F0F0" : "none",
            }}>
              <div style={{ fontFamily: SANS, fontSize: 16, fontWeight: 600, color: "#2E2D29", marginBottom: 5 }}>
                {f.label}
              </div>
              <input
                type="text"
                value={values[f.label] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.label]: e.target.value }))}
                style={{
                  width: "100%", boxSizing: "border-box",
                  height: 44, borderRadius: 7, border: "1px solid #C0C0BF",
                  padding: "0 14px", fontFamily: SANS, fontSize: 19,
                  color: "#2E2D29", background: "#FAFAF8", outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "#006CB8"}
                onBlur={(e) => e.target.style.borderColor = "#C0C0BF"}
              />
            </div>
          ))}
        </div>

        <BlueButton onClick={handleDone} fullWidth>Done reviewing</BlueButton>

        <div style={{ marginTop: 32 }}>
          <div style={{ fontFamily: SANS, fontSize: 19, color: "#6D6C69", marginBottom: 10 }}>
            Have a different question? Ask me anything.
          </div>
          <TextInput
            value={correction}
            onChange={setCorrection}
            onSubmit={() => { setCorrection(""); }}
            placeholder="Type your corrections or questions…"
          />
        </div>
      </div>
    );
  }

  // ── Main GuideMeAgentScreen ──────────────────────────────────────────

  function GuideMeAgentScreen({ onExit, onComplete }) {
    const [step, setStep] = React.useState(1);
    const [roleInput, setRoleInput] = React.useState("");
    const [piName, setPiName] = React.useState("");

    return (
      <div style={{
        position: "relative",
        width: "100%", height: "100%",
        background: BG,
        overflowY: "auto",
        // Exit button is ~48px tall at top:24, so bottom ≈ 72px. Add 80px gap → content starts at ~152px.
        padding: "152px 24px 60px 24px",
        boxSizing: "border-box",
      }}>
        <ExitButton onExit={onExit} />

        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, right: 0, pointerEvents: "none" }}>
            <Mascot />
          </div>

          <div style={{ paddingRight: 150 }}>
            {step === 1 && (
              <Step1 onNext={(r) => { setRoleInput(r); setStep(2); }} />
            )}
            {step === 2 && (
              <Step2 roleInput={roleInput} onNext={(pi) => { setPiName(pi); setStep(3); }} />
            )}
            {step === 3 && (
              <Step3 onNext={() => setStep(4)} />
            )}
            {step === 4 && (
              <Step4 piName={piName} onComplete={onComplete} />
            )}
          </div>
        </div>
      </div>
    );
  }

  window.RExGuideMeAgent = { GuideMeAgentScreen };
})();
