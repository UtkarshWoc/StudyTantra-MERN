# StudyTantra — Level-Up & Productization Plan

## Context
StudyTantra is a MERN + Gemini app (Express 5 / Mongoose 9 / React 19 + Vite + Tailwind 4, Cloudinary storage, Railway + Vercel deploy). Users upload PDFs and get AI chat, summary, flashcards and MCQ quizzes, plus a dashboard. It works as a demo, but the AI layer is "send the whole PDF every time", there are no tests, several real bugs/security holes, stubbed UI (password change, delete account, notifications), and nothing that makes it a product (quotas, billing, onboarding, legal, observability).

The user asked for: (1) a plan to take the project a level further, (2) what it needs to become a product. No code changes yet. Plan is phased so each phase ships on its own; Phase 0–1 are prerequisites for everything else.

---

> **Status (2026-10-12):** Phases 0–3 implemented on branch `feature/level-up` (see commit history). Phase 4 not started.
> Deviations from the plan: retrieval scores embeddings in-app by default (Atlas Vector Search optional via `VECTOR_SEARCH=atlas`); ingestion uses an in-process queue rather than BullMQ/Redis; Playwright covers two end-to-end flows.

## Phase 0 — Fix what's broken (1 week)

Real bugs found in the code:

| # | Problem | Where |
|---|---|---|
| 1 | CORS check uses `origin.startsWith(allowed)` → `https://study-tantra-mern.vercel.app.evil.com` passes | [backend/src/app.js](backend/src/app.js) |
| 2 | Wrong password → 401 → global interceptor does `window.location.href='/login'` → page reloads and the error message never shows | [frontend/src/context/AuthContext.jsx](frontend/src/context/AuthContext.jsx) |
| 3 | Token expiry check uses Node `Buffer` in the browser → throws → caught → expired tokens always accepted (dead code). Use `atob` | same file |
| 4 | Quiz `correctAnswer` sent to client before attempt + scoring done client-side; submit overwrites a single `score` (no attempt history) | [quizController.js](backend/src/controllers/quizController.js), [QuizEngine.jsx](frontend/src/components/QuizEngine.jsx) |
| 5 | `count` for quizzes/flashcards is unbounded → one request can ask Gemini for 1000 items (cost abuse) | quiz/flashcard controllers |
| 6 | Deleting a document leaves orphan Flashcards, Quizzes, ChatHistory | [documentController.js](backend/src/controllers/documentController.js) |
| 7 | Profile update allows email change with no uniqueness check / re-auth; no input validation on register | [authController.js](backend/src/controllers/authController.js) |
| 8 | 500 responses leak `error.message`; `uncaughtException` handler swallows and keeps a broken process alive | controllers, [server.js](backend/src/server.js) |
| 9 | Server reports healthy while Mongo is down (Mongoose buffers → requests hang) | server.js, `GET /` |
| 10 | Login eye-toggle renders `EyeOff` twice | [Login.jsx](frontend/src/pages/Login.jsx), [Register.jsx](frontend/src/pages/Register.jsx) |
| 11 | Cloudinary `raw` PDFs are public URLs and are also sent to Google gview → anyone with the link reads the user's notes | uploadMiddleware, [DocumentDetails.jsx](frontend/src/pages/DocumentDetails.jsx) |
| 12 | Stub UI that looks real: change password, delete account, notification toggles | [Settings.jsx](frontend/src/pages/Settings.jsx), [Profile.jsx](frontend/src/pages/Profile.jsx) |

