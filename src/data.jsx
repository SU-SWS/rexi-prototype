import React from 'react';
import ReactDOM from 'react-dom/client';
// data.jsx — Central Services flow configuration (steps, questions, options) + demo study
(function () {
  // ── The study being activated (header content) ───────────────────
  const STUDY = {
    rexiId: "12345",
    title: "Pembro + Chemo in NSCLC",
    subtitle: "Phase III Randomized Trial of Pembrolizumab + Chemotherapy in NSCLC",
    pi: "Dr. Albert Chiou",
    activationDays: 75,
    // Study-lifecycle "subway map" shown in the header
    phases: [
      { label: "Exploration", state: "done" },
      { label: "Pre-Start up", state: "done" },
      { label: "Start up", state: "current", pct: 42 },
      { label: "Approvals and Awards", state: "locked" },
      { label: "Activation", state: "locked" },
    ],
  };

  // ── Static dashboard content (Study Overview page) ────────────────
  const OVERVIEW = {
    headline: "You’ve finished exploration",
    intro: "Exploration is complete and your study scaffold is in place. Review what needs attention, then continue into start-up — or let Central Services drive the activation tasks for you.",
    identifiers: [
      "SPO — 12345-NSCLC", "IRB — 2026-0142",
      "ONCO — A18-2026", "NCT — 04875013",
      "IND — 154872", "Sponsor — KEYNOTE-A18",
    ],
    agentic: "I can answer your questions, upload your documentation, and get you started — or you can continue on your own and begin study activation to set up your tasks while I manage the study behind the scenes.",
    atRisk: [
      { tag: "Due: May 15, 2026", title: "First sponsor contact", owner: "Dean Amoroso" },
      { tag: "Start by May 5", title: "SRC meeting date", owner: "Dean Amoroso" },
      { tag: "Start by May 5", title: "Submission to local or central IRB", owner: "Dean Amoroso" },
    ],
    studyTeam: [
      { name: "Dr. Albert Chiou", role: "Principal Investigator" },
      { name: "Marcus Lee, RN", role: "Research Nurse" },
      { name: "Priya Natarajan", role: "Study Coordinator" },
    ],
    adminTeam: [
      { name: "Dean Amoroso", role: "Research Administrator" },
      { name: "Sofia Reyes", role: "Regulatory Coordinator" },
      { name: "Tom Becker", role: "Grants & Contracts Manager" },
    ],
  };

  // ── Static document register (Documents page) ─────────────────────
  const STUDY_DOCS = [
    { type: "Protocol", desc: "KEYNOTE-A18 protocol, v4.0 (amendment 3)", received: "Apr 2, 2026", expires: "—", by: "Dean Amoroso", comment: "Supersedes v3.2" },
    { type: "Informed Consent", desc: "Main study ICF — English, v4.0", received: "Apr 2, 2026", expires: "Apr 1, 2027", by: "Dean Amoroso", comment: "IRB-stamped" },
    { type: "IRB Approval", desc: "Initial approval letter — IRB-2026-0142", received: "Apr 9, 2026", expires: "Apr 8, 2027", by: "Sofia Reyes", comment: "" },
    { type: "Investigator Brochure", desc: "Pembrolizumab IB, edition 18", received: "Mar 28, 2026", expires: "Mar 27, 2027", by: "Dean Amoroso", comment: "" },
    { type: "Lab Manual", desc: "Central laboratory manual, v2.1", received: "Apr 5, 2026", expires: "—", by: "Marcus Lee", comment: "Kit ordering, p.12" },
    { type: "Pharmacy Manual", desc: "Investigational product handling guide", received: "Apr 5, 2026", expires: "—", by: "Priya Natarajan", comment: "" },
    { type: "Monitoring Plan", desc: "Sponsor monitoring & SDV plan", received: "Apr 11, 2026", expires: "—", by: "Dean Amoroso", comment: "Risk-based" },
    { type: "Delegation Log", desc: "Site delegation of authority log", received: "Apr 12, 2026", expires: "—", by: "Sofia Reyes", comment: "" },
  ];

  const DOC_FILTERS = ["Document type", "Received by", "Expiration date", "Received date", "Last corrected", "Show deleted"];

  // Question types: 'single' | 'multi' | 'text' | 'longtext' | 'number' | 'date' | 'people'
  // Each flow step is a left-nav destination. Order matters.
  const STEPS = [
    {
      id: "basic",
      label: "Basic Info",
      eyebrow: "Basic Info",
      progress: "Step 1 of 6",
      title: "Tell us about the administrative aspects of the study.",
      questions: [
        {
          id: "oversight",
          label: "Research oversight group",
          help: "The institute or center that holds scientific oversight for this study.",
          type: "single",
          options: ["Cancer Center", "Cardiovascular Institute", "Neurosciences", "Immunology & Transplant", "Digestive Health", "Other"],
        },
        {
          id: "category",
          label: "Clinical research category / study type",
          help: "How the study intervenes with or observes participants.",
          type: "single",
          options: ["Interventional", "Observational", "Ancillary", "Expanded Access", "I don’t know yet"],
        },
        {
          id: "disease",
          label: "What are the name(s) of the disease(s) or condition(s) being studied?",
          help: "List each indication. Separate multiple conditions with a comma.",
          type: "text",
          placeholder: "e.g. Non-Small Cell Lung Cancer (NSCLC)",
        },
        {
          id: "fdaRegulated",
          label: "Is this study FDA-regulated (IND / IDE)?",
          help: "Studies of an investigational drug, biologic, or device usually require an IND or IDE.",
          type: "single",
          options: ["Yes — IND", "Yes — IDE", "No", "Not sure yet"],
        },
      ],
    },
    {
      id: "team",
      label: "Team",
      eyebrow: "Study Team",
      progress: "Step 2 of 6",
      title: "Let’s build your study team. First, tell us your role for this study.",
      questions: [
        {
          id: "myRole",
          label: "Select your role",
          help: "Your role determines the tasks and approvals routed to you.",
          type: "single",
          options: ["Principal Investigator", "Sub-Investigator", "Study Coordinator", "Research Nurse", "Regulatory Coordinator", "Research Administrator"],
        },
        {
          id: "members",
          label: "Add your study team",
          help: "Add the people who will work on this study. You can edit roles any time.",
          type: "people",
          roleOptions: ["Principal Investigator", "Sub-Investigator", "Study Coordinator", "Research Nurse", "Regulatory Coordinator", "Biostatistician", "Pharmacist"],
        },
      ],
    },
    {
      id: "sponsor",
      label: "Sponsor",
      eyebrow: "Sponsor",
      progress: "Step 3 of 6",
      title: "Who is funding and sponsoring this study?",
      questions: [
        {
          id: "sponsorType",
          label: "Sponsor type",
          help: "The kind of organization providing oversight or funding.",
          type: "single",
          options: ["Industry / Pharma", "Federal (NIH / NCI)", "Investigator-Initiated", "Foundation / Non-profit", "Cooperative Group"],
        },
        {
          id: "sponsorName",
          label: "Sponsor / funding organization name",
          help: "The legal name of the sponsoring organization.",
          type: "text",
          placeholder: "e.g. Merck Sharp & Dohme LLC",
        },
        {
          id: "fundingMech",
          label: "Funding mechanism",
          help: "How the work is funded at your institution.",
          type: "single",
          options: ["Industry contract", "Federal grant", "Internal / departmental", "Philanthropy", "Mixed"],
        },
      ],
    },
    {
      id: "identifiers",
      label: "Identifiers",
      eyebrow: "Identifiers",
      progress: "Step 4 of 6",
      title: "Tell us about your study identifiers — input them here.",
      questions: [
        {
          id: "nct",
          label: "ClinicalTrials.gov (NCT) number",
          help: "Format: NCT followed by 8 digits. Leave blank if not yet registered.",
          type: "text",
          placeholder: "NCT01234567",
        },
        {
          id: "irb",
          label: "IRB protocol number",
          help: "Assigned by your Institutional Review Board.",
          type: "text",
          placeholder: "IRB-2026-0142",
        },
        {
          id: "sponsorProtocol",
          label: "Sponsor protocol number",
          help: "The protocol identifier assigned by the sponsor.",
          type: "text",
          placeholder: "KEYNOTE-XXX",
        },
        {
          id: "indNumber",
          label: "IND / IDE number",
          help: "Only required if the study is FDA-regulated.",
          type: "text",
          placeholder: "IND 123456",
        },
      ],
    },
    {
      id: "details",
      label: "Details",
      eyebrow: "Study Details",
      progress: "Step 5 of 6",
      title: "A few details about how the study will run.",
      questions: [
        {
          id: "phase",
          label: "Study phase",
          help: "The clinical trial phase, if applicable.",
          type: "single",
          options: ["Phase I", "Phase I/II", "Phase II", "Phase III", "Phase IV", "Not applicable"],
        },
        {
          id: "enrollment",
          label: "Target enrollment",
          help: "Anticipated number of participants at your site.",
          type: "number",
          placeholder: "e.g. 120",
          suffix: "participants",
        },
        {
          id: "siteType",
          label: "Site participation",
          help: "Whether this is a single- or multi-site study.",
          type: "single",
          options: ["Single-site", "Multi-site (lead)", "Multi-site (participating)"],
        },
        {
          id: "startDate",
          label: "Anticipated activation date",
          help: "When you expect to begin enrolling participants.",
          type: "date",
        },
        {
          id: "population",
          label: "Special populations involved",
          help: "Select all that apply. Helps route the right approvals.",
          type: "multi",
          options: ["None", "Pediatric", "Pregnant individuals", "Cognitively impaired", "Prisoners", "Healthy volunteers"],
        },
      ],
    },
  ];

  // Realistic demo answers used by "Use sample study" and as AI seed reference.
  const SAMPLE_ANSWERS = {
    oversight: "Cancer Center",
    category: "Interventional",
    disease: "Non-Small Cell Lung Cancer (NSCLC)",
    fdaRegulated: "Yes — IND",
    myRole: "Principal Investigator",
    members: [
      { name: "Dr. Elena Vasquez", role: "Principal Investigator" },
      { name: "Marcus Lee, RN", role: "Research Nurse" },
      { name: "Priya Natarajan", role: "Study Coordinator" },
    ],
    sponsorType: "Industry / Pharma",
    sponsorName: "Merck Sharp & Dohme LLC",
    fundingMech: "Industry contract",
    nct: "NCT04875013",
    irb: "IRB-2026-0142",
    sponsorProtocol: "KEYNOTE-A18",
    indNumber: "IND 154872",
    phase: "Phase III",
    enrollment: "120",
    siteType: "Multi-site (participating)",
    startDate: "2026-08-15",
    population: ["None"],
  };

  // ── Services that receive intake documents ──────────────────────────
  const SERVICES = {
    irb: "IRB Office",
    contracts: "Research Contracts (SCICTO)",
    budget: "Budget & Finance",
    regulatory: "Regulatory Affairs",
  };

  // Documents generated from intake answers and submitted to a service.
  // `fields` = the question ids that feed this document. Changing any of
  // them after the doc is submitted means it must be resubmitted.
  const DOCUMENTS = [
    { id: "protocol", name: "Protocol Synopsis", service: "irb", fields: ["disease", "category", "phase"] },
    { id: "consent", name: "Informed Consent Form", service: "irb", fields: ["disease", "sponsorName"] },
    { id: "irbapp", name: "IRB Application", service: "irb", fields: ["category", "fdaRegulated", "phase", "myRole", "members"] },
    { id: "cta", name: "Clinical Trial Agreement", service: "contracts", fields: ["sponsorName", "sponsorType", "fundingMech"] },
    { id: "budget", name: "Study Budget", service: "budget", fields: ["enrollment", "sponsorType", "fundingMech"] },
    { id: "regpacket", name: "Regulatory Packet (IND)", service: "regulatory", fields: ["fdaRegulated", "indNumber", "sponsorProtocol", "nct"] },
  ];

  // An EXISTING study mid-intake: most fields complete, documents already
  // submitted to services. Used by the "Resume existing study" entry to
  // demonstrate change-impact + resubmission alerts. (startDate left blank
  // on purpose to show an "unfinished" item at review.)
  const EXISTING_STUDY = {
    answers: {
      oversight: "Cancer Center",
      category: "Interventional",
      disease: "Non-Small Cell Lung Cancer (NSCLC)",
      fdaRegulated: "Yes — IND",
      myRole: "Principal Investigator",
      members: [
        { name: "Dr. Elena Vasquez", role: "Principal Investigator" },
        { name: "Marcus Lee, RN", role: "Research Nurse" },
        { name: "Priya Natarajan", role: "Study Coordinator" },
      ],
      sponsorType: "Industry / Pharma",
      sponsorName: "Merck Sharp & Dohme LLC",
      fundingMech: "Industry contract",
      nct: "NCT04875013",
      irb: "IRB-2026-0142",
      sponsorProtocol: "KEYNOTE-A18",
      indNumber: "IND 154872",
      phase: "Phase III",
      enrollment: "120",
      siteType: "Multi-site (participating)",
      population: ["None"],
      // startDate intentionally omitted
    },
    submittedOn: "April 9, 2026",
  };

  // Map every question id -> {stepId, label, type} for the Review screen + AI.
  const QUESTION_INDEX = {};
  STEPS.forEach((s) => s.questions.forEach((q) => {
    QUESTION_INDEX[q.id] = { stepId: s.id, stepLabel: s.label, ...q };
  }));

  // ── Study Tasks ─────────────────────────────────────────────────────
  // priority drives the card's left-border color (consistent across views).
  const PRIORITY_META = {
    "At Risk":  { color: "#C8102E", soft: "#FDECEC" },
    "Delayed":  { color: "#D6A400", soft: "#FBF3DA" },
    "On Track": { color: "#7E8C3D", soft: "#F0F3E4" },
  };
  const STATUS_META = {
    "Not Started": { color: "#76746F", dot: "#C0C0BF" },
    "In Progress": { color: "#0A5A99", dot: "#0A6CB8" },
    "Completed":   { color: "#1f8a4d", dot: "#1f8a4d" },
  };

  // Reference "today" for date bucketing in this prototype.
  const TASK_TODAY = "2026-05-15";

  // assignee: "" = Unassigned. dateType: "Due" | "Start by".
  const TASKS = [
    { id: "t1",  title: "First sponsor contact", desc: "Make initial outreach to the sponsor’s study start-up lead and confirm the primary contact.", status: "Not Started", priority: "At Risk", assignee: "Dean Amoroso", phase: "Exploration", label: "Sponsor", dateType: "Due", date: "2026-05-15", comments: 2, attachments: 1, unread: true },
    { id: "t2",  title: "Complete CDA", desc: "Execute the confidential disclosure agreement so protected documents can be shared.", status: "Not Started", priority: "At Risk", assignee: "", phase: "Exploration", label: "Contracts", dateType: "Due", date: "2026-05-15", comments: 1, attachments: 0, unread: true },
    { id: "t3",  title: "Receive Protocol / Create Protocol", desc: "Obtain the sponsor protocol or draft the investigator-initiated protocol document.", status: "Completed", priority: "At Risk", assignee: "", phase: "Pre-Start up", label: "Regulatory", dateType: "Start by", date: "2026-05-04", comments: 0, attachments: 3, unread: false },
    { id: "t4",  title: "Fast Track Application", desc: "Prepare and submit the fast-track review application to the committee.", status: "Completed", priority: "At Risk", assignee: "", phase: "Pre-Start up", label: "Committee", dateType: "Start by", date: "2026-05-02", comments: 0, attachments: 2, unread: false },
    { id: "t5",  title: "FastTrack Committee Decision", desc: "Await and record the fast-track committee’s determination.", status: "Not Started", priority: "At Risk", assignee: "", phase: "Pre-Start up", label: "Committee", dateType: "Start by", date: "", comments: 0, attachments: 0, unread: false },

    { id: "t6",  title: "PSOS Approval", desc: "Secure Protocol Specific Outline of Services sign-off from research administration.", status: "In Progress", priority: "Delayed", assignee: "Central Services", phase: "Start up", label: "Budget", dateType: "Due", date: "2026-05-12", comments: 3, attachments: 2, unread: true },
    { id: "t7",  title: "SRC Meeting Date", desc: "Schedule the Scientific Review Committee meeting and confirm the agenda slot.", status: "In Progress", priority: "Delayed", assignee: "Central Services", phase: "Start up", label: "Committee", dateType: "Start by", date: "2026-05-01", comments: 1, attachments: 0, unread: false },
    { id: "t8",  title: "SRC Complete Package Date", desc: "Assemble the full SRC submission package and verify all required attachments.", status: "Not Started", priority: "Delayed", assignee: "Central Services", phase: "Start up", label: "Committee", dateType: "Start by", date: "2026-05-10", comments: 0, attachments: 1, unread: false },
    { id: "t9",  title: "SRC Decision", desc: "Capture the Scientific Review Committee’s decision and any contingencies.", status: "Completed", priority: "Delayed", assignee: "Central Services", phase: "Start up", label: "Committee", dateType: "Start by", date: "2026-05-08", comments: 0, attachments: 0, unread: false },

    { id: "t10", title: "Receive adequate docs to start regulatory", desc: "Collect the documents required to open the regulatory submission workstream.", status: "In Progress", priority: "On Track", assignee: "Anthea Buchin", phase: "Start up", label: "Regulatory", dateType: "Due", date: "2026-05-20", comments: 2, attachments: 4, unread: true },
    { id: "t11", title: "Submission date to local or central IRB", desc: "Submit the protocol package to the local or central IRB of record.", status: "Not Started", priority: "On Track", assignee: "Anthea Buchin", phase: "Start up", label: "IRB", dateType: "Due", date: "2026-05-15", comments: 0, attachments: 0, unread: false },
    { id: "t12", title: "IRB Meeting Date", desc: "Confirm the IRB review board meeting date for this protocol.", status: "Not Started", priority: "On Track", assignee: "Anthea Buchin", phase: "Approvals and Awards", label: "IRB", dateType: "Due", date: "2026-05-15", comments: 0, attachments: 1, unread: false },
    { id: "t13", title: "IRB Approval", desc: "Receive the IRB approval letter and file it in the regulatory binder.", status: "Not Started", priority: "On Track", assignee: "Anthea Buchin", phase: "Approvals and Awards", label: "IRB", dateType: "Due", date: "2026-06-01", comments: 1, attachments: 2, unread: true },

    { id: "t14", title: "Sponsor selects Stanford as site", desc: "Confirm formal site selection by the sponsor and countersign the selection letter.", status: "Not Started", priority: "On Track", assignee: "Kat Velasquez", phase: "Exploration", label: "Sponsor", dateType: "Start by", date: "2026-05-15", comments: 0, attachments: 0, unread: false },
    { id: "t15", title: "Complete Early Engagement Meeting", desc: "Hold the early engagement meeting with the research team and document outcomes.", status: "In Progress", priority: "On Track", assignee: "Kat Velasquez", phase: "Exploration", label: "Sponsor", dateType: "Start by", date: "2026-05-14", comments: 1, attachments: 1, unread: false },
    { id: "t16", title: "CA returns executed agreement", desc: "Contracts Administration returns the fully executed clinical trial agreement.", status: "Not Started", priority: "On Track", assignee: "Kat Velasquez", phase: "Approvals and Awards", label: "Contracts", dateType: "Due", date: "2026-06-10", comments: 0, attachments: 0, unread: false },
  ];

  // Seed conversation + attachment content; threads/files lengths match the counts above.
  const _CMT = [
    ["Central Services", "I’ve drafted this from your protocol — review when you have a moment.", "Yesterday"],
    ["Dean Amoroso", "Reached out to the sponsor contact; waiting to hear back on timing.", "2 days ago"],
    ["Anthea Buchin", "I can pick up the regulatory portion once the docs are in.", "3h ago"],
    ["Kat Velasquez", "Confirmed the committee slot for next Tuesday afternoon.", "1h ago"],
    ["Priya Natarajan", "Latest version uploaded — see the attached file.", "Just now"],
  ];
  const _FILES = [
    ["Protocol_v4.0.pdf", "pdf", "2.4 MB"],
    ["Informed_Consent_v4.pdf", "pdf", "684 KB"],
    ["Site_Selection_Letter.docx", "doc", "42 KB"],
    ["Budget_Worksheet.xlsx", "sheet", "88 KB"],
    ["IRB_Approval_Letter.pdf", "pdf", "312 KB"],
    ["Feasibility_Summary.docx", "doc", "56 KB"],
  ];
  TASKS.forEach((t, ti) => {
    t.thread = Array.from({ length: t.comments }, (_, i) => {
      const c = _CMT[(ti + i) % _CMT.length];
      return { author: c[0], text: c[1], time: c[2] };
    });
    t.files = Array.from({ length: t.attachments }, (_, i) => {
      const f = _FILES[(ti + i) % _FILES.length];
      return { name: f[0], kind: f[1], size: f[2] };
    });
  });

  const ATRISK_TOP = [
    { title: "First sponsor contact", dueType: "Due", date: "2026-05-15", assignee: "Dean Amoroso", comments: 2 },
    { title: "Complete CDA", dueType: "Due", date: "2026-05-15", assignee: "Dean Amoroso", comments: 1 },
    { title: "Receive Protocol / Create Protocol", dueType: "Due", date: "2026-05-15", assignee: "Dean Amoroso", comments: 0 },
  ];

  // Group-by options shown in the dropdown (matches the Figma menu).
  const TASK_GROUPBY = [
    { id: "assignee", label: "Assigned to", icon: "peopleGroup" },
    { id: "phase",    label: "Phase",       icon: "server" },
    { id: "date",     label: "Due Date",    icon: "calendar" },
    { id: "label",    label: "Labels",      icon: "tag" },
    { id: "priority", label: "Priority",    icon: "exclaimO" },
    { id: "status",   label: "Status",      icon: "checkO" },
  ];

  // Fixed column orders per grouping (empty key handled as a catch-all).
  const TASK_COLUMNS = {
    status:   ["Not Started", "In Progress", "Completed"],
    priority: ["At Risk", "Delayed", "On Track"],
    assignee: ["", "Central Services", "Anthea Buchin", "Kat Velasquez", "Dean Amoroso"],
    phase:    ["Exploration", "Pre-Start up", "Start up", "Approvals and Awards", "Activation"],
    date:     ["No Date", "Past", "Today", "Upcoming"],
    label:    ["Sponsor", "Contracts", "Regulatory", "IRB", "Committee", "Budget"],
  };

  window.RExData = { STUDY, STEPS, SAMPLE_ANSWERS, QUESTION_INDEX, SERVICES, DOCUMENTS, EXISTING_STUDY, OVERVIEW, STUDY_DOCS, DOC_FILTERS,
    TASKS, ATRISK_TOP, TASK_GROUPBY, TASK_COLUMNS, PRIORITY_META, STATUS_META, TASK_TODAY };
})();

