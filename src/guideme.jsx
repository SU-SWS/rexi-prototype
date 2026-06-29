import React from 'react';
import ReactDOM from 'react-dom/client';
// guideme.jsx — "Guide Me" AI drawer: describe the study, RExI auto-fills the flow.
// Two experience variations (tweak `guideMode`): 'chat' and 'autofill'.
(function () {
  const I = window.RExIcons;
  const { FONT } = window.RExFields;
  const { STEPS, SAMPLE_ANSWERS } = window.RExData;

  // Build the field schema sent to the model / used for parsing.
  function schema() {
    return STEPS.flatMap((s) => s.questions.map((q) => ({
      id: q.id, label: q.label, type: q.type,
      options: q.options || q.roleOptions || undefined, step: s.label,
    })));
  }

  function parseJSON(raw) {
    if (!raw) return null;
    let t = String(raw).trim().replace(/```json/gi, "").replace(/```/g, "");
    const a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a === -1 || b === -1) return null;
    try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { return null; }
  }

  // Local keyword fallback (used if the live model is unavailable).
  function heuristic(desc) {
    const d = (desc || "").toLowerCase();
    const out = {};
    schema().forEach((q) => {
      if (q.options && (q.type === "single" || q.type === "multi")) {
        const hits = q.options.filter((o) => {
          const key = o.toLowerCase().replace(/[^a-z ]/g, "").split(" ").filter((w) => w.length > 3);
          return key.some((w) => d.includes(w));
        });
        if (hits.length) out[q.id] = q.type === "multi" ? hits : hits[0];
      }
    });
    // free-text: borrow believable sample values where the topic matches
    if (d.includes("lung") || d.includes("nsclc")) out.disease = "Non-Small Cell Lung Cancer (NSCLC)";
    if (d.includes("merck") || d.includes("pembro")) { out.sponsorName = "Merck Sharp & Dohme LLC"; out.sponsorType = "Industry / Pharma"; }
    if (/phase\s*iii|phase\s*3/.test(d)) out.phase = "Phase III";
    return Object.keys(out).length ? out : { ...SAMPLE_ANSWERS };
  }

  async function aiExtract(desc) {
    const fields = schema();
    const prompt =
`You are RExI, an assistant that configures a clinical research study intake form.
A researcher describes their study in plain language. Extract structured values for the intake fields below and return ONLY a JSON object mapping field "id" to a value.

Fields (JSON): ${JSON.stringify(fields)}

Rules:
- For type "single": value must be EXACTLY one of that field's options.
- For type "multi": value must be an array of that field's options.
- For type "people": value is an array of { "name": string, "role": string } (role from that field's options).
- For "text"/"number"/"date": a short string. Dates as "YYYY-MM-DD".
- Only include fields you can reasonably infer from the description. Omit the rest.
- Return JSON only, no prose.

Researcher's description:
"""${desc}"""`;
    try {
      const raw = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
      return parseJSON(raw) || heuristic(desc);
    } catch (e) {
      return heuristic(desc);
    }
  }

  // Friendly summary of what was filled
  function summarize(answers) {
    const idx = {};
    STEPS.forEach((s) => s.questions.forEach((q) => { idx[q.id] = { ...q, step: s.label }; }));
    return Object.keys(answers).map((id) => {
      const q = idx[id]; if (!q) return null;
      let v = answers[id];
      if (Array.isArray(v)) v = q.type === "people" ? v.map((m) => m.name).join(", ") : v.join(", ");
      return { step: q.step, label: q.label, value: v };
    }).filter(Boolean);
  }

  const SUGGESTIONS = [
    "Phase III randomized trial of pembrolizumab plus chemotherapy in NSCLC, sponsored by Merck, ~120 patients, multi-site.",
    "Investigator-initiated observational study of cardiac biomarkers, single site, no IND.",
  ];

  const MASCOT = "assets/rexi-mascot.png";

  // ─────────────────────────────────────────────────────────────────
  // CHAT VARIATION
  // ─────────────────────────────────────────────────────────────────
  function ChatMode({ onApply, onClose, onGoReview }) {
    const [msgs, setMsgs] = React.useState([
      { who: "rexi", text: "Hi, I’m RExI 🦖 Tell me about your study in a sentence or two — sponsor, condition, phase, team — and I’ll fill in the intake for you." },
    ]);
    const [input, setInput] = React.useState("");
    const [busy, setBusy] = React.useState(false);
    const bottomRef = React.useRef(null);
    React.useEffect(() => { if (bottomRef.current) bottomRef.current.scrollTop = bottomRef.current.scrollHeight; }, [msgs, busy]);

    const send = async (text) => {
      const q = (text != null ? text : input).trim();
      if (!q || busy) return;
      setInput(""); setMsgs((m) => [...m, { who: "me", text: q }]); setBusy(true);
      const answers = await aiExtract(q);
      const filled = summarize(answers);
      onApply(answers);
      const n = filled.length;
      setMsgs((m) => [...m, {
        who: "rexi",
        text: n ? `Done! I filled in ${n} field${n > 1 ? "s" : ""} across your intake — they’re highlighted on the form. Want to review and activate, or keep going step by step?` :
                  "I couldn’t pull much from that — try mentioning the condition, sponsor, phase or team and I’ll fill what I can.",
        filled,
      }]);
      setBusy(false);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <DrawerHeader onClose={onClose} subtitle="Chat assistant" />
        <div ref={bottomRef} style={{ flex: 1, overflowY: "auto", padding: "18px 18px 8px", display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => <Bubble key={i} m={m} onGoReview={onGoReview} />)}
          {busy && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, alignSelf: "flex-start" }}>
              <Avatar />
              <div style={{ ...bubbleStyle(false), display: "flex", gap: 5, padding: "16px 18px" }}>
                {[0, 1, 2].map((k) => <span key={k} style={{ width: 7, height: 7, borderRadius: 7, background: "#9aa3ab", animation: `rexiBlink 1s ${k * 0.15}s infinite` }} />)}
              </div>
            </div>
          )}
          {msgs.length === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              {SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s)} style={{
                  textAlign: "left", fontFamily: FONT, fontSize: 14, color: "#0A5A99", background: "#F3F8FC",
                  border: "1px solid #CFE3F1", borderRadius: 10, padding: "10px 12px", cursor: "pointer", lineHeight: 1.35,
                }}>“{s}”</button>
              ))}
            </div>
          )}
        </div>
        <Composer value={input} setValue={setInput} onSend={() => send()} busy={busy} />
      </div>
    );
  }

  function Bubble({ m, onGoReview }) {
    const mine = m.who === "me";
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", gap: 6 }}>
        <div style={{ display: "flex", gap: 10, flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-start", maxWidth: "92%" }}>
          {!mine && <Avatar />}
          <div style={bubbleStyle(mine)}>{m.text}</div>
        </div>
        {m.filled && m.filled.length > 0 && (
          <div style={{ marginLeft: 46, marginTop: 2, maxWidth: 320 }}>
            <FilledList filled={m.filled} />
            <button onClick={onGoReview} style={{
              marginTop: 10, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff", background: "#006CB8",
              border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer",
            }}>Review &amp; activate →</button>
          </div>
        )}
      </div>
    );
  }

  function FilledList({ filled }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#fff", border: "1px solid #E3E9EE", borderRadius: 10, padding: "10px 12px" }}>
        {filled.slice(0, 8).map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ color: "#1f8a4d", flexShrink: 0, transform: "translateY(2px)" }}><I.check size={14} sw={2.6} /></span>
            <span style={{ fontFamily: FONT, fontSize: 13.5, color: "#53565A" }}>
              <strong style={{ color: "#0A0A0A", fontWeight: 600 }}>{f.value}</strong> <span style={{ opacity: 0.7 }}>· {f.label.length > 38 ? f.label.slice(0, 38) + "…" : f.label}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // AUTOFILL VARIATION (one-shot)
  // ─────────────────────────────────────────────────────────────────
  function AutofillMode({ onApply, onClose, onGoReview }) {
    const [text, setText] = React.useState("");
    const [busy, setBusy] = React.useState(false);
    const [result, setResult] = React.useState(null);

    const run = async () => {
      if (!text.trim() || busy) return;
      setBusy(true); setResult(null);
      const answers = await aiExtract(text);
      onApply(answers);
      setResult(summarize(answers));
      setBusy(false);
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <DrawerHeader onClose={onClose} subtitle="Auto-fill intake" />
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 18px" }}>
          {!result && (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                <Avatar />
                <div style={bubbleStyle(false)}>Describe your whole study in a few sentences and I’ll fill the entire intake at once.</div>
              </div>
              <textarea value={text} onChange={(e) => setText(e.target.value)} disabled={busy}
                placeholder="e.g. A Phase III randomized trial of pembrolizumab plus chemotherapy in non-small cell lung cancer. Sponsored by Merck under an IND. Multi-site, targeting about 120 participants. I’m the PI; my team includes a research nurse and a coordinator."
                style={{
                  width: "100%", minHeight: 180, boxSizing: "border-box", resize: "vertical", fontFamily: FONT, fontSize: 16,
                  color: "#2E2D29", padding: "14px", borderRadius: 10, border: "1.5px solid #C0C0BF", outline: "none", lineHeight: 1.5,
                }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "12px 0 18px" }}>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => setText(s)} style={{
                    textAlign: "left", fontFamily: FONT, fontSize: 13.5, color: "#0A5A99", background: "#F3F8FC",
                    border: "1px solid #CFE3F1", borderRadius: 8, padding: "8px 11px", cursor: "pointer", lineHeight: 1.35,
                  }}>Try: “{s}”</button>
                ))}
              </div>
              <button onClick={run} disabled={busy || !text.trim()} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#fff",
                background: busy || !text.trim() ? "#E59aa0" : "#E50808", border: "none", borderRadius: 10,
                padding: "14px", cursor: busy || !text.trim() ? "default" : "pointer",
              }}>{busy ? "RExI is reading…" : <><I.sparkles size={18} /> Generate intake</>}</button>
            </>
          )}
          {result && (
            <div>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
                <Avatar />
                <div style={bubbleStyle(false)}>I filled in <strong>{result.length}</strong> field{result.length > 1 ? "s" : ""}. They’re highlighted on the form — here’s the summary:</div>
              </div>
              {Object.entries(result.reduce((acc, f) => { (acc[f.step] = acc[f.step] || []).push(f); return acc; }, {})).map(([step, items]) => (
                <div key={step} style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 14, fontWeight: 700, color: "#0A5A99", marginBottom: 6 }}>{step}</div>
                  <FilledList filled={items} />
                </div>
              ))}
            </div>
          )}
        </div>
        {result && (
          <div style={{ borderTop: "1px solid #E3E9EE", padding: 14, display: "flex", gap: 10 }}>
            <button onClick={() => { setResult(null); setText(""); }} style={{
              fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#006CB8", background: "#fff",
              border: "1.5px solid #006CB8", borderRadius: 9, padding: "11px 16px", cursor: "pointer",
            }}>Edit step by step</button>
            <button onClick={onGoReview} style={{
              flex: 1, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff", background: "#006CB8",
              border: "none", borderRadius: 9, padding: "11px 16px", cursor: "pointer",
            }}>Review &amp; activate →</button>
          </div>
        )}
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  // NOTIFY-SERVICE MODE — RExI drafts & sends a resubmission notice
  // ─────────────────────────────────────────────────────────────────
  function fallbackMsg(n) {
    const lines = n.changes.map((c) => `• ${c.label}: ${c.from} → ${c.to}`).join("\n");
    return `Hello ${n.serviceName},\n\nThe study “Pembro + Chemo in NSCLC” (RExI ID 12345) has updated intake information. The following previously submitted document(s) are affected and will need to be revised and resubmitted: ${n.docs.join(", ")}.\n\nWhat changed:\n${lines}\n\nPlease advise on next steps for resubmission. Thank you,\nJordan Avery, Study Team`;
  }
  async function draftMessage(n) {
    const lines = n.changes.map((c) => `- ${c.label}: "${c.from}" -> "${c.to}"`).join("\n");
    const prompt =
`Write a brief, professional message from a clinical study team to the "${n.serviceName}" office.
Purpose: notify them that intake answers changed for the study "Pembro + Chemo in NSCLC" (RExI ID 12345), so these already-submitted documents must be updated and resubmitted: ${n.docs.join(", ")}.
Changes:
${lines}
Rules: under 90 words, greet the ${n.serviceName}, clearly state which documents need resubmission and why, ask for next steps, sign as "Jordan Avery, Study Team". Return only the message text.`;
    try {
      const raw = await window.claude.complete({ messages: [{ role: "user", content: prompt }] });
      return (raw && raw.trim()) || fallbackMsg(n);
    } catch (e) { return fallbackMsg(n); }
  }

  function NotifyMode({ notify, onClose, onSent }) {
    const [draft, setDraft] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [sent, setSent] = React.useState(false);
    React.useEffect(() => {
      let live = true;
      draftMessage(notify).then((m) => { if (live) { setDraft(m); setLoading(false); } });
      return () => { live = false; };
    }, []);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <DrawerHeader onClose={onClose} subtitle={"Notify · " + notify.serviceName} />
        <div style={{ flex: 1, overflowY: "auto", padding: "18px" }}>
          {!sent ? (
            <>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                <Avatar />
                <div style={bubbleStyle(false)}>
                  {loading ? "Drafting a note to " + notify.serviceName + "…"
                    : <>I drafted a note to <strong>{notify.serviceName}</strong> about resubmitting <strong>{notify.docs.join(", ")}</strong>. Review it, edit if you like, then send.</>}
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E3E9EE", borderRadius: 10, padding: "8px 10px", marginBottom: 12 }}>
                <div style={{ fontFamily: FONT, fontSize: 12.5, color: "#9aa3ab", padding: "4px 4px 6px", borderBottom: "1px solid #EEF2F5", marginBottom: 6 }}>
                  To: {notify.serviceName} · Re: Pembro + Chemo in NSCLC (RExI 12345)
                </div>
                {loading ? (
                  <div style={{ padding: "18px 4px", display: "flex", gap: 6 }}>
                    {[0, 1, 2].map((k) => <span key={k} style={{ width: 7, height: 7, borderRadius: 7, background: "#c3cbd2", animation: `rexiBlink 1s ${k * 0.15}s infinite` }} />)}
                  </div>
                ) : (
                  <textarea value={draft} onChange={(e) => setDraft(e.target.value)} style={{
                    width: "100%", boxSizing: "border-box", resize: "vertical", minHeight: 200, border: "none", outline: "none",
                    fontFamily: FONT, fontSize: 14.5, color: "#2E2D29", lineHeight: 1.5, background: "transparent",
                  }} />
                )}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", paddingTop: 36 }}>
              <span style={{ width: 60, height: 60, borderRadius: 60, background: "#E7F6EC", color: "#1f8a4d", display: "grid", placeItems: "center", marginBottom: 16 }}><I.check size={32} sw={2.6} /></span>
              <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 20, fontWeight: 700, color: "#0A0A0A", marginBottom: 8 }}>Sent to {notify.serviceName}</div>
              <p style={{ fontFamily: FONT, fontSize: 15, color: "#53565A", maxWidth: 300 }}>
                A resubmission request for {notify.docs.join(", ")} has been logged. {notify.serviceName} will follow up with next steps.
              </p>
            </div>
          )}
        </div>
        <div style={{ borderTop: "1px solid #E3E9EE", padding: 14, display: "flex", gap: 10 }}>
          {!sent ? (
            <>
              <button onClick={onClose} style={{
                fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#53565A", background: "#fff",
                border: "1.5px solid #C0C0BF", borderRadius: 9, padding: "11px 16px", cursor: "pointer",
              }}>Cancel</button>
              <button onClick={() => { setSent(true); onSent(notify.docIds); }} disabled={loading} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontFamily: FONT, fontSize: 15, fontWeight: 700,
                color: "#fff", background: loading ? "#E59aa0" : "#E50808", border: "none", borderRadius: 9, padding: "11px 16px", cursor: loading ? "default" : "pointer",
              }}><I.send size={15} /> Send to {notify.serviceName}</button>
            </>
          ) : (
            <button onClick={onClose} style={{
              flex: 1, fontFamily: FONT, fontSize: 15, fontWeight: 700, color: "#fff", background: "#006CB8",
              border: "none", borderRadius: 9, padding: "11px 16px", cursor: "pointer",
            }}>Back to review</button>
          )}
        </div>
      </div>
    );
  }

  // ── shared drawer chrome ────────────────────────────────────────────
  function Avatar() {
    return <span style={{
      width: 36, height: 36, borderRadius: 36, flexShrink: 0, background: "#fff url(" + MASCOT + ") center/120% no-repeat",
      border: "1px solid #EadFC9", boxShadow: "0 1px 3px rgba(0,0,0,.12)",
    }} />;
  }
  function bubbleStyle(mine) {
    return {
      fontFamily: FONT, fontSize: 15.5, lineHeight: 1.45, padding: "12px 15px", borderRadius: 14,
      background: mine ? "#006CB8" : "#fff", color: mine ? "#fff" : "#2E2D29",
      border: mine ? "none" : "1px solid #E3E9EE",
      borderBottomRightRadius: mine ? 4 : 14, borderBottomLeftRadius: mine ? 14 : 4,
      boxShadow: mine ? "none" : "0 1px 2px rgba(0,0,0,.05)",
    };
  }
  function DrawerHeader({ onClose, subtitle }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", borderBottom: "1px solid #E3E9EE", flexShrink: 0 }}>
        <span style={{ width: 40, height: 40, borderRadius: 40, background: "#fff url(" + MASCOT + ") center/120% no-repeat", border: "2px solid #FDECEC" }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>Guide Me · RExI</div>
          <div style={{ fontFamily: FONT, fontSize: 13, color: "#76746F" }}>{subtitle}</div>
        </div>
        <button onClick={onClose} style={{ border: "none", background: "transparent", color: "#53565A", cursor: "pointer", padding: 4 }}><I.x size={22} /></button>
      </div>
    );
  }
  function Composer({ value, setValue, onSend, busy }) {
    return (
      <div style={{ borderTop: "1px solid #E3E9EE", padding: 14, flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <textarea value={value} onChange={(e) => setValue(e.target.value)} disabled={busy}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
            placeholder="Type your response…" rows={2}
            style={{
              width: "100%", boxSizing: "border-box", resize: "none", fontFamily: FONT, fontSize: 15.5, color: "#2E2D29",
              padding: "12px 84px 12px 14px", borderRadius: 12, border: "1.5px solid #C0C0BF", outline: "none", lineHeight: 1.4,
            }} />
          <button onClick={onSend} disabled={busy || !value.trim()} style={{
            position: "absolute", right: 8, bottom: 10, display: "flex", alignItems: "center", gap: 6,
            fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#fff",
            background: busy || !value.trim() ? "#E59aa0" : "#E50808", border: "none", borderRadius: 9, padding: "8px 14px",
            cursor: busy || !value.trim() ? "default" : "pointer",
          }}><I.send size={15} /> Send</button>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent", color: "#006CB8", fontFamily: FONT, fontSize: 14, cursor: "pointer", padding: 0 }}>
            <I.headphones size={17} /> Contact live agent
          </button>
          <span style={{ fontFamily: FONT, fontSize: 12.5, color: "#9aa3ab" }}>Press Enter to send</span>
        </div>
      </div>
    );
  }

  function GuideMeDrawer({ open, mode, notify, onApply, onClose, onGoReview, onSent }) {
    return (
      <>
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(15,30,45,0.18)", zIndex: 40,
          opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity .25s",
        }} />
        <aside style={{
          position: "fixed", top: 0, right: 0, height: "100%", width: 440, maxWidth: "100vw", background: "#FBFCFD",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.16)", zIndex: 41, display: "flex", flexDirection: "column",
          transform: open ? "translateX(0)" : "translateX(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        }}>
          {open && (notify
            ? <NotifyMode notify={notify} onClose={onClose} onSent={onSent} />
            : mode === "autofill"
              ? <AutofillMode onApply={onApply} onClose={onClose} onGoReview={onGoReview} />
              : <ChatMode onApply={onApply} onClose={onClose} onGoReview={onGoReview} />)}
        </aside>
      </>
    );
  }

  window.RExGuide = { GuideMeDrawer };
})();