Hygiene: remove `frontend/.vite/` from git, delete `backend/test.mjs` / `test_upload.cjs`, drop the unused `@google/genai` *or* the deprecated `@google/generative-ai` (keep `@google/genai`, it's the maintained SDK), add Mongo indexes on `{user, document}`, replace dashboard's "load all quizzes" with an aggregation, run `npm audit fix`.

## Phase 1 — Engineering foundation (1–2 weeks)

- **Validation**: `zod` schemas per route (body/params), one `validate()` middleware. Validate ObjectIds.
- **API client on the frontend**: one `src/lib/api.js` axios instance with base URL + auth header + 401 handling. Every page currently rebuilds `{ headers: { Authorization } }` by hand (~20 call sites).
- **Data fetching**: TanStack Query for caching, loading/error states, optimistic favorites.
- **Auth hardening**: short-lived access token + refresh token in httpOnly cookie (replace 30-day JWT in localStorage), password reset + email verification (Resend/Brevo), Google OAuth (biggest signup-conversion win for students).
- **Service layer**: move Gemini calls behind `services/ai/` with one `generateJSON(schema, prompt)` helper using Gemini structured output (`responseSchema`) instead of regex-stripping ``` fences and `JSON.parse` (duplicated 4× in [geminiAI.js](backend/src/utils/geminiAI.js)).
- **Tests**: Vitest + Supertest + `mongodb-memory-server` for backend routes (auth, ownership checks, quiz scoring); Vitest + Testing Library for QuizEngine/FlashcardViewer; Playwright for one happy path (register → upload → generate → quiz).
- **CI**: GitHub Actions: lint, test, build on every PR. Branch protection on `main`.
- **Logging/monitoring**: `pino` structured logs, Sentry on both ends, `/healthz` that checks Mongo.
- **Config**: validate env at boot (zod), fail fast if `JWT_SECRET`/`MONGO_URI` missing.

## Phase 2 — Make the AI actually good (2–4 weeks) — the core differentiator

Today every chat message re-downloads the PDF from Cloudinary, re-parses it, and stuffs the first 50k chars into the prompt. Long books are silently truncated; answers can't cite pages.

1. **Ingestion pipeline at upload time** (background job via BullMQ + Redis, or Agenda on Mongo to avoid new infra):
   - Extract text per page (`pdfjs-dist`/`unpdf`, replaces brittle `pdf-parse` 1.x), set real `pageCount`.
   - OCR fallback for scanned PDFs (Gemini vision on page images).
   - Chunk (~800 tokens, page-tagged) → embed (Gemini `text-embedding`) → store in **MongoDB Atlas Vector Search** (no new DB needed).
   - Document `status: processing | ready | failed` + progress shown in UI.
2. **RAG chat**: retrieve top-k chunks → answer with **page citations** ("p. 14") that jump the viewer to that page. Stream responses (SSE) so the user sees tokens immediately.
3. **Real PDF viewer**: `react-pdf`/PDF.js in-app (drop Google gview), served via signed/authenticated URLs. **Select text → Explain / Make flashcard / Ask** (the README already promises "Concept Explainer").
4. **Better generation**: generate per-chapter/per-topic (user picks scope), difficulty levels, question types beyond MCQ (true/false, fill-in, short answer graded by AI), dedupe against existing cards instead of `deleteMany` on regenerate.
5. **Cost control**: cache summaries (already stored) and generated sets; use Gemini context caching for repeated doc calls; cheapest model (Flash-Lite) for embeddings/classification, Flash for generation.

## Phase 3 — Learning science features (2–3 weeks) — why students come back

- **Spaced repetition** (FSRS or SM-2) for flashcards: `Flashcard` already has `lastReviewed`; add `due`, `stability`, `difficulty`, `reps`. "Due today" queue on dashboard. This is the single biggest retention feature (it's why Anki/Quizlet stick).
- **Quiz attempts model** (`QuizAttempt` collection) → per-topic accuracy → **"weak topics"** view → "generate a quiz on my weak topics".
- **Study streaks, daily goal, activity heatmap**, real recent-activity feed (currently only uploads).
- **Exam mode / study planner**: user enters exam date + syllabus docs → daily plan of what to review.
- **Collections/subjects**: group documents (e.g. "Semester 5 – DBMS"), cross-document chat and quizzes.
- **Export**: flashcards to Anki/CSV, quiz/summary to PDF.

## Phase 4 — Turn it into a product

### Who it's for and positioning
Pick a wedge rather than "AI for any PDF" (crowded: NotebookLM, Quizlet AI, Knowt, StudyFetch). Suggested wedge: **Indian college/competitive-exam students** (university syllabi, GATE/UPSC/NEET notes, Hinglish explanations, low price). That drives features: multilingual answers (Hindi/regional), mobile-first, works on slow networks, cheap tier.

### What the product needs that the code doesn't have
| Area | What to add |
|---|---|
| **Monetization** | Freemium: e.g. Free = 3 docs, 20 AI actions/day; Pro (~₹149–199/mo, student pricing) = unlimited docs, bigger files, priority model. Razorpay (India, UPI) or Stripe. `Subscription` + `UsageLedger` models, webhook handling. |
| **Usage metering & quotas** | Per-user AI quota middleware (replace the global 100 req/15 min IP limiter), token accounting per call — required before any public launch or one user can burn the Gemini bill. |
| **Onboarding** | Public landing page (currently app starts at `/login`), demo document preloaded for new users, first-run checklist, empty states that lead to the next action. |
| **Mobile** | PWA (installable, offline flashcard review) first; React Native/Expo later only if retention justifies it. |
| **Notifications** | Email/push for "cards due", streak reminders, weekly report — makes the stubbed Settings toggles real. |
| **Sharing / social** | Share a deck/quiz via public link, class/group spaces, teacher mode (teacher uploads, class gets quizzes) — growth loop + B2B angle (coaching institutes). |
| **Account & data** | Change password, delete account (cascade + Cloudinary cleanup), data export. |
| **Legal/compliance** | Privacy policy, ToS, cookie notice, India DPDP Act 2023 consent + deletion rights, content/copyright policy for uploads, age policy (under-18 users). |
| **Ops** | Staging environment, Mongo Atlas backups, uptime monitoring, error budget alerts, admin panel (users, usage, costs, abuse flags). |
| **Analytics** | PostHog: activation funnel (signup → upload → first quiz → day-7 return), feature usage, retention cohorts. |
| **Support** | Feedback widget, in-app "report bad answer" (also gives eval data for prompts). |
| **Brand/SEO** | Domain, logo, public SEO pages ("AI flashcards from PDF"), shareable deck pages indexable. |

### Suggested launch sequence
1. Phases 0–1 → private beta with ~20 classmates; measure activation & day-7 retention.
2. Phase 2 (RAG + citations + viewer) → this is what makes answers trustworthy; public free launch.
3. Phase 3 (spaced repetition, weak topics) + quotas + Razorpay → introduce Pro.
4. Sharing/teacher mode → growth + institute (B2B) sales.

---

## Critical files (for when execution starts)
- Backend: `backend/src/app.js`, `server.js`, `utils/geminiAI.js` (→ `services/ai/`), all `controllers/*`, `models/*` (add indexes, new `Chunk`, `QuizAttempt`, `Subscription`, `UsageLedger`)
- Frontend: `context/AuthContext.jsx`, new `lib/api.js`, `pages/DocumentDetails.jsx` (viewer), `components/QuizEngine.jsx`, `pages/Settings.jsx`, `pages/Profile.jsx`

## Verification (per phase)
- Phase 0: Supertest cases for each bug (CORS spoofed origin rejected, quiz GET hides answers, count capped, delete cascades); manual: wrong-password shows error without reload.
- Phase 1: CI green on PR; Playwright happy path passes against local stack.
- Phase 2: upload a 300-page PDF → status reaches `ready`; ask a question about the last chapter → answer cites correct page; chat streams.
- Phase 3: review cards → due dates move per FSRS; weak-topic quiz only uses low-accuracy topics.
- Phase 4: quota blocks the N+1th AI call on Free; Razorpay test-mode webhook upgrades plan; PostHog funnel shows events.
