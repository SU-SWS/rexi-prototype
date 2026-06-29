import React from 'react';
import ReactDOM from 'react-dom/client';
// screens.jsx — RExI flow screens (welcome, step, review, activation, simple pages)
(function () {
  const I = window.RExIcons;
  const { Field, isAnswered, displayValue, valuesEqual, FONT } = window.RExFields;
  const { SAMPLE_ANSWERS, DOCUMENTS, SERVICES } = window.RExData;

  // ── Shared footer bar ──────────────────────────────────────────────
  function Footer({ onBack, onSaveExit, onPrimary, primaryLabel = "Continue", primaryDisabled, progress, hint }) {
    return (
      <div style={{
        borderTop: "1px solid #C0C0BF", background: "#fff", padding: "16px 40px",
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <button onClick={onBack} disabled={!onBack} style={{
          display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
          color: onBack ? "#006CB8" : "#C0C0BF", fontFamily: FONT, fontSize: 16, fontWeight: 600,
          cursor: onBack ? "pointer" : "default",
        }}>
          <span style={{ transform: "rotate(180deg)", display: "grid", placeItems: "center" }}><I.chevronRight size={18} /></span>
          Back
        </button>
        {progress && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {progress.map((done, i) => (
              <span key={i} style={{ width: done ? 26 : 22, height: 5, borderRadius: 5, background: done ? "#006CB8" : "#D7DEE4", transition: "all .2s" }} />
            ))}
          </div>
        )}
        {!progress && <div style={{ flex: 1 }} />}
        {hint && <span style={{ fontFamily: FONT, fontSize: 13.5, color: "#9a8a55", whiteSpace: "nowrap" }}>{hint}</span>}
        <button onClick={onSaveExit} style={{
          fontFamily: FONT, fontSize: 16, fontWeight: 600, color: "#006CB8", background: "#fff",
          border: "1.5px solid #006CB8", borderRadius: 8, padding: "12px 28px", cursor: "pointer",
        }}>Save &amp; Exit</button>
        <button onClick={onPrimary} disabled={primaryDisabled} style={{
          fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#fff",
          background: primaryDisabled ? "#9FB9CC" : "#006CB8", border: "none", borderRadius: 8,
          padding: "12px 36px", cursor: primaryDisabled ? "default" : "pointer", transition: "background .15s",
        }}>{primaryLabel}</button>
      </div>
    );
  }

  // ── Question block ──────────────────────────────────────────────────
  function QuestionBlock({ q, value, onChange, aiFilled }) {
    return (
      <div style={{ position: "relative", padding: "4px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h3 style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 24, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{q.label}</h3>
          {aiFilled && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4, fontFamily: FONT, fontSize: 13, fontWeight: 700,
              color: "#B1040E", background: "#FDECEC", border: "1px solid #F4C9CC", borderRadius: 999, padding: "3px 9px",
            }}><I.sparkles size={13} /> Filled by RExI</span>
          )}
        </div>
        {q.help && <p style={{ fontFamily: FONT, fontSize: 16, color: "#53565A", margin: "0 0 14px", maxWidth: 760 }}>{q.help}</p>}
        <div style={{
          borderRadius: 8, transition: "background .6s, box-shadow .6s",
          background: aiFilled ? "rgba(229,8,8,0.05)" : "transparent",
          boxShadow: aiFilled ? "0 0 0 2px rgba(229,8,8,0.18)" : "none",
          padding: aiFilled ? "12px" : "0", margin: aiFilled ? "0 -12px" : "0",
        }}>
          <Field q={q} value={value} onChange={onChange} />
        </div>
      </div>
    );
  }

  // ── Step screen ─────────────────────────────────────────────────────
  function StepScreen({ step, answers, setAnswer, aiFilled, onBack, onContinue, onSaveExit, progress }) {
    const unanswered = step.questions.filter((q) => !isAnswered(q, answers[q.id])).length;
    const scrollRef = React.useRef(null);
    React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [step.id]);
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "34px 48px 40px" }}>
          <div style={{ fontFamily: FONT, fontSize: 18, color: "#2E2D29", fontWeight: 600 }}>{step.eyebrow}</div>
          <div style={{ fontFamily: FONT, fontSize: 15, color: "#76746F", marginTop: 2 }}>{step.progress}</div>
          <h2 style={{
            fontFamily: "'Source Sans 3',sans-serif", fontSize: 34, fontWeight: 600, color: "#0A0A0A",
            margin: "26px 0 36px", maxWidth: 1000, lineHeight: 1.18, textWrap: "pretty",
          }}>{step.title}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 38, maxWidth: 1060 }}>
            {step.questions.map((q) => (
              <QuestionBlock key={q.id} q={q} value={answers[q.id]} aiFilled={aiFilled.has(q.id)}
                onChange={(v) => setAnswer(q.id, v)} />
            ))}
          </div>
        </div>
        <Footer onBack={onBack} onSaveExit={onSaveExit} onPrimary={onContinue}
          hint={unanswered ? `${unanswered} question${unanswered > 1 ? "s" : ""} unanswered — you can finish later` : null}
          progress={progress} />
      </div>
    );
  }

  // ── Welcome / choose-how-to-start ───────────────────────────────────
  function WelcomeScreen({ onGuide, onManual, onSample, onResume }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflowY: "auto", padding: "60px 64px", display: "flex", alignItems: "center", gap: 48, justifyContent: "center" }}>
          <div style={{ maxWidth: 540 }}>
            <h2 style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 38, fontWeight: 700, color: "#0A0A0A", margin: "0 0 20px", lineHeight: 1.15 }}>
              Welcome to your new study workspace.
            </h2>
            <p style={{ fontFamily: FONT, fontSize: 21, color: "#2E2D29", lineHeight: 1.5, margin: "0 0 14px" }}>
              I can <strong>guide you</strong> through a handful of quick questions and configure the right
              environment for your project — or you can do it yourself and Save &amp; Exit any time.
            </p>
            <p style={{ fontFamily: FONT, fontSize: 18, color: "#76746F", margin: "0 0 32px" }}>
              Nothing is committed until you activate the study.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={onGuide} style={{
                display: "flex", alignItems: "center", gap: 10, fontFamily: FONT, fontSize: 18, fontWeight: 700,
                color: "#B1040E", background: "#fff", border: "1.5px solid #B1040E", borderRadius: 10, padding: "14px 30px", cursor: "pointer",
              }}><I.sparkles size={20} /> Guide me</button>
              <button onClick={onManual} style={{
                fontFamily: FONT, fontSize: 18, fontWeight: 700, color: "#fff", background: "#006CB8",
                border: "none", borderRadius: 10, padding: "14px 34px", cursor: "pointer",
              }}>Do it myself</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 22 }}>
              <button onClick={onResume} style={{
                display: "flex", alignItems: "center", gap: 12, textAlign: "left", width: "100%", maxWidth: 480,
                background: "#F3F8FC", border: "1px solid #CFE3F1", borderRadius: 10, padding: "14px 16px", cursor: "pointer",
              }}>
                <span style={{ width: 40, height: 40, borderRadius: 8, background: "#E7F5FF", color: "#006CB8", display: "grid", placeItems: "center", flexShrink: 0 }}><I.clipboard size={22} /></span>
                <span>
                  <span style={{ display: "block", fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#0A5A99" }}>Resume an existing study</span>
                  <span style={{ display: "block", fontFamily: FONT, fontSize: 14, color: "#53565A" }}>In-progress intake with documents already submitted to services.</span>
                </span>
              </button>
              <button onClick={onSample} style={{
                fontFamily: FONT, fontSize: 15, color: "#006CB8", background: "transparent",
                border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, textAlign: "left",
              }}>Or load a fully-filled sample study to explore</button>
            </div>
          </div>
          <img src="assets/rexi-mascot.png" alt="RExI mascot" style={{ width: 230, height: "auto", flexShrink: 0 }} />
        </div>
      </div>
    );
  }

  // ── Review ──────────────────────────────────────────────────────────
  function ReviewScreen({ steps, answers, qIndex, submitted, submittedDocs, notified, onEdit, onBack, onSaveExit, onActivate, onNotify }) {
    const scrollRef = React.useRef(null);
    React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, []);

    const missing = [];
    steps.forEach((s) => s.questions.forEach((q) => { if (!isAnswered(q, answers[q.id])) missing.push({ ...q, stepId: s.id }); }));

    // Fields that changed vs the submitted baseline
    const changedIds = Object.keys(qIndex).filter((id) =>
      isAnswered(qIndex[id], submitted ? submitted[id] : undefined) && !valuesEqual(submitted[id], answers[id]));

    // Submitted documents impacted by those changes
    const affected = DOCUMENTS.filter((d) => submittedDocs && submittedDocs.has(d.id) && d.fields.some((f) => changedIds.includes(f)));
    const byService = {};
    affected.forEach((d) => { (byService[d.service] = byService[d.service] || []).push(d); });

    const changeDetail = (id) => ({
      label: qIndex[id].label, from: displayValue(qIndex[id], submitted[id]), to: displayValue(qIndex[id], answers[id]),
    });

    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "40px 48px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 420px" }}>
              <h2 style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 36, fontWeight: 600, color: "#0A0A0A", margin: "0 0 14px", lineHeight: 1.15 }}>
                Accuracy is everything. Time for a quick review.
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 20, color: "#53565A", margin: 0, maxWidth: 480 }}>
                Confirm everything is right. You can activate now and finish any open items later.
              </p>
            </div>
            <img src="assets/review-illustration.png" alt="" style={{ width: 300, height: "auto", flexShrink: 0 }} />
          </div>

          {/* ── ALERTS ───────────────────────────────────────────── */}
          {(missing.length > 0 || affected.length > 0) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 980, marginBottom: 28 }}>
              {missing.length > 0 && (
                <div style={{ background: "#FFF8EC", border: "1px solid #F0D38A", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                    <span style={{ color: "#C9920A" }}><I.exclaim size={20} /></span>
                    <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, fontWeight: 700, color: "#7a5b00" }}>
                      {missing.length} question{missing.length > 1 ? "s" : ""} still unfinished
                    </span>
                  </div>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "#8a6d22", margin: "0 0 10px" }}>
                    You can activate without these — they’ll stay open as tasks and won’t block your study.
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {missing.map((q) => (
                      <button key={q.id} onClick={() => onEdit(q.stepId)} style={{
                        display: "flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 14, color: "#7a5b00",
                        background: "#fff", border: "1px solid #ECCF86", borderRadius: 999, padding: "6px 13px", cursor: "pointer",
                      }}>{q.label.length > 46 ? q.label.slice(0, 46) + "…" : q.label} <I.chevronRight size={13} /></button>
                    ))}
                  </div>
                </div>
              )}

              {affected.length > 0 && (
                <div style={{ background: "#FDF2F2", border: "1px solid #F2C4C7", borderRadius: 12, padding: "16px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                    <span style={{ color: "#B1040E" }}><I.exclaim size={20} /></span>
                    <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, fontWeight: 700, color: "#8e0a13" }}>
                      Your changes affect {affected.length} already-submitted document{affected.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <p style={{ fontFamily: FONT, fontSize: 15, color: "#9c4047", margin: "0 0 14px" }}>
                    These documents were already submitted to a service. Because the answers below changed, they’ll need to be updated and <strong>resubmitted</strong>. RExI can notify each service for you.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {Object.entries(byService).map(([svc, docs]) => {
                      const fieldIds = [...new Set(docs.flatMap((d) => d.fields.filter((f) => changedIds.includes(f))))];
                      const docIds = docs.map((d) => d.id);
                      const done = docIds.every((id) => notified && notified.has(id));
                      return (
                        <div key={svc} style={{ background: "#fff", border: "1px solid #F0D0D2", borderRadius: 10, padding: "13px 15px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 320px" }}>
                              <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{SERVICES[svc]}</div>
                              <div style={{ fontFamily: FONT, fontSize: 14, color: "#76746F", margin: "2px 0 9px" }}>
                                Needs resubmission: {docs.map((d) => d.name).join(", ")}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                {fieldIds.map((fid) => {
                                  const c = changeDetail(fid);
                                  return (
                                    <div key={fid} style={{ fontFamily: FONT, fontSize: 13.5, color: "#53565A" }}>
                                      <strong style={{ color: "#0A0A0A", fontWeight: 600 }}>{c.label}:</strong>{" "}
                                      <span style={{ textDecoration: "line-through", opacity: 0.7 }}>{c.from}</span>{" "}
                                      <span style={{ color: "#8e0a13" }}>→ {c.to}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                            {done ? (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#1f8a4d", whiteSpace: "nowrap" }}>
                                <I.check size={16} sw={2.6} /> Resubmission requested
                              </span>
                            ) : (
                              <button onClick={() => onNotify({
                                serviceKey: svc, serviceName: SERVICES[svc],
                                docs: docs.map((d) => d.name), docIds, changes: fieldIds.map(changeDetail),
                              })} style={{
                                display: "flex", alignItems: "center", gap: 7, fontFamily: FONT, fontSize: 14, fontWeight: 700,
                                color: "#fff", background: "#E50808", border: "none", borderRadius: 8, padding: "10px 15px", cursor: "pointer", whiteSpace: "nowrap",
                              }}><I.sparkles size={15} /> Ask RExI to notify</button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── SUMMARY ──────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 980 }}>
            {steps.map((s) => (
              <div key={s.id} style={{ border: "1px solid #DCE3E9", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "#F3F8FC", padding: "12px 18px", borderBottom: "1px solid #DCE3E9",
                }}>
                  <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 19, fontWeight: 600, color: "#0A5A99" }}>{s.label}</span>
                  <button onClick={() => onEdit(s.id)} style={{
                    display: "flex", alignItems: "center", gap: 6, border: "none", background: "transparent",
                    color: "#006CB8", fontFamily: FONT, fontSize: 15, fontWeight: 600, cursor: "pointer",
                  }}><I.pencil size={16} /> Edit</button>
                </div>
                <div>
                  {s.questions.map((q, i) => {
                    const ok = isAnswered(q, answers[q.id]);
                    const changed = changedIds.includes(q.id);
                    return (
                      <div key={q.id} style={{
                        display: "flex", gap: 20, padding: "13px 18px",
                        borderTop: i ? "1px solid #EEF2F5" : "none", alignItems: "flex-start",
                        background: changed ? "#FDF6F6" : "transparent",
                      }}>
                        <div style={{ flex: "0 0 300px", fontFamily: FONT, fontSize: 16, color: "#53565A" }}>{q.label}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: FONT, fontSize: 17, color: ok ? "#0A0A0A" : "#B1040E", fontWeight: ok ? 500 : 600 }}>
                              {ok ? displayValue(q, answers[q.id]) : "Unfinished"}
                            </span>
                            {changed && (
                              <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#8e0a13", background: "#FBE3E4", border: "1px solid #F2C4C7", borderRadius: 999, padding: "2px 8px" }}>Changed</span>
                            )}
                          </div>
                          {changed && (
                            <div style={{ fontFamily: FONT, fontSize: 13.5, color: "#9a8a8a", marginTop: 3 }}>
                              was <span style={{ textDecoration: "line-through" }}>{displayValue(q, submitted[q.id])}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer onBack={onBack} onSaveExit={onSaveExit} onPrimary={onActivate}
          primaryLabel="Activate study"
          hint={missing.length || affected.length ? "Open items won’t block activation" : null} />
      </div>
    );
  }

  // ── Activation (celebration) ────────────────────────────────────────
  function ActivationScreen({ study, steps, answers, qIndex, onRestart, onGoOverview }) {
    const get = (id) => answers[id];
    const stats = [
      { label: "Study type", value: get("category") || "—" },
      { label: "Phase", value: get("phase") || "—" },
      { label: "Team members", value: Array.isArray(get("members")) ? get("members").length : 0 },
      { label: "Target enrollment", value: get("enrollment") ? `${get("enrollment")}` : "—" },
    ];
    return (
      <div style={{ position: "relative", height: "100%", overflowY: "auto" }}>
        <Confetti />
        <div style={{ position: "relative", padding: "48px 56px 56px", maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
            <img src="assets/rexi-mascot.png" alt="" style={{ width: 150, height: "auto", flexShrink: 0 }} />
            <div style={{ flex: "1 1 380px" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#E7F6EC", color: "#1f8a4d",
                border: "1px solid #B6E0C4", borderRadius: 999, padding: "6px 14px",
                fontFamily: FONT, fontWeight: 700, fontSize: 14, marginBottom: 14,
              }}><I.checkSolid size={16} /> Study activated</div>
              <h2 style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 40, fontWeight: 700, color: "#0A0A0A", margin: "0 0 12px", lineHeight: 1.1 }}>
                Your study is active. You’re ready for the next step.
              </h2>
              <p style={{ fontFamily: FONT, fontSize: 20, color: "#53565A", margin: 0 }}>
                <strong style={{ color: "#0A5A99" }}>{study.title}</strong> is now set up in your Research Portfolio.
                Documents and tasks have been generated for your team.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, margin: "36px 0" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ background: "#F3F8FC", border: "1px solid #DCE3E9", borderRadius: 10, padding: "18px 20px" }}>
                <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 28, fontWeight: 700, color: "#0A5A99" }}>{s.value}</div>
                <div style={{ fontFamily: FONT, fontSize: 15, color: "#53565A", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", border: "1px solid #DCE3E9", borderRadius: 12, padding: "22px 24px", marginBottom: 32 }}>
            <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 18, fontWeight: 600, color: "#0A0A0A", marginBottom: 14 }}>What’s next</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { ic: <I.doc size={20} />, t: "Upload study documents", d: "Protocol, consent forms, and the IRB submission packet." },
                { ic: <I.clipboard size={20} />, t: "Complete activation tasks", d: "8 tasks routed to your team to open the study to enrollment." },
                { ic: <I.users size={20} />, t: "Invite your team", d: "Notify members so they can access their assignments." },
              ].map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <span style={{ width: 38, height: 38, borderRadius: 8, background: "#E7F5FF", color: "#006CB8", display: "grid", placeItems: "center", flexShrink: 0 }}>{n.ic}</span>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 600, color: "#0A0A0A" }}>{n.t}</div>
                    <div style={{ fontFamily: FONT, fontSize: 15, color: "#53565A" }}>{n.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button onClick={onGoOverview} style={{
              fontFamily: FONT, fontSize: 17, fontWeight: 700, color: "#fff", background: "#006CB8",
              border: "none", borderRadius: 10, padding: "14px 30px", cursor: "pointer",
            }}>Go to Study Overview</button>
            <button onClick={onRestart} style={{
              fontFamily: FONT, fontSize: 17, fontWeight: 600, color: "#006CB8", background: "#fff",
              border: "1.5px solid #006CB8", borderRadius: 10, padding: "14px 30px", cursor: "pointer",
            }}>Start a new study (restart demo)</button>
          </div>
        </div>
      </div>
    );
  }

  function Confetti() {
    const pieces = React.useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
      left: Math.random() * 100, delay: Math.random() * 0.6, dur: 2.4 + Math.random() * 1.8,
      color: ["#006CB8", "#E50808", "#FEDD5C", "#1f8a4d", "#0A5A99"][i % 5],
      size: 6 + Math.random() * 7, rot: Math.random() * 360,
    })), []);
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        {pieces.map((p, i) => (
          <span key={i} style={{
            position: "absolute", top: -20, left: p.left + "%", width: p.size, height: p.size * 0.6,
            background: p.color, borderRadius: 1, transform: `rotate(${p.rot}deg)`,
            animation: `rexiFall ${p.dur}s ${p.delay}s ease-in forwards`,
          }} />
        ))}
      </div>
    );
  }

  // ── Simple placeholder pages (Home / Portfolio) ─────────────────────
  function SimplePage({ title, body }) {
    return (
      <div style={{ padding: "60px 64px", maxWidth: 760 }}>
        <h2 style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 34, fontWeight: 700, color: "#0A0A0A", margin: "0 0 14px" }}>{title}</h2>
        <p style={{ fontFamily: FONT, fontSize: 19, color: "#53565A", lineHeight: 1.5 }}>{body}</p>
      </div>
    );
  }

  window.RExScreens = { StepScreen, WelcomeScreen, ReviewScreen, ActivationScreen, SimplePage, Footer };
})();
