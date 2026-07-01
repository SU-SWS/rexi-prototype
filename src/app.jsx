import React from 'react';
import ReactDOM from 'react-dom/client';
// app.jsx — RExI prototype root: state, routing, tweaks
(function () {
  const { Sidebar, Header } = window.RExShell;
  const { StepScreen, WelcomeScreen, ReviewScreen, ActivationScreen, SimplePage } = window.RExScreens;
  const { GuideMeDrawer } = window.RExGuide;
  const { GuideMeAgentScreen } = window.RExGuideMeAgent;
  const { OverviewPage, DocumentsPage } = window.RExPages;
  const { TasksPage } = window.RExTasks;
  const { PortfolioPage } = window.RExPortfolio;
  const { ResearchAdminServicesPage, ResearchAdminBudgetPage } = window.RExAdminServices;
  const { LandingPage } = window.RExLanding;
  const { isAnswered } = window.RExFields;
  const { STUDY, STEPS, SAMPLE_ANSWERS, QUESTION_INDEX, DOCUMENTS, EXISTING_STUDY } = window.RExData;

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "guideMode": "chat",
    "autoOpen": false,
    "nudge": true
  }/*EDITMODE-END*/;

  const ORDER = ["welcome", ...STEPS.map((s) => s.id), "review", "activation"];

  function App() {
    const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);
    const [screen, setScreen] = React.useState("welcome");
    const [answers, setAnswers] = React.useState({});
    const [submitted, setSubmitted] = React.useState({});       // snapshot already sent to services
    const [submittedDocs, setSubmittedDocs] = React.useState(new Set());
    const [notified, setNotified] = React.useState(new Set());  // doc ids RExI has requested resubmission for
    const [notifyCtx, setNotifyCtx] = React.useState(null);     // service-notification draft context
    const [aiFilled, setAiFilled] = React.useState(new Set());
    const [guideOpen, setGuideOpen] = React.useState(false);
    const [guideAgentOpen, setGuideAgentOpen] = React.useState(false);
    const [guideReturnScreen, setGuideReturnScreen] = React.useState(null);
    const [progressOn, setProgressOn] = React.useState(true);
    const [toast, setToast] = React.useState(null);
    const aiTimer = React.useRef(null);

    React.useEffect(() => {
      if (t.autoOpen) { const id = setTimeout(() => setGuideOpen(true), 700); return () => clearTimeout(id); }
    }, []);

    const setAnswer = (id, v) => setAnswers((a) => ({ ...a, [id]: v }));

    // Steps whose every question is answered
    const completed = React.useMemo(() => {
      const set = new Set();
      STEPS.forEach((s) => { if (s.questions.every((q) => isAnswered(q, answers[q.id]))) set.add(s.id); });
      return set;
    }, [answers]);

    const applyAI = (incoming) => {
      const ids = Object.keys(incoming || {});
      if (!ids.length) return;
      setAnswers((a) => ({ ...a, ...incoming }));
      setAiFilled(new Set(ids));
      if (aiTimer.current) clearTimeout(aiTimer.current);
      aiTimer.current = setTimeout(() => setAiFilled(new Set()), 5200);
      setScreen((sc) => (["welcome", "home", "portfolio"].includes(sc) ? STEPS[0].id : sc));
    };

    const flashToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

    // Resume an existing study: answers + submitted snapshot + already-submitted docs
    const resumeStudy = () => {
      const base = { ...EXISTING_STUDY.answers };
      setAnswers(base);
      setSubmitted({ ...base });
      setSubmittedDocs(new Set(DOCUMENTS.filter((d) => d.fields.every((f) => isAnswered(QUESTION_INDEX[f], base[f]))).map((d) => d.id)));
      setNotified(new Set());
      setAiFilled(new Set());
      setScreen("review");
      flashToast("Existing study loaded — documents already submitted");
    };

    const openGuide = () => { setGuideReturnScreen(screen); setGuideAgentOpen(true); };
    const closeGuide = () => { setGuideOpen(false); setNotifyCtx(null); };
    const requestNotify = (ctx) => { setNotifyCtx(ctx); setGuideOpen(true); };
    const markNotified = (docIds) => { setNotified((prev) => new Set([...prev, ...docIds])); flashToast("Resubmission request sent to " + (notifyCtx ? notifyCtx.serviceName : "service")); };

    const stepIndex = STEPS.findIndex((s) => s.id === screen);
    const goNext = () => {
      if (stepIndex === -1) return;
      if (stepIndex < STEPS.length - 1) setScreen(STEPS[stepIndex + 1].id);
      else setScreen("review");
    };
    const goBack = () => {
      if (stepIndex > 0) setScreen(STEPS[stepIndex - 1].id);
      else if (stepIndex === 0) setScreen("welcome");
      else if (screen === "review") setScreen(STEPS[STEPS.length - 1].id);
    };
    const navigate = (id) => { closeGuide(); setScreen(id); };

    const progressDots = STEPS.map((s) => completed.has(s.id) || (stepIndex > STEPS.findIndex((x) => x.id === s.id)));

    let body;
    if (guideAgentOpen) {
      body = <GuideMeAgentScreen
        onExit={() => { setGuideAgentOpen(false); }}
        onComplete={(answers) => { applyAI(answers); setGuideAgentOpen(false); }}
      />;
    } else if (screen === "welcome") {
      body = <WelcomeScreen
        onGuide={openGuide}
        onManual={() => setScreen(STEPS[0].id)}
        onResume={resumeStudy}
        onSample={() => { applyAI(SAMPLE_ANSWERS); flashToast("Sample study loaded"); setScreen("review"); }} />;
    } else if (screen === "home") {
      // Landing page renders full-screen (handled below, body stays null)
      body = null;
    } else if (screen === "portfolio") {
      body = <PortfolioPage onNewStudy={() => setScreen(STEPS[0].id)} />;
    } else if (screen === "overview") {
      body = <OverviewPage onGuide={openGuide} onActivate={() => setScreen("review")} onEditTeam={() => setScreen("team")} />;
    } else if (screen === "documents") {
      body = <DocumentsPage onGuide={openGuide} />;
    } else if (screen === "tasks") {
      body = <TasksPage onGuide={openGuide} />;
    } else if (screen === "adminServices") {
      body = <ResearchAdminServicesPage onGuide={openGuide} onBudget={() => navigate("adminBudget")} />;
    } else if (screen === "adminBudget") {
      body = <ResearchAdminBudgetPage onGuide={openGuide} />;
    } else if (stepIndex !== -1) {
      body = <StepScreen step={STEPS[stepIndex]} answers={answers} setAnswer={setAnswer} aiFilled={aiFilled}
        onBack={goBack} onContinue={goNext} onSaveExit={() => { flashToast("Progress saved — nothing is committed yet"); }}
        progress={progressOn ? progressDots : null} />;
    } else if (screen === "review") {
      body = <ReviewScreen steps={STEPS} answers={answers} qIndex={QUESTION_INDEX}
        submitted={submitted} submittedDocs={submittedDocs} notified={notified}
        onEdit={(id) => setScreen(id)} onBack={goBack} onNotify={requestNotify}
        onSaveExit={() => flashToast("Progress saved — nothing is committed yet")}
        onActivate={() => setScreen("activation")} />;
    } else if (screen === "activation") {
      body = <ActivationScreen study={STUDY} steps={STEPS} answers={answers} qIndex={QUESTION_INDEX}
        onGoOverview={() => setScreen(STEPS[0].id)}
        onRestart={() => { setAnswers({}); setSubmitted({}); setSubmittedDocs(new Set()); setNotified(new Set()); setAiFilled(new Set()); setScreen("welcome"); }} />;
    }

    if (screen === "home" && !guideAgentOpen) {
      return (
        <LandingPage
          onPortfolio={() => setScreen("portfolio")}
          onGuide={() => { setGuideReturnScreen("overview"); setGuideAgentOpen(true); }}
        />
      );
    }

    return (
      <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#fff" }}>
        {/* Sidebar slides out when Guide Me is full-screen */}
        <div style={{
          width: guideAgentOpen ? 0 : 320, flexShrink: 0,
          overflow: "hidden", transition: "width 0.3s ease",
        }}>
          <Sidebar steps={STEPS} current={screen} completed={completed} study={STUDY}
            onNavigate={navigate} onGuideMe={openGuide} guidePulse={t.nudge && !guideOpen} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Header study={STUDY} progressOn={progressOn} onToggleProgress={() => setProgressOn((v) => !v)} />
          <main style={{ flex: 1, minHeight: 0, background: "#fff", position: "relative" }}>{body}</main>
        </div>

        <GuideMeDrawer open={guideOpen} mode={t.guideMode} notify={notifyCtx} onApply={applyAI}
          onClose={closeGuide} onSent={markNotified}
          onGoReview={() => { closeGuide(); setScreen("review"); }} />

        {toast && (
          <div style={{
            position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 60,
            background: "#0A0A0A", color: "#fff", fontFamily: "'Source Sans Pro',sans-serif", fontSize: 15,
            padding: "12px 22px", borderRadius: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
          }}>{toast}</div>
        )}

        <window.TweaksPanel>
          <window.TweakSection label="Guide Me experience" />
          <window.TweakRadio label="AI mode" value={t.guideMode}
            options={["chat", "autofill"]} onChange={(v) => setTweak("guideMode", v)} />
          <window.TweakToggle label="Auto-open on launch" value={t.autoOpen} onChange={(v) => setTweak("autoOpen", v)} />
          <window.TweakToggle label="Pulse Guide Me badge" value={t.nudge} onChange={(v) => setTweak("nudge", v)} />
        </window.TweaksPanel>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
})();
