# RExI Prototype — Claude Context

## What this is
A React/Vite prototype for the RExI (Research Exchange Interface) study intake system at Stanford. Built for the SU-SWS team. Deployed as a GitHub Page at `https://su-sws.github.io/rexi-prototype/`.

## Deploying
- **Push to `main`** → GitHub Actions builds and deploys automatically. No manual build step needed.
- Local preview: `npm run dev` → http://localhost:5173/rexi-prototype/
- Node.js is installed at `~/node/bin`. If `npm` is not found, run: `export PATH="$HOME/node/bin:$PATH"`

## Tech stack
- React + Vite, plain JavaScript (JSX), inline styles — no TypeScript, no Tailwind, no CSS modules
- All modules use IIFE pattern exposing globals (`window.REx*`)
- No third-party chart libraries — all SVG drawn by hand

## Source file map
| File | Purpose |
|---|---|
| `src/app.jsx` | Root app, routing, state management |
| `src/data.jsx` | All study data, questions, tasks, 80 portfolio studies |
| `src/portfolio.jsx` | Research Portfolio page (scatter plot, donut chart, table) |
| `src/pages.jsx` | Study Overview + Documents pages |
| `src/tasks.jsx` | Tasks page (table, kanban, at-risk hero) |
| `src/screens.jsx` | Welcome, Step, Review, Activation screens |
| `src/shell.jsx` | Sidebar navigation |
| `src/guideme.jsx` | Guide Me AI drawer (chat + autofill modes) |
| `src/fields.jsx` | Form field renderers |
| `src/icons.jsx` | SVG icon library |
| `src/tweaks-panel.jsx` | Prototype debug controls panel |

## Static assets
All images live in `public/assets/` and are referenced as `assets/filename.png` in code:
- `public/assets/rexi-mascot.png` — RExI dinosaur mascot
- `public/assets/review-illustration.png` — illustration used on review screen

## Design tokens
- Stanford red: `#8C1515`
- Body font: `'Source Sans 3', sans-serif`
- Heading font: `'Source Serif 4', serif`
- Page background: `#faf9f5`
- Card border: `1px solid #DCE3E9`, borderRadius 12–16
- Card shadow: `0 2px 10px rgba(10,90,160,0.06)`

## Portfolio page specifics
- Scatter plot: Y = phase rows (Exploration→Done), X = study index (1–80), dot color = risk status
- Risk status colors: At Risk `#EF4444`, Delayed `#F59E0B`, On Track `#14B8A6`
- Donut chart: center shows "80 Active Studies", three segments match risk colors
- Table status column uses `riskStatus` field (At Risk / Delayed / On Track) with matching badge colors
- Row click ↔ dot highlight are bidirectionally linked

## Nav sidebar order (from shell.jsx)
Documents and Tasks appear above Research Admin Services. A divider `<hr>` sits above Documents and below Tasks.

## GitHub repo
`https://github.com/SU-SWS/rexi-prototype`
Owner org: SU-SWS
