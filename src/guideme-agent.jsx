import React from 'react';
import ReactDOM from 'react-dom/client';
// guideme-agent.jsx — Full-screen "Guide Me" conversational agent screen
(function () {
  const SERIF = "'Source Serif 4', Georgia, serif";
  const SANS = "'Source Sans Pro', sans-serif";
  const RED = "#8C1515";
  const BLUE = "#006CB8";
  const BG = "#faf9f5";

  // ── Shared micro-components ──────────────────────────────────────────

  function SendButton({ onClick, disabled }) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          width: 40, height: 40, borderRadius: "50%",
          background: disabled ? "#ccc" : RED,
          border: "none", cursor: disabled ? "default" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background 0.15s",
        }}
      >
        {/* Paper-plane icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            flex: 1, height: 42, borderRadius: 10,
            border: "1px solid #D0CFC8", padding: "0 14px",
            fontFamily: SANS, fontSize: 16, background: "#fff",
            outline: "none", color: "#0A0A0A",
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
          background: BLUE, color: "#fff", border: "none", borderRadius: 10,
          padding: "12px 28px", fontFamily: SANS, fontSize: 16,
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
          background: "#fff", color: "#0A0A0A",
          border: "1.5px solid #D0CFC8", borderRadius: 10,
          padding: "12px 28px", fontFamily: SANS, fontSize: 16,
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
          background: "#fff", padding: "6px 14px",
          fontFamily: SANS, fontSize: 13, color: "#555",
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
        src="/assets/rexi-mascot.png"
        alt="RExI mascot"
        style={{ width: 110, height: "auto", flexShrink: 0, marginTop: -10 }}
      />
    );
  }

  function AskAnything({ onSend }) {
    const [val, setVal] = React.useState("");
    return (
      <div style={{ marginTop: 28 }}>
        <div style={{ fontFamily: SANS, fontSize: 15, color: "#555", marginBottom: 8 }}>
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
        <h1 style={{ fontFamily: SERIF, fontSize: 32, color: "#0A0A0A", margin: "0 0 18px 0", fontWeight: 700, lineHeight: 1.2 }}>
          Welcome to Guide Me
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 17, color: "#2E2D29", margin: "0 0 28px 0", lineHeight: 1.6 }}>
          My name is RExI. You can ask me to do just about anything to get your study ready for activation. I'm here to make sure your studies are up-to-date and on track.
        </p>
        <div style={{ fontFamily: SANS, fontSize: 15, color: "#2E2D29", marginBottom: 10, fontWeight: 600 }}>
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

    // Parse first name: "Todd, Coordinator" → "Todd"; otherwise use as-is
    const firstName = roleInput.includes(",")
      ? roleInput.split(",")[0].trim()
      : roleInput.trim().split(" ")[0];

    // Parse role: "Todd, Coordinator" → "Coordinator"
    const role = roleInput.includes(",")
      ? roleInput.split(",").slice(1).join(",").trim()
      : roleInput.trim();

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, color: "#0A0A0A", margin: "0 0 24px 0", fontWeight: 700, lineHeight: 1.25 }}>
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

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, color: "#0A0A0A", margin: "0 0 28px 0", fontWeight: 700, lineHeight: 1.2 }}>
          Do you have a protocol document started?
        </h1>
        <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
          <OutlineButton onClick={() => onNext("no")}>No, not yet</OutlineButton>
          <BlueButton onClick={() => onNext("yes")}>Yes, I do</BlueButton>
        </div>
        <div>
          <input type="file" ref={fileRef} style={{ display: "none" }} onChange={() => onNext("yes")} />
          <button
            onClick={() => fileRef.current && fileRef.current.click()}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: SANS, fontSize: 15, color: BLUE,
              textDecoration: "underline", padding: 0,
            }}
          >
            Select document to upload ↑
          </button>
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

    const fields = FIELD_ROWS.map((f) =>
      f.key === "_pi" ? { ...f, value: piName } : f
    );

    const handleDone = () => {
      const answers = {
        _guideme_pi: piName,
        sponsorName: "Merck Sharp & Dohme LLC",
        phase: "Phase III",
        enrollment: "120",
        irb: "IRB-2026-0142",
        nct: "NCT04875013",
      };
      onComplete(answers);
    };

    return (
      <div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, color: "#0A0A0A", margin: "0 0 10px 0", fontWeight: 700, lineHeight: 1.2 }}>
          Great start! I found 13 study details that will pre-populate your study in RExI. Does this look right?
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 15, color: "#555", margin: "0 0 20px 0" }}>
          Not right? Just type your corrections below...
        </p>

        {/* Fields card */}
        <div style={{
          background: "#fff", border: "1px solid #E0DFD9", borderRadius: 10,
          padding: 20, marginBottom: 20,
        }}>
          {fields.map((f, i) => (
            <div key={i} style={{
              padding: "10px 0",
              borderBottom: i < fields.length - 1 ? "1px solid #F0EFEA" : "none",
            }}>
              <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>
                {f.label}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 15, color: "#666", marginTop: 2 }}>
                {f.value}
              </div>
            </div>
          ))}
        </div>

        <BlueButton onClick={handleDone} fullWidth>Done reviewing</BlueButton>

        {/* Corrections input */}
        <div style={{ marginTop: 28 }}>
          <div style={{ fontFamily: SANS, fontSize: 15, color: "#555", marginBottom: 8 }}>
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
        padding: "60px 24px 60px 24px",
        boxSizing: "border-box",
      }}>
        <ExitButton onExit={onExit} />

        {/* Centered content + mascot */}
        <div style={{
          maxWidth: 680,
          margin: "0 auto",
          position: "relative",
        }}>
          {/* Mascot — floats top-right */}
          <div style={{
            position: "absolute", top: 0, right: 0,
            pointerEvents: "none",
          }}>
            <Mascot />
          </div>

          {/* Step content with right margin so text doesn't go under mascot */}
          <div style={{ paddingRight: 130 }}>
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
