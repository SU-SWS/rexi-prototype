// main.jsx — Vite entry point for RExI prototype
//
// The source modules use an IIFE + window.* globals pattern (originally loaded via
// Babel in-browser). Here we expose React/ReactDOM as window globals so the IIFEs
// continue to work, then import each module in dependency order.

import React from 'react'
import ReactDOM from 'react-dom/client'

// Expose React globals so IIFE modules can use window.React / React directly
window.React = React
window.ReactDOM = ReactDOM

// Import order matches the original bundle's <script> loading sequence:
// 1. tweaks-panel  — standalone, no REx* deps
// 2. icons         — no REx* deps
// 3. data          — no REx* deps, exports window.RExData + window.RExPortfolioData
// 4. fields        — depends on RExIcons
// 5. shell         — depends on RExIcons
// 6. screens       — depends on RExIcons, RExFields, RExData
// 7. pages         — depends on RExIcons, RExFields, RExData
// 8. tasks         — depends on RExIcons, RExFields, RExData
// 9. portfolio     — depends on RExIcons, RExFields, RExPortfolioData
// 10. guideme      — depends on RExIcons, RExFields, RExData
// 11. app          — depends on all of the above; mounts the React tree

import './tweaks-panel.jsx'
import './icons.jsx'
import './data.jsx'
import './fields.jsx'
import './shell.jsx'
import './screens.jsx'
import './pages.jsx'
import './tasks.jsx'
import './portfolio.jsx'
import './guideme.jsx'
import './guideme-agent.jsx'
import './admin-services.jsx'
import './landing.jsx'
import './app.jsx'
