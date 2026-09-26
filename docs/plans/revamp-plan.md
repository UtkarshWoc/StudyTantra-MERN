# StudyTantra — Deep Revamp Plan
Status: IN PROGRESS | Executing step-by-step with full audit trail.

---

## Phase 1 — Security & Hardening (BACKEND)
1. Fix .env — real secrets, never hardcoded
2. Add rate limiting (`express-rate-limit`)
3. Lock CORS to frontend only (`origin` whitelist)
4. Harden auth middleware (`Bearer` parse fix, token expiry)
5. Fix JWT_SECRET placeholder, add HTTPS-only cookie flags
6. Add input sanitization / validation (express-validator where missing)
7. Remove hardcoded URLs/keys from controllers & routes
8. Audit `npm audit` in backend

## Phase 2 — Frontend .env + Config
9. Create `frontend/.env` (VITE_API_URL, etc.)
10. Replace all `process.env.REACT_APP_API_URL` with `import.meta.env.VITE_API_URL`
11. Remove hardcoded `https://docs.google.com/gview` — use configurable viewer

## Phase 3 — UI/UX Revamp — Production Grade
12. Change color palette from indigo/purple to sleek slate-amber/emerald enterprise palette
13. Create modular design-system tokens (`src/design/tokens.js`)
14. Rebuild Sidebar/Header with cleaner typography, refined spacing, subtle glass effects
15. Rebuild Dashboard — cleaner metric cards, better spacing, refined gradients
16. Rebuild Document cards & pages with reduced visual noise
17. Rebuild Login/Register — cleaner gradient, refined typography, less "vibe"
18. Rebuild ChatInterface — cleaner bubbles, refined input area
19. Rebuild Flashcards/Quizzes — cleaner cards, better progress indicators
20. Clean up `App.css` — remove old Vite boilerplate
21. Add subtle animations / consistent focus rings

## Phase 4 — Modular Cleanup
22. Extract reusable components to `src/components/ui/` (Button, Card, Badge, Input)
23. Move page-level logic into cleaner hooks / services
24. Remove all `style={{...}}` inline hardcoded gradients from pages; use CSS variables
25. Consolidate theme context, add cleaner dark-mode transitions

---
Every step below will have ACTION + DETAIL + FILES TOUCHED.