// ── Portfolio data ──────────────────────────────────────────────────────────
(function () {
  const PORTFOLIO_STUDIES = [
    // Exploration (8)
    { id: "p1",  protocol: "SU-2026-0041", title: "CAR-T Cell Therapy in Relapsed B-Cell ALL", sponsor: "Investigator-Initiated", phase: "Exploration", riskStatus: "At Risk",   tableStatus: "Pre-Start Up",          budget: "$1.2M",  date: "Jan 2027", pi: "Dr. Elena Vasquez" },
    { id: "p2",  protocol: "SU-2026-0047", title: "Niraparib Maintenance in Ovarian Cancer", sponsor: "Janssen Oncology",         phase: "Exploration", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$2.1M",  date: "Mar 2027", pi: "Dr. Mei-Ling Cho" },
    { id: "p3",  protocol: "SU-2026-0053", title: "Biomarker Study in EGFR-Mutant NSCLC",   sponsor: "NIH/NCI",                  phase: "Exploration", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$850K",  date: "Feb 2027", pi: "Dr. Albert Chiou" },
    { id: "p4",  protocol: "SU-2026-0058", title: "Semaglutide Effect on Cardiac Remodeling", sponsor: "Novo Nordisk",           phase: "Exploration", riskStatus: "Delayed",   tableStatus: "Pre-Start Up",          budget: "$1.8M",  date: "Apr 2027", pi: "Dr. Priya Mehta" },
    { id: "p5",  protocol: "SU-2026-0061", title: "MRI-Based Prostate Cancer Focal Therapy",  sponsor: "Investigator-Initiated", phase: "Exploration", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$640K",  date: "Mar 2027", pi: "Dr. James Rowe" },
    { id: "p6",  protocol: "SU-2026-0065", title: "Oral JAK1 Inhibitor in Atopic Dermatitis", sponsor: "AbbVie",                 phase: "Exploration", riskStatus: "At Risk",   tableStatus: "Pre-Start Up",          budget: "$1.4M",  date: "May 2027", pi: "Dr. Sarah Kim" },
    { id: "p7",  protocol: "SU-2026-0070", title: "fMRI Neuroimaging in Early Alzheimer's",   sponsor: "NIH/NIA",                phase: "Exploration", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$920K",  date: "Apr 2027", pi: "Dr. Thomas Walsh" },
    { id: "p8",  protocol: "SU-2026-0074", title: "Pembrolizumab in Microsatellite-Unstable CRC", sponsor: "Merck",             phase: "Exploration", riskStatus: "Delayed",   tableStatus: "Pre-Start Up",          budget: "$2.8M",  date: "Jun 2027", pi: "Dr. Lisa Chen" },

    // Pre-Startup (12)
    { id: "p9",  protocol: "SU-2025-1102", title: "Lenvatinib + Pembrolizumab in HCC",        sponsor: "Eisai / Merck",          phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$3.2M",  date: "Nov 2026", pi: "Dr. David Park" },
    { id: "p10", protocol: "SU-2025-1108", title: "Sacituzumab Govitecan in Triple-Negative Breast Ca", sponsor: "Gilead Sciences", phase: "Pre-Startup", riskStatus: "Delayed", tableStatus: "Pre-Start Up",      budget: "$2.6M",  date: "Dec 2026", pi: "Dr. Amanda Torres" },
    { id: "p11", protocol: "SU-2025-1115", title: "CRISPR Gene Editing in Sickle Cell Disease", sponsor: "Vertex / CRISPR Tx",  phase: "Pre-Startup", riskStatus: "At Risk",   tableStatus: "Awaiting IRB",          budget: "$4.1M",  date: "Jan 2027", pi: "Dr. Marcus Williams" },
    { id: "p12", protocol: "SU-2025-1121", title: "Tezepelumab in Severe Uncontrolled Asthma", sponsor: "AstraZeneca",          phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$1.9M",  date: "Oct 2026", pi: "Dr. Rachel Green" },
    { id: "p13", protocol: "SU-2025-1130", title: "Sutimlimab in Cold Agglutinin Disease",     sponsor: "Sanofi",               phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$2.3M",  date: "Nov 2026", pi: "Dr. Kevin Huang" },
    { id: "p14", protocol: "SU-2025-1138", title: "Lecanemab in Early Alzheimer's Disease",    sponsor: "Eisai / Biogen",       phase: "Pre-Startup", riskStatus: "Delayed",   tableStatus: "Awaiting IRB",          budget: "$3.7M",  date: "Feb 2027", pi: "Dr. Thomas Walsh" },
    { id: "p15", protocol: "SU-2025-1145", title: "Inclisiran for LDL Lowering in FH",         sponsor: "Novartis",             phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$1.5M",  date: "Sep 2026", pi: "Dr. Priya Mehta" },
    { id: "p16", protocol: "SU-2025-1152", title: "Bimekizumab vs. Secukinumab in PsA",        sponsor: "UCB",                  phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$2.0M",  date: "Dec 2026", pi: "Dr. Sarah Kim" },
    { id: "p17", protocol: "SU-2025-1159", title: "CAR-NK Cell Therapy in AML",                sponsor: "Investigator-Initiated", phase: "Pre-Startup", riskStatus: "At Risk",  tableStatus: "Awaiting IRB",         budget: "$1.6M",  date: "Mar 2027", pi: "Dr. Elena Vasquez" },
    { id: "p18", protocol: "SU-2025-1167", title: "Imetelstat in Lower-Risk MDS",               sponsor: "Geron Corporation",    phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$2.2M",  date: "Oct 2026", pi: "Dr. Marcus Williams" },
    { id: "p19", protocol: "SU-2025-1174", title: "Zanidatamab in HER2-Positive GEA",           sponsor: "Zymeworks / Jazz",     phase: "Pre-Startup", riskStatus: "Delayed",   tableStatus: "Pre-Start Up",          budget: "$2.9M",  date: "Jan 2027", pi: "Dr. Lisa Chen" },
    { id: "p20", protocol: "SU-2025-1180", title: "Olutasidenib in IDH1-Mutant AML",            sponsor: "Rigel Pharma",         phase: "Pre-Startup", riskStatus: "On Track",  tableStatus: "Pre-Start Up",          budget: "$1.7M",  date: "Nov 2026", pi: "Dr. David Park" },

    // Start up (18)
    { id: "p21", protocol: "SU-2025-0802", title: "Pembro + Chemo in NSCLC (KEYNOTE-A18)",      sponsor: "Merck",                phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$3.8M",  date: "Aug 2026", pi: "Dr. Albert Chiou" },
    { id: "p22", protocol: "SU-2025-0814", title: "Adagrasib in KRAS G12C NSCLC",               sponsor: "Mirati Therapeutics",  phase: "Start up",    riskStatus: "Delayed",   tableStatus: "Start Up",              budget: "$2.4M",  date: "Sep 2026", pi: "Dr. Mei-Ling Cho" },
    { id: "p23", protocol: "SU-2025-0821", title: "Olaparib + Durvalumab in BRCA+ Breast Ca",   sponsor: "AstraZeneca",          phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$4.2M",  date: "Jul 2026", pi: "Dr. Amanda Torres" },
    { id: "p24", protocol: "SU-2025-0835", title: "Ticagrelor in ACS with CKD",                  sponsor: "AstraZeneca",          phase: "Start up",    riskStatus: "Delayed",   tableStatus: "Start Up",              budget: "$1.8M",  date: "Aug 2026", pi: "Dr. Priya Mehta" },
    { id: "p25", protocol: "SU-2025-0843", title: "Finerenone in Heart Failure with CKD",         sponsor: "Bayer",                phase: "Start up",    riskStatus: "On Track",  tableStatus: "Pending Approval",      budget: "$2.6M",  date: "Sep 2026", pi: "Dr. James Rowe" },
    { id: "p26", protocol: "SU-2025-0857", title: "Dupilumab in Chronic Rhinosinusitis",          sponsor: "Sanofi / Regeneron",   phase: "Start up",    riskStatus: "At Risk",   tableStatus: "Start Up",              budget: "$1.3M",  date: "Oct 2026", pi: "Dr. Sarah Kim" },
    { id: "p27", protocol: "SU-2025-0862", title: "PSMA-Targeted Lutetium in mCRPC",             sponsor: "Novartis",             phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$5.1M",  date: "Aug 2026", pi: "Dr. Albert Chiou" },
    { id: "p28", protocol: "SU-2025-0875", title: "Zanubrutinib vs. Ibrutinib in CLL",           sponsor: "BeiGene",              phase: "Start up",    riskStatus: "Delayed",   tableStatus: "Pending Approval",      budget: "$2.7M",  date: "Nov 2026", pi: "Dr. Marcus Williams" },
    { id: "p29", protocol: "SU-2025-0881", title: "Avapritinib in PDGFRA D842V GIST",            sponsor: "Blueprint Medicines",  phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$1.9M",  date: "Sep 2026", pi: "Dr. David Park" },
    { id: "p30", protocol: "SU-2025-0890", title: "Polatuzumab Vedotin in DLBCL",                sponsor: "Genentech / Roche",    phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$3.3M",  date: "Aug 2026", pi: "Dr. Elena Vasquez" },
    { id: "p31", protocol: "SU-2025-0901", title: "Mosunetuzumab in Relapsed FL",                sponsor: "Genentech / Roche",    phase: "Start up",    riskStatus: "At Risk",   tableStatus: "Start Up",              budget: "$2.1M",  date: "Oct 2026", pi: "Dr. Kevin Huang" },
    { id: "p32", protocol: "SU-2025-0912", title: "Tapinarof in Plaque Psoriasis",                sponsor: "Dermavant Sciences",   phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$1.2M",  date: "Jul 2026", pi: "Dr. Rachel Green" },
    { id: "p33", protocol: "SU-2025-0923", title: "Tirzepatide in Obesity + MAFLD",              sponsor: "Eli Lilly",            phase: "Start up",    riskStatus: "On Track",  tableStatus: "Pending Approval",      budget: "$2.8M",  date: "Sep 2026", pi: "Dr. Priya Mehta" },
    { id: "p34", protocol: "SU-2025-0934", title: "Eptinezumab in Chronic Migraine",             sponsor: "Lundbeck",             phase: "Start up",    riskStatus: "Delayed",   tableStatus: "Start Up",              budget: "$1.6M",  date: "Oct 2026", pi: "Dr. Thomas Walsh" },
    { id: "p35", protocol: "SU-2025-0945", title: "Elexacaftor/Tezacaftor in CF (Extension)",   sponsor: "Vertex Pharmaceuticals", phase: "Start up",  riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$3.0M",  date: "Aug 2026", pi: "Dr. James Rowe" },
    { id: "p36", protocol: "SU-2025-0958", title: "Nab-Paclitaxel + Gemcitabine in Pancreatic", sponsor: "Investigator-Initiated", phase: "Start up",  riskStatus: "At Risk",   tableStatus: "Start Up",              budget: "$1.4M",  date: "Nov 2026", pi: "Dr. Lisa Chen" },
    { id: "p37", protocol: "SU-2025-0966", title: "Belantamab Mafodotin in RRMM",               sponsor: "GSK",                  phase: "Start up",    riskStatus: "On Track",  tableStatus: "Start Up",              budget: "$2.3M",  date: "Sep 2026", pi: "Dr. Marcus Williams" },
    { id: "p38", protocol: "SU-2025-0977", title: "Asciminib in CML (Second-Line)",              sponsor: "Novartis",             phase: "Start up",    riskStatus: "Delayed",   tableStatus: "Pending Approval",      budget: "$2.0M",  date: "Oct 2026", pi: "Dr. David Park" },

    // Regulatory (14)
    { id: "p39", protocol: "SU-2024-1503", title: "Pembrolizumab in Advanced Endometrial Ca",    sponsor: "Merck",                phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Pending Approval",      budget: "$2.9M",  date: "Jun 2026", pi: "Dr. Amanda Torres" },
    { id: "p40", protocol: "SU-2024-1511", title: "Nivolumab + Ipilimumab in Advanced RCC",      sponsor: "Bristol Myers Squibb", phase: "Regulatory",  riskStatus: "At Risk",   tableStatus: "Pending Approval",      budget: "$4.3M",  date: "Jul 2026", pi: "Dr. Albert Chiou" },
    { id: "p41", protocol: "SU-2024-1522", title: "Empagliflozin in HFpEF",                      sponsor: "Boehringer Ingelheim", phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Regulatory Approved",   budget: "$2.2M",  date: "May 2026", pi: "Dr. James Rowe" },
    { id: "p42", protocol: "SU-2024-1531", title: "Venetoclax + Azacitidine in Older AML",       sponsor: "AbbVie / Genentech",   phase: "Regulatory",  riskStatus: "Delayed",   tableStatus: "Pending Approval",      budget: "$3.1M",  date: "Aug 2026", pi: "Dr. Elena Vasquez" },
    { id: "p43", protocol: "SU-2024-1540", title: "Deucravacitinib in Moderate Psoriasis",       sponsor: "Bristol Myers Squibb", phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Regulatory Approved",   budget: "$1.8M",  date: "Jun 2026", pi: "Dr. Sarah Kim" },
    { id: "p44", protocol: "SU-2024-1549", title: "Inavolisib + Palbociclib in PIK3CA+ Breast",  sponsor: "Genentech / Roche",    phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Pending Approval",      budget: "$3.5M",  date: "Jul 2026", pi: "Dr. Mei-Ling Cho" },
    { id: "p45", protocol: "SU-2024-1558", title: "Guselkumab in Active PsA",                    sponsor: "Janssen",              phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Regulatory Approved",   budget: "$2.0M",  date: "May 2026", pi: "Dr. Rachel Green" },
    { id: "p46", protocol: "SU-2024-1567", title: "Patisiran in ATTR Cardiac Amyloidosis",        sponsor: "Alnylam Pharmaceuticals", phase: "Regulatory", riskStatus: "At Risk",  tableStatus: "Pending Approval",     budget: "$3.8M",  date: "Aug 2026", pi: "Dr. Priya Mehta" },
    { id: "p47", protocol: "SU-2024-1575", title: "Elacestrant in ESR1-Mutant Breast Ca",         sponsor: "Radius Health",        phase: "Regulatory",  riskStatus: "Delayed",   tableStatus: "Pending Approval",      budget: "$2.4M",  date: "Jun 2026", pi: "Dr. Amanda Torres" },
    { id: "p48", protocol: "SU-2024-1584", title: "Futibatinib in FGFR2-Fusion CCA",             sponsor: "Taiho Oncology",       phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Regulatory Approved",   budget: "$2.7M",  date: "Jul 2026", pi: "Dr. Lisa Chen" },
    { id: "p49", protocol: "SU-2024-1592", title: "Mitapivat in Pyruvate Kinase Deficiency",      sponsor: "Agios Pharmaceuticals",phase: "Regulatory",  riskStatus: "On Track",  tableStatus: "Pending Approval",      budget: "$1.9M",  date: "May 2026", pi: "Dr. Kevin Huang" },
    { id: "p50", protocol: "SU-2024-1601", title: "Acalabrutinib in Mantle Cell Lymphoma",        sponsor: "AstraZeneca",          phase: "Regulatory",  riskStatus: "Delayed",   tableStatus: "Pending Approval",      budget: "$2.5M",  date: "Jun 2026", pi: "Dr. Marcus Williams" },
    { id: "p51", protocol: "SU-2024-1609", title: "Luspatercept in MDS-RS",                       sponsor: "Bristol Myers Squibb / Acceleron", phase: "Regulatory", riskStatus: "On Track", tableStatus: "Regulatory Approved", budget: "$2.1M", date: "Jul 2026", pi: "Dr. David Park" },
    { id: "p52", protocol: "SU-2024-1618", title: "Loncastuximab Tesirine in DLBCL",              sponsor: "ADC Therapeutics",     phase: "Regulatory",  riskStatus: "At Risk",   tableStatus: "Pending Approval",      budget: "$1.6M",  date: "Aug 2026", pi: "Dr. Elena Vasquez" },

    // Activation (10)
    { id: "p53", protocol: "SU-2024-1001", title: "Ivosidenib + Venetoclax in IDH1 AML",         sponsor: "Servier Pharmaceuticals", phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$3.4M",  date: "Apr 2026", pi: "Dr. David Park" },
    { id: "p54", protocol: "SU-2024-1009", title: "Ciltacabtagene Autoleucel in RRMM",            sponsor: "Janssen / Legend Biotech", phase: "Activation", riskStatus: "At Risk", tableStatus: "Continue in Progress", budget: "$6.2M",  date: "May 2026", pi: "Dr. Marcus Williams" },
    { id: "p55", protocol: "SU-2024-1018", title: "Selpercatinib in RET-Mutant Medullary TC",     sponsor: "Eli Lilly",              phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$2.8M",  date: "Mar 2026", pi: "Dr. Albert Chiou" },
    { id: "p56", protocol: "SU-2024-1026", title: "Osimertinib Adjuvant in EGFR+ NSCLC",          sponsor: "AstraZeneca",            phase: "Activation", riskStatus: "Delayed",  tableStatus: "Continue in Progress", budget: "$3.1M",  date: "Apr 2026", pi: "Dr. Mei-Ling Cho" },
    { id: "p57", protocol: "SU-2024-1034", title: "Nusinersen in Adult SMA",                      sponsor: "Biogen",                 phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$4.5M",  date: "Mar 2026", pi: "Dr. Thomas Walsh" },
    { id: "p58", protocol: "SU-2024-1042", title: "Maribavir in Post-Transplant CMV",             sponsor: "Takeda",                 phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$1.7M",  date: "Apr 2026", pi: "Dr. Rachel Green" },
    { id: "p59", protocol: "SU-2024-1051", title: "Tofacitinib in Ulcerative Colitis (Extension)", sponsor: "Pfizer",               phase: "Activation", riskStatus: "At Risk",  tableStatus: "Continue in Progress", budget: "$2.3M",  date: "May 2026", pi: "Dr. Kevin Huang" },
    { id: "p60", protocol: "SU-2024-1059", title: "Ublituximab in Relapsing MS",                   sponsor: "TG Therapeutics",       phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$2.9M",  date: "Mar 2026", pi: "Dr. Thomas Walsh" },
    { id: "p61", protocol: "SU-2024-1067", title: "Crizanlizumab in Sickle Cell Disease",          sponsor: "Novartis",              phase: "Activation", riskStatus: "Delayed",  tableStatus: "Continue in Progress", budget: "$2.0M",  date: "Apr 2026", pi: "Dr. Elena Vasquez" },
    { id: "p62", protocol: "SU-2024-1075", title: "Remibrutinib in Chronic Spontaneous Urticaria", sponsor: "Novartis",             phase: "Activation", riskStatus: "On Track", tableStatus: "Active",               budget: "$1.5M",  date: "May 2026", pi: "Dr. Sarah Kim" },

    // Active Study (13)
    { id: "p63", protocol: "SU-2023-0601", title: "Atezolizumab + Bevacizumab in HCC",            sponsor: "Genentech / Roche",    phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$4.0M",  date: "Oct 2025", pi: "Dr. Lisa Chen" },
    { id: "p64", protocol: "SU-2023-0612", title: "Darolutamide in Non-Metastatic CRPC",           sponsor: "Bayer / Orion",        phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$2.8M",  date: "Sep 2025", pi: "Dr. Albert Chiou" },
    { id: "p65", protocol: "SU-2023-0624", title: "Risankizumab in Crohn's Disease (Induction)",   sponsor: "AbbVie",               phase: "Active Study", riskStatus: "Delayed",  tableStatus: "Continue in Progress",budget: "$3.2M",  date: "Nov 2025", pi: "Dr. Kevin Huang" },
    { id: "p66", protocol: "SU-2023-0636", title: "Daratumumab + Bortezomib in Newly Dx MM",      sponsor: "Janssen",              phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$5.4M",  date: "Aug 2025", pi: "Dr. Marcus Williams" },
    { id: "p67", protocol: "SU-2023-0647", title: "Entrectinib in ROS1-Positive NSCLC",            sponsor: "Genentech / Roche",    phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$2.1M",  date: "Sep 2025", pi: "Dr. Mei-Ling Cho" },
    { id: "p68", protocol: "SU-2023-0659", title: "Sotatercept in Pulmonary Arterial Hypertension",sponsor: "Acceleron / Merck",    phase: "Active Study", riskStatus: "At Risk",  tableStatus: "Continue in Progress",budget: "$3.7M",  date: "Oct 2025", pi: "Dr. Priya Mehta" },
    { id: "p69", protocol: "SU-2023-0671", title: "Roxadustat in CKD-Related Anemia",              sponsor: "AstraZeneca / FibroGen", phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",            budget: "$2.4M",  date: "Nov 2025", pi: "Dr. James Rowe" },
    { id: "p70", protocol: "SU-2023-0682", title: "Cemiplimab in Advanced CSCC",                   sponsor: "Regeneron",            phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$2.6M",  date: "Aug 2025", pi: "Dr. Sarah Kim" },
    { id: "p71", protocol: "SU-2023-0694", title: "Erenumab in Chronic Migraine Prevention",       sponsor: "Amgen / Novartis",     phase: "Active Study", riskStatus: "Delayed",  tableStatus: "Continue in Progress",budget: "$1.8M",  date: "Sep 2025", pi: "Dr. Thomas Walsh" },
    { id: "p72", protocol: "SU-2023-0706", title: "Ripretinib in Advanced GIST (4th-Line+)",       sponsor: "Deciphera Pharmaceuticals", phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",      budget: "$2.0M",  date: "Oct 2025", pi: "Dr. David Park" },
    { id: "p73", protocol: "SU-2023-0718", title: "Pralsetinib in RET-Fusion NSCLC",               sponsor: "Blueprint Medicines",  phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$2.3M",  date: "Nov 2025", pi: "Dr. Albert Chiou" },
    { id: "p74", protocol: "SU-2023-0729", title: "Lonafarnib in Hutchinson-Gilford Progeria",      sponsor: "NIH / Eiger BioPharm", phase: "Active Study", riskStatus: "At Risk",  tableStatus: "Continue in Progress",budget: "$1.1M",  date: "Aug 2025", pi: "Dr. Rachel Green" },
    { id: "p75", protocol: "SU-2023-0741", title: "Tepotinib in MET Exon 14 Skipping NSCLC",       sponsor: "EMD Serono",           phase: "Active Study", riskStatus: "On Track", tableStatus: "Active",              budget: "$2.7M",  date: "Sep 2025", pi: "Dr. Mei-Ling Cho" },

    // Done (5)
    { id: "p76", protocol: "SU-2022-0301", title: "Olaparib in Germline BRCA+ Breast Ca",          sponsor: "AstraZeneca",          phase: "Done",        riskStatus: "On Track",  tableStatus: "Completed",             budget: "$2.9M",  date: "Dec 2024", pi: "Dr. Amanda Torres" },
    { id: "p77", protocol: "SU-2022-0308", title: "Lorlatinib in ALK-Positive NSCLC (CROWN)",      sponsor: "Pfizer",               phase: "Done",        riskStatus: "On Track",  tableStatus: "Completed",             budget: "$3.6M",  date: "Jan 2025", pi: "Dr. Albert Chiou" },
    { id: "p78", protocol: "SU-2022-0315", title: "Carfilzomib + Dexamethasone in RRMM",           sponsor: "Amgen",                phase: "Done",        riskStatus: "On Track",  tableStatus: "Completed",             budget: "$2.2M",  date: "Nov 2024", pi: "Dr. Marcus Williams" },
    { id: "p79", protocol: "SU-2022-0322", title: "Sacubitril/Valsartan vs. Enalapril in HFrEF",   sponsor: "Novartis",             phase: "Done",        riskStatus: "On Track",  tableStatus: "Completed",             budget: "$4.8M",  date: "Feb 2025", pi: "Dr. Priya Mehta" },
    { id: "p80", protocol: "SU-2022-0329", title: "Ustekinumab in Moderately Active UC",            sponsor: "Janssen",              phase: "Done",        riskStatus: "On Track",  tableStatus: "Completed",             budget: "$2.1M",  date: "Dec 2024", pi: "Dr. Kevin Huang" },
  ];

  window.RExPortfolioData = { PORTFOLIO_STUDIES };
})();
