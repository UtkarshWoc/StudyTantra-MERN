# StudyTantra – AI Learning Assistant (MERN + Google Gemini)

StudyTantra is a full-stack **AI-powered learning assistant** built with the **MERN stack** and **Google Gemini**.  
It transforms static PDFs into an interactive study experience with **AI chat**, **auto‑generated flashcards**, **quizzes**, **summaries**, and **progress tracking** — all in one place.

This project is designed as a **college‑level major project** with enough depth to grow over **3–4 months** and real impact for students who study from PDFs, notes, and handouts.

---

## 🔍 Problem & Motivation

Students today rely heavily on **PDF notes, e‑books, and handouts**, but:

- Passive reading is inefficient and hard to recall.
- Creating flashcards and quizzes manually is time‑consuming.
- It’s hard to track what was studied, what’s weak, and what to revise.

**StudyTantra** aims to fix this by turning any PDF into:

- An **interactive AI chat partner**
- A set of **flashcards for active recall**
- **Quizzes** for self‑assessment
- A **dashboard** for tracking learning progress

---

## ✨ Features

**Documents**
- Upload PDFs (private storage; files are only served to their owner)
- Background processing: per-page text extraction, OCR for scanned PDFs, chunking and embeddings, with live status
- In-app PDF viewer; select text to **Explain**, **Simplify**, **Make a flashcard** or **Ask in chat**
- Collections (e.g. "Semester 5 – DBMS") to group documents

**AI study tools (Google Gemini)**
- Chat grounded in your document (retrieval-augmented), streamed live, with **page citations** that jump the viewer
- Cross-document chat and quizzes over a whole collection
- Summaries, flashcards and quizzes from the whole document, a page range, or a topic; choose difficulty
- Quiz types: multiple choice, true/false, fill-in-the-blank, short answer (graded by AI with feedback)

**Learning science**
- Spaced repetition (FSRS) review with Again/Hard/Good/Easy and a daily new-card limit
- Quiz attempt history; **weak topics** from quiz answers and flashcard lapses, with one-click practice
- Streaks, daily goal and a year-long activity heatmap
- Exam **study planner**: a day-by-day plan up to your exam date that prioritises weak topics
- Export flashcards to CSV / Anki; print or save quiz reviews and summaries as PDF

**Accounts**
- Email + password or Google sign-in, email verification, password reset
- Short-lived access tokens with rotating refresh sessions; "log out other devices"
- Change password, change email (after verifying the new address), delete account (removes all data)

---

## 🧱 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, React Router, TanStack Query, react-pdf, react-markdown |
| Backend | Node.js 20+, Express 5, MongoDB + Mongoose, zod validation, pino logging |
| AI | Google Gemini via `@google/genai` (generation, structured JSON output, embeddings, streaming) |
| Storage | Cloudinary (authenticated delivery) or local disk |
| Learning | `ts-fsrs` for spaced repetition |
| Testing | Vitest + Supertest + mongodb-memory-server, Testing Library, Playwright |
| Ops | GitHub Actions CI, optional Sentry, Railway (API) + Vercel (web) |

---

## 📂 Project Structure

```text
backend/
  src/
    config/        env validation (zod), logger, db, cloudinary
    controllers/   auth, documents, chat, flashcards, quizzes, review, insights, collections, plans
    middlewares/   auth, validation, rate limits, errors, uploads
    models/        User, Session, Document, DocumentPage, Chunk, Flashcard, Quiz, QuizAttempt,
                   ChatHistory, Activity, Collection, StudyPlan
    services/      ai/ (providers + prompts), ingestion/, retrieval, storage, srs, activity, email
    routes/
  scripts/         e2e-server.js (self-contained API for tests/demos), gemini-smoke.js
  tests/           API test suites
frontend/
  src/
    api/hooks.js   all data fetching (TanStack Query)
    lib/           API client (silent token refresh), SSE chat stream, helpers
    components/    PdfViewer, ChatInterface, QuizEngine, ActivityHeatmap, ...
    pages/         Dashboard, Library, Document, Review, Flashcards, Quizzes, Planner, ...
  e2e/             Playwright specs
docs/plans/        roadmap and productization plan
```

---

## 🚀 Getting Started

Requirements: Node.js 20+, a MongoDB database (local or Atlas), a [Gemini API key](https://aistudio.google.com/apikey).

```bash
# Backend
cd backend
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, GEMINI_API_KEY, Cloudinary keys
npm install --workspaces=false
npm run dev                  # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env         # VITE_API_URL=http://localhost:5000
npm install --workspaces=false
npm run dev                  # http://localhost:5173
```

> Each package has its own lockfile, so install with `--workspaces=false` (the repo root declares workspaces).

**No API keys handy?** Set `AI_PROVIDER=mock` and `STORAGE_DRIVER=local` in `backend/.env` to run fully offline with deterministic AI responses. Or start the self-contained API (in-memory MongoDB + mock AI) with `node backend/scripts/e2e-server.js` and point the frontend at `http://localhost:5055`.

The server validates its environment at startup and exits with a clear message if something required is missing. See `backend/.env.example` for every variable (email via Resend, Google sign-in, Sentry, rate limits, Atlas Vector Search).

---

## 🧪 Testing

```bash
cd backend  && npm test               # API tests (in-memory MongoDB, mock AI)
cd frontend && npm test               # unit/component tests
cd frontend && npm run lint
cd frontend && npm run test:e2e       # Playwright; starts the e2e API and Vite automatically
cd backend  && npm run smoke:gemini   # optional: a few real Gemini calls with your key
```

CI (`.github/workflows/ci.yml`) runs all of the above except the Gemini smoke test on every pull request.

---

## ☁️ Deployment notes

**Backend (Railway):** set `NODE_ENV=production`, all variables from `.env.example`, and `CLIENT_URL` to the frontend URL (used in email links). `GET /healthz` reports 503 until MongoDB is connected. Documents uploaded before the ingestion pipeline existed are processed automatically on the next boot.

**Frontend (Vercel):** set `VITE_API_URL` (and optionally `VITE_GOOGLE_CLIENT_ID`, `VITE_SENTRY_DSN`).

**⚠️ Serve the API from the same site as the frontend.** Sessions use an httpOnly refresh cookie. If the frontend is on `*.vercel.app` and the API on `*.railway.app`, that cookie is a third-party cookie, which Safari (and Chrome, as third-party cookies are phased out) can block, and users would be signed out on every reload. Either:
- put both behind your own domain (e.g. `app.example.com` + `api.example.com`), or
- proxy the API through Vercel by adding this to `frontend/vercel.json` (before the SPA rewrite) and setting `VITE_API_URL` to the Vercel site's own origin:
  `{ "source": "/api/(.*)", "destination": "https://<your-railway-app>/api/$1" }`

**Scaling retrieval:** chunks are scored in Node by default. For large libraries create an Atlas Vector Search index named `chunk_embeddings` on `chunks.embedding` (768 dims, cosine, filter field `document`) and set `VECTOR_SEARCH=atlas`. Background ingestion runs in-process; with multiple API instances, move it to a shared queue.

---

## 🗺️ Roadmap

See [`docs/plans/level-up-and-productization-plan.md`](docs/plans/level-up-and-productization-plan.md). Phases 0–3 (fixes, engineering foundation, RAG, learning science) are implemented; Phase 4 (productization: pricing, quotas, onboarding, PWA, legal) is next.
