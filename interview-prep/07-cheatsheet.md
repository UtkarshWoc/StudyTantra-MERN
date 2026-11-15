# StudyTantra Engineering Interview Cheatsheet — The One-Page Survival Guide

> **Target Role**: Senior Full Stack / MERN / AI Application Engineer  
> **Repository**: `UtkarshWoc/StudyTantra-MERN`  
> **Core Identity**: Monolithic Node 20 / Express 5 API + React 19 Vite SPA with Grounded Retrieval-Augmented Generation (RAG) and Free Spaced Repetition Scheduling (FSRS).

---

## 1. Vital Metrics & Numbers at a Glance

Memorize these exact figures. Every metric is backed by git history, static analysis, and automated test runners.

| Category | Metric | Exact Value | Codebase Anchor / Source |
|---|---|---|---|
| **Git & Authorship** | Total Commits | **91 commits** | `git rev-list --count HEAD` |
| **Git & Authorship** | Lead Author Ratio | **92.3%** (84 commits) | Utkarsh Shukla (`UtkarshWoc`) |
| **Git & Authorship** | Collaborative Genesis | **7.7%** (7 commits) | Navneet Krishna (6), Digvijay Singh (1) |
| **Backend Surface** | REST Endpoints | **54 endpoints** | Across 8 route files in `backend/src/routes/` |
| **Backend Surface** | Data Models | **12 Mongoose models** | `backend/src/models/*.js` |
| **Backend Surface** | Ingestion Queue Cap | **2 concurrent jobs** | `backend/src/services/ingestion/queue.js:7` |
| **Frontend Surface** | Page Views | **17 views** (15 lazy, 2 eager) | `frontend/src/App.jsx:13-33` |
| **Frontend Surface** | Custom Components | **17 reusable widgets** | `frontend/src/components/*.jsx` |
| **Frontend Surface** | Initial Bundle (Gzip) | **84.9 kB** (`index-*.js`) | Vite production build log |
| **Frontend Surface** | Lazy PDF Worker Chunk| **1,265 kB** uncompressed | `pdf.worker.min.mjs` dynamic URL |
| **Vector & AI** | Embedding Dimensions | **768 dimensions** | `gemini-embedding-001` via `@google/genai` |
| **Vector & AI** | Document Chunk Size | **3,200 chars (~800 tokens)** | `overlapChars: 400` in `chunker.js:6` |
| **Vector & AI** | OCR Trigger Threshold| **< 40 chars/page** | `backend/src/services/ingestion/ingest.js:78` |
| **Vector & AI** | Top-K RAG Retrieval | **6 chunks** | `backend/src/services/retrieval.js:64` |
| **Auth & Security** | Access Token TTL | **15 minutes** (In-Memory) | `ACCESS_TOKEN_TTL = '15m'` in `auth.js:8` |
| **Auth & Security** | Refresh Token TTL | **30 days** (`st_rt` cookie) | `30 * 24 * 60 * 60 * 1000` in `auth.js:10` |
| **Auth & Security** | Token Reuse Grace | **30 seconds** (`30,000 ms`) | `REUSE_GRACE_MS` in `auth.js:12` |
| **Auth & Security** | Session Garbage Collect| **0 seconds TTL index** | `expiresAt` with MongoDB TTL index in `Session.js:25` |
| **Rate Limiting** | General API Limiter | **300 req / 15 min** | `backend/src/app.js:58` |
| **Rate Limiting** | Credential Limiter | **20 req / 15 min** | `backend/src/routes/authRoutes.js:26` |
| **Rate Limiting** | AI Generation Limiter| **60 req / hour** | `backend/src/middlewares/aiRateLimit.js:6` |
| **Rate Limiting** | Quiz Grading Limiter | **300 req / hour** | `backend/src/routes/quizRoutes.js:22` |
| **Test Coverage** | Backend Integration | **73 passing tests** (7 suites) | Vitest + `mongodb-memory-server` (~35s) |
| **Test Coverage** | Frontend Component | **20 passing tests** (9 suites) | Vitest + Testing Library (~17s) |
| **Test Coverage** | E2E Playwright Suites| **2 suites** (Happy + Learning)| `frontend/e2e/*.spec.js` |
| **Test Cost** | Cloud API Spend in CI| **$0.00 (Zero external cost)** | Deterministic offline mock AI provider |

---

## 2. Complete Technology Stack Matrix

| Domain | Technology | Version | Architectural Rationale & Senior Justification |
|---|---|---|---|
| **Frontend Framework** | React | `^19.2.4` | Modern React 19 architecture utilizing native hooks, server-state decoupling, and zero deprecated patterns. |
| **Frontend Bundler** | Vite | `^8.0.0` | Ultra-fast Oxc/Rollup compilation, instant HMR, dynamic code-splitting for PDF and Chat components. |
| **Server State** | TanStack React Query| `^5.104.2` | Replaces heavy Redux boilerplate with declarative server-state caching, automatic cache invalidation, and background synchronization. |
| **Styling & Design** | Tailwind CSS | `^4.2.2` | Modern utility-first CSS using `@theme` design tokens; zero runtime CSS-in-JS overhead; dark-mode-first aesthetic. |
| **Routing** | React Router DOM | `^7.13.1` | Declarative routing with `<ProtectedRoute>`, `<GuestRoute>`, and code-split dynamic imports via `React.lazy()`. |
| **PDF Rendering** | `react-pdf` / `pdfjs-dist` | `^11.0.0` | High-fidelity canvas/SVG rendering with dynamic Web Worker loading off the main UI thread. |
| **Markdown Engine** | `react-markdown` + `remark-gfm` | `^10.1.0` | Sanitized markdown rendering transforming RAG citations (`[p. X]`) into clickable viewport navigation triggers. |
| **Backend Runtime** | Node.js | `>=20.0.0` | Native ECMAScript Modules (`"type": "module"`), Web Crypto primitives, and native `fetch`. |
| **Web API Framework**| Express | `^5.2.1` | Native Promise rejection error propagation eliminating `express-async-errors`; read-only `req.query` security enforcement. |
| **Database ODM** | Mongoose | `^9.3.3` | Schema validation, compound index definitions, TTL auto-eviction, and document lifecycle hooks. |
| **Vector Database** | MongoDB Atlas / In-App | 768-dim | Hybrid retrieval: In-memory cosine calculation for local dev; native Atlas `$vectorSearch` with HNSW indexing for cloud scale. |
| **Foundation AI** | Google Gemini 2.5 Flash | `@google/genai ^2.28`| 1M+ token context window, multimodal vision OCR, high-speed streaming, structured JSON output enforcement. |
| **Spaced Repetition**| `ts-fsrs` | `^5.4.2` | Free Spaced Repetition Scheduler algorithm outperforming legacy SM-2 with continuous stability and difficulty modeling. |
| **Validation** | Zod | `^3.25.76` | Type-safe environment variable parsing at boot time and request payload validation (`req.body`, `req.params`, `req.query`). |
| **Logging** | Pino & `pino-http` | `^10.4.0` | High-throughput structured JSON logging with automatic redaction of bearer tokens, cookies, and passwords. |
| **Security Headers** | Helmet & CORS | `^8.3.0` | Strict Content Security Policy, strict origin regex validation preventing subdomain takeover (`.evil.com` bypass). |
| **Error Tracking** | Sentry Node & React | `^11.6.0` | End-to-end distributed error tracing across client-side UI and server API lifecycles. |
| **Testing Suite** | Vitest + Supertest | `^5.0.4` | Blazing fast ESM-native unit/integration testing with zero compilation overhead. |
| **In-Memory Mocking**| `mongodb-memory-server`| `^11.3.0` | True database integration testing without external Docker dependencies or shared dev database pollution. |

---

## 3. High-Level System Architecture Cheat Sheet

```text
[ Browser Client: React 19 SPA (Vite v8 + Tailwind CSS v4) ]
   │
   ├── [ Auth State: React Context (In-Memory Access Token) ]
   ├── [ Server Cache: TanStack React Query v5 (staleTime 30s) ]
   └── [ UI Components: PdfViewer (IntersectionObserver) | ChatInterface (SSE) | ReviewSession (FSRS) ]
         │
         │ HTTP Requests (Bearer JWT in Authorization Header)
         │ Credentials: include (httpOnly 'st_rt' Refresh Cookie)
         ▼
[ Express 5 Monolithic API Gateway (`backend/src/app.js`) ]
   │
   ├── Security Middlewares: Helmet -> CORS (Set lookup) -> Pino JSON Logger -> RateLimiters (300/15m)
   ├── Body Parsers: express.json({ limit: '1mb' }) -> cookieParser()
   ├── DB Readiness Guard: Check mongoose.connection.readyState === 1 (503 if starting up)
   │
   ├── Routes & Controllers (`/api/*` with Zod Payload Validation)
   │     ├── /auth        ──> Dual-Token Rotation, Password Hashes, Google OAuth Pre-hijack Guard
   │     ├── /documents   ──> Magic-byte PDF Upload (%PDF-), Multi-storage, Cascade Deletions
   │     ├── /chat        ──> RAG Pipeline, Query Reformulation, SSE Streaming (`/stream`)
   │     ├── /quizzes     ──> Hybrid Grading (Deterministic String Match + Batched Gemini AI)
   │     ├── /review      ──> Spaced Repetition Scheduling (`ts-fsrs` with 90% target retention)
   │     └── /insights    ──> 365-Day Heatmap Aggregation, Weak-Topic Identification (<60% acc)
   │
   ├── In-Process Services & Background Workers
   │     ├── Ingestion Queue (`queue.js`): Concurrency=2 FIFO -> `unpdf` -> Gemini Vision OCR
   │     ├── Sentence Chunker (`chunker.js`): 3200-char blocks, 400-char overlap
   │     └── Hybrid Retriever (`retrieval.js`): Gemini 768-dim embeddings -> In-App Cosine / Atlas Vector
   │
   ▼
[ Persistence & Cloud Services Layer ]
   ├── MongoDB Atlas: 12 Collections (Users, Sessions [TTL], Documents, Chunks, Flashcards, Quizzes)
   ├── Cloud Storage: Cloudinary (Authenticated private PDFs) / Local Disk Storage
   ├── Foundation AI: Google Gemini Studio API (`gemini-2.5-flash`, `gemini-embedding-001`)
   └── Transactional Email: Resend API / Nodemailer SMTP
```

---

## 4. Top 10 Talking Points (Architectural Strengths)

Be ready to deliver these as technical deep dives when the interviewer asks: *"What are you most proud of in this codebase?"*

### 1. Dual-Token Authentication with Rotation, Versioning & Reuse Grace Period
- **Files**: `backend/src/services/auth.js`, `backend/src/middlewares/authMiddleware.js`, `frontend/src/lib/api.js`.
- **The Architecture**:
  - **Access Token**: Stateless JWT signed with HS256, 15-minute TTL, held **strictly in frontend JavaScript memory** (`let accessToken = null`). Never touched by `localStorage` or `sessionStorage` (100% immune to token theft via XSS).
  - **Refresh Token**: High-entropy 32-byte cryptographically secure random string (`base64url`), stored in an `httpOnly, Secure, SameSite=Lax/None` cookie (`st_rt`) with a 30-day lifetime.
  - **Storage**: Raw refresh tokens are **never** stored in the database. Only the SHA-256 hash `hashToken(token)` is saved in the `Session` collection.
  - **Automatic Token Rotation**: Every call to `/api/auth/refresh` rotates the refresh token. The existing hash moves to `previousTokenHash` with a timestamp.
  - **Concurrency Grace Window**: A 30-second window (`REUSE_GRACE_MS = 30000`) allows in-flight parallel requests to reuse the previous token during network jitter. If an old token is presented **after** 30 seconds, it triggers active **reuse detection**—revoking the entire session immediately.
  - **Instant Global Invalidation**: Users have a `tokenVersion` counter. Changing a password increments `user.tokenVersion`, causing `authMiddleware` to reject outstanding JWTs immediately (`decoded.tv !== user.tokenVersion`) without waiting 15 minutes for JWT expiration.

### 2. Zero-Redux State Management via TanStack Query v5 + Context API
- **Files**: `frontend/src/api/hooks.js`, `frontend/src/context/AuthContext.jsx`, `frontend/src/main.jsx`.
- **The Architecture**:
  - Deliberately rejected Redux / Redux Toolkit. Acknowledged that 90% of client state in modern web apps is simply **remote server state**.
  - **Client State**: Minimal and truly local. Handled via React Context (`AuthContext` for user session, `ThemeContext` for light/dark mode) and standard React hooks (`useState`, `useRef`).
  - **Server State**: Offloaded to TanStack React Query v5. Centralized query key factory (`keys.documents`, `keys.quizzes(docId)`), uniform 30-second `staleTime`, and disabled window focus refetching.
  - **Dynamic Status Polling**: Ingestion monitoring uses dynamic query polling (`refetchInterval: (query) => query.state.data?.some(d => d.status === 'processing') ? 2500 : false`). The client automatically polls every 2.5 seconds during PDF processing and stops immediately when all documents reach `'ready'`.
  - **Synchronous Optimistic Updates**: For study planner task toggles (`useTogglePlanTask`), optimistic cache updates run **synchronously** in the event handler prior to `mutation.mutate()`, preventing React 19 controlled checkboxes from visually flickering before network resolution.

### 3. Hybrid RAG Architecture with Graceful Fallback
- **Files**: `backend/src/services/retrieval.js`, `backend/src/services/ai/providers/gemini.js`.
- **The Architecture**:
  - Supports dual retrieval modes controlled by `env.VECTOR_SEARCH` (`'app'` vs `'atlas'`).
  - **In-App Cosine Engine**: Retrieves chunk embeddings for target documents from MongoDB and computes cosine similarity in Node.js memory. Enables 100% functional semantic search on local machines and free-tier databases without requiring Atlas Vector Search clusters.
  - **MongoDB Atlas Vector Search**: Executes native `$vectorSearch` aggregation pipelines utilizing hierarchical navigable small world (HNSW) indexing on the `chunk_embeddings` index.
  - **Asymmetric Vector Embeddings**: Utilizes Google's `gemini-embedding-001` with explicit task types: `taskType: 'RETRIEVAL_DOCUMENT'` for PDF chunks and `taskType: 'RETRIEVAL_QUERY'` for student search queries.
  - **Conversational Context Resolution**: Before vector retrieval, user chat queries are merged with previous conversation history to resolve pronouns (e.g., turning "What are its symptoms?" into "What are the symptoms of Type 2 Diabetes?").

### 4. Google OAuth Pre-Hijacking Prevention Defense
- **Files**: `backend/src/controllers/authController.js:86-118`.
- **The Architecture**:
  - Mitigates the "Account Pre-Hijacking" vulnerability where an attacker registers an account using a victim's email address before the victim signs in with Google OAuth.
  - **The Check**: When Google OAuth token verifies the email, the controller queries for an existing account with that email.
  - **Verified Account**: If the existing account is already verified (`existing.emailVerified === true`), the Google Subject ID (`sub`) is linked safely.
  - **Unverified Squatter Account**: If the account was created with a password but **never verified**, the code treats it as an untrusted squatter account. It evicts the address by renaming it to `unclaimed+${existing._id}@invalid.studytantra`, wipes all verification/reset hashes, and provisions a brand-new, verified account for the true Google owner.

### 5. FSRS (Free Spaced Repetition Schedule) Algorithm Integration
- **Files**: `backend/src/services/srs.js`, `backend/src/models/Flashcard.js`, `frontend/src/pages/Review.jsx`.
- **The Architecture**:
  - Adopted the modern Free Spaced Repetition Scheduler (`ts-fsrs` v5.4.2), replacing outdated 1980s SM-2 algorithms (used in legacy Anki).
  - Models human memory across two continuous parameters: **Stability** (how long a memory trace lasts before forgetting) and **Difficulty** (how hard the card is to retain).
  - Configured with `request_retention: 0.9` (targeting 90% memory recall) and `enable_fuzz: true` (injecting slight randomized jitter to prevent due-card clustering on a single day).
  - **Queue Scheduling**: Isolates reviews into 4 states: `New (0)`, `Learning (1)`, `Review (2)`, and `Relearning (3)`. Enforces daily limits on new cards (`newCardsPerDay`) to prevent student burnout.
  - **Client Experience**: Keyboard-driven UI (`Space` to flip, `1-4` for ratings) with real-time interval previews on buttons ("Again 10m", "Hard 1d", "Good 3d", "Easy 8d") and intra-session re-queueing of failed cards.

### 6. Real-Time Server-Sent Events (SSE) Token Streaming
- **Files**: `backend/src/controllers/chatController.js:101-138`, `frontend/src/lib/chatStream.js`.
- **The Architecture**:
  - Streamlined token delivery over HTTP Server-Sent Events (`text/event-stream`) without the architectural weight or stateful overhead of WebSockets.
  - **Reverse Proxy Optimization**: Emits headers `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`, and `X-Accel-Buffering: no` to prevent Nginx, Cloudflare, or Railway from buffering chunks.
  - **Client Disconnect Detection**: Subscribes to `res.on('close')`. If a student closes the browser tab mid-generation, the Gemini stream loop breaks immediately, terminating outbound LLM token consumption and preventing wasted API costs.
  - **Partial Turn Retention**: Even on abrupt client disconnection, any accumulated tokens (`reply.trim()`) are saved into MongoDB `ChatHistory`, ensuring the conversation remains coherent.
  - **Client-Side Chunk Reassembly**: Custom stream parser in `chatStream.js` handles arbitrary TCP packet boundaries using `TextDecoder({ stream: true })` and slices complete event frames on `\n\n`.

### 7. Zero-External-Cost, Deterministic Test Pipeline
- **Files**: `backend/vitest.config.js`, `backend/src/services/ai/providers/mock.js`, `frontend/playwright.config.js`.
- **The Architecture**:
  - Solved the primary problem of AI application testing: slow execution, non-deterministic outputs, and expensive cloud API bills.
  - **In-Memory Database**: Utilizes `mongodb-memory-server` in backend Vitest suites, spinning up ephemeral, isolated database instances in RAM.
  - **Deterministic Heuristic AI Provider**: When `AI_PROVIDER=mock`, the system swaps Google Gemini for a deterministic local engine. Computes 768-dimensional vector embeddings using FNV-1a bag-of-words hashing; generates structured summaries and flashcards using deterministic regex extraction; grades answers via exact and semantic heuristics.
  - **Result**: 73 backend integration tests and 20 frontend unit tests execute in ~50 seconds in GitHub Actions with **$0.00 cloud spend** and 0% flakiness.

### 8. Continuous Vertical PDF Viewer with IntersectionObserver Tracking
- **Files**: `frontend/src/components/PdfViewer.jsx`.
- **The Architecture**:
  - Built an academic reading experience using `react-pdf` rendering documents in a continuous vertical scroll layout rather than single-page flip mode.
  - **IntersectionObserver Page Sync**: Automatically calculates which page currently occupies the dominant viewport area by sorting active entries by `intersectionRatio`. Updates the page indicator and navbar seamlessly during scroll.
  - **Feedback Loop Prevention**: Includes an `isProgrammaticScroll` ref lock with a 700ms debounce. When a student clicks an AI citation (`[p. 4]`), the viewer smoothly scrolls to page 4 while disabling the scroll observer, preventing cyclical state updates.
  - **Contextual Selection Toolbar**: Floating menu appears on mouse-up over highlighted text, offering one-click actions: "Explain", "Simplify", "Create Flashcard", or "Ask in Chat".

### 9. Fail-Fast Boot Validation via Zod Schemas
- **Files**: `backend/src/config/env.js`, `backend/src/validators/index.js`.
- **The Architecture**:
  - Implements fail-fast architecture at boot time. `backend/src/config/env.js` parses and coerces `process.env` against a strict Zod schema before any Express listener or database connection is initialized.
  - Validates constraints: `PORT` must be a positive integer, `JWT_SECRET` must be >= 16 characters, `STORAGE_DRIVER` must match `['cloudinary', 'local']`.
  - **Conditional Refinements**: Uses Zod `superRefine` to enforce environment-dependent rules (e.g., if `AI_PROVIDER === 'gemini'`, `GEMINI_API_KEY` is mandatory; in `production`, `AI_PROVIDER=mock` is strictly prohibited).
  - If configuration is invalid, prints a formatted list of missing variables to `stderr` and invokes `process.exit(1)`, completely preventing partially configured deployments.

### 10. Blended Activity Heatmap & Analytics Engine
- **Files**: `backend/src/services/insights.js`, `backend/src/models/Activity.js`, `frontend/src/components/ActivityHeatmap.jsx`.
- **The Architecture**:
  - Hand-rolled GitHub-style 365-day SVG calendar heatmap without heavy external charting libraries.
  - **Unified Activity Ledger**: The `Activity` model records user actions (`upload`, `review`, `quiz`, `chat`, `generate`) as an append-only time series.
  - **Aggregation**: Queries activity counts across a 365-day rolling window, normalizes dates to the user's configured timezone via `Intl.DateTimeFormat`, and maps frequencies into an amber sequential color ramp.
  - **Weak-Topic Algorithm**: Scans historical `QuizAttempt` records over a 90-day window. Any topic with at least 3 attempts and an accuracy below 60% is automatically classified as a "weak topic", driving priority generation in the exam study planner.

---

## 5. Top 10 Weak Spots & How to Answer Them (Tech Debt & Trade-offs)

Senior engineers are defined by their ability to critically evaluate their own trade-offs. Use this table to demonstrate engineering maturity.

| # | Weak Spot in Codebase | Root Cause in Code | Why It Was Done This Way | The Senior Engineering Answer & Production Refactor Plan |
|---|---|---|---|---|
| **1** | **In-Memory Job Queue** | `queue.js:7-11` uses an in-memory array (`pending = []`) with concurrency cap 2. | Kept zero-dependency deployment simple on single-instance PaaS (Railway) without requiring managed Redis clusters. | *"In an early-stage MVP, an in-memory queue minimized infra complexity and hosting costs. However, jobs do not survive container crashes, and processing cannot scale horizontally. In production, I would migrate to **BullMQ with Redis**, creating dedicated worker containers for PDF OCR and vectorization with exponential backoff and dead-letter queues."* |
| **2** | **In-App Cosine Memory Scaling** | `retrieval.js:63-78` loads all chunk vectors for documents into Node.js heap memory to compute cosine similarity in JS. | Allowed local development and automated CI testing without requiring a live MongoDB Atlas cluster. | *"Computing cosine similarity in JavaScript works well for small document sets (<500 chunks), but causes severe GC pressure and event loop latency if a collection contains 50,000 chunks (~150MB float vectors). The codebase already contains the native **Atlas Vector Search `$vectorSearch` pipeline**. In production, we enforce `VECTOR_SEARCH=atlas` backed by an HNSW index."* |
| **3** | **Un-Transactioned Cascading Deletes** | `cascade.js:14-38` performs multiple separate `deleteMany` calls across 8+ collections without a session transaction. | Standalone MongoDB instances (common in local dev) do not support multi-document transactions without replica sets. | *"If the server or database crashes mid-cascade, orphaned flashcards or chunks can remain. The refactor is straightforward: wrap the cascading operations in a **Mongoose replica set transaction** (`const session = await mongoose.startSession(); await session.withTransaction(...)`) ensuring ACID atomicity across all related collections."* |
| **4** | **In-Memory Rate Limiting Store** | `express-rate-limit` in `app.js` and `authRoutes.js` uses default in-memory `MemoryStore`. | Avoided an external Redis dependency for the initial prototype. | *"In a horizontally scaled environment with multiple container instances behind a load balancer, memory stores are isolated. A user could bypass limits by round-robining across instances. The fix is dropping in `rate-limit-redis` with a centralized Redis instance, ensuring global rate enforcement."* |
| **5** | **Bcryptjs Event Loop Blocking** | `package.json:27` uses pure JavaScript `bcryptjs` instead of native C++ `bcrypt`. | Eliminates Python and node-gyp build dependencies across varied deployment environments (Windows dev, Ubuntu CI, Alpine containers). | *"While `bcryptjs` guarantees cross-platform portability, salt hashing in pure JavaScript runs on the main Node.js event loop, momentarily blocking I/O under concurrent logins. In a high-traffic production system, I would replace it with native **`bcrypt`** (offloaded to libuv worker threads) or migrate to **Argon2id**."* |
| **6** | **Frontend Bundle Worker Size** | `pdf.worker.min.mjs` is 1,265 kB and `DocumentDetails` chunk is 650 kB. | `pdfjs-dist` is a complete PDF parsing and rendering engine compiled into Web Worker format. | *"PDF.js is inherently large because it bundles font rendering, CMap decoders, and canvas graphics. I mitigated this by ensuring the PDF worker and viewer are **lazily loaded on demand via dynamic URL** (`import.meta.url`), so the initial landing and dashboard bundles remain lean (84.9 kB gzip). To optimize further, the worker can be served directly from a global CDN with immutable cache headers."* |
| **7** | **Absence of Docker / Containers** | No `Dockerfile` or `docker-compose.yml` in repository. | Leveraged Git-backed PaaS workflows (Vercel SPA rewrites and Railway Nixpacks auto-detection) for rapid delivery. | *"For the current cloud workflow, Vercel and Railway provided zero-config CI/CD. However, for enterprise reproducibility, standardizing on a multi-stage `Dockerfile` (Node 20 Alpine, unprivileged user, non-root) and `docker-compose` (spinning up MongoDB, Redis, and local MinIO/S3) is the immediate next step for team onboarding."* |
| **8** | **Unclear Production Email Provider** | `email.js` contains dual logic for Nodemailer SMTP and Resend API. | Developed locally with Gmail App Passwords while preparing for transactional API delivery via Resend. | *"[UNCLEAR, confirm with author]. The codebase supports both Resend API and Nodemailer SMTP. In a mature cloud production deployment, Resend or AWS SES with verified DKIM/SPF domain records should be strictly enforced via Zod schema rather than allowing fallback to personal Gmail SMTP."* |
| **9** | **Missing Failure Mode E2E Tests** | Playwright specs in `frontend/e2e/` test happy paths (signup, upload, chat, review) without network failure tests. | Prioritized full user journey verification on a tight delivery schedule. | *"Our 93 unit and integration tests thoroughly exercise failure branches (expired tokens, invalid magic bytes, rate limits), but E2E tests currently focus on happy paths. I would expand Playwright tests using `page.route()` to simulate 500 AI service outages, dropped SSE connections, and token refresh failures to assert error boundary UI states."* |
| **10** | **Single-Instance Monolith Scaling** | Backend runs as a unified Express 5 instance performing both HTTP serving and CPU-intensive PDF parsing. | A modular monolith provided maximum feature velocity and minimal operational overhead for an individual engineer. | *"Running PDF extraction and vector embedding inside the HTTP API process risks CPU starvation during peak uploads. The architectural evolution is decoupling into two services: an **Express HTTP API** that accepts uploads and enqueues jobs, and a **Node.js/Python Worker Service** that consumes queue events and interacts with the AI models."* |

---

## 6. Flagged Items & Author Clarifications Checklist

Keep these 5 items in mind during your interview. If asked about them, give the exact, honest answer and offer to verify:

1. **[VERIFY] MongoDB Atlas Vector Search Index Status**:
   - *Code reality*: The backend defaults to `VECTOR_SEARCH=app` (in-memory cosine similarity), but fully implements `searchAtlas` using `$vectorSearch` (`backend/src/services/retrieval.js:31-44`).
   - *Interview stance*: State that the code supports both; highlight how the in-app fallback enabled zero-cost testing, but verify with the author whether the `"chunk_embeddings"` index has been deployed on the live production Atlas cluster.
2. **[UNCLEAR, confirm with author] Active Transactional Email Provider**:
   - *Code reality*: `backend/src/services/email.js` supports Resend API and Nodemailer (SMTP/Gmail). `env.js:34` defaults to `onboarding@resend.dev`.
   - *Interview stance*: Confirm whether production utilizes a verified Resend domain or an authenticated Gmail SMTP transport.
3. **[UNCLEAR, confirm with author] Production User Volume & Analytics**:
   - *Code reality*: No Google Analytics, PostHog, or Mixpanel SDKs are present in the frontend. Only Sentry error monitoring is configured.
   - *Interview stance*: Do not invent inflated DAU numbers (e.g. "10,000 daily users"). Frame it as a fully functional, production-deployed platform tested under rigorous automated suites. Confirm real user volume with the author.
4. **[VERIFY] Railway Container Worker Concurrency Limits**:
   - *Code reality*: `backend/src/services/ingestion/queue.js:7` sets `CONCURRENCY = 2`.
   - *Interview stance*: Mention that concurrency is capped at 2 to protect memory limits on free/starter tiers (512MB RAM), preventing out-of-memory (OOM) crashes during concurrent PDF extractions.
5. **[UNCLEAR, confirm with author] Project Genesis & Collaboration**:
   - *Code reality*: Utkarsh Shukla authored 84 of 91 commits (92.3%). Initial commits from March 2026 show Navneet Krishna and Digvijay Singh collaborating on an early prototype.
   - *Interview stance*: Present Utkarsh as the lead engineer and primary architect who took an early prototype and engineered the complete full-stack revamp, RAG pipeline, security hardening, and test suites.

---

## 7. The 10-Minute Last-Minute Revision Checklist

Review this 10-minute mental checklist right before walking into the interview room:

### [ ] 1. The 60-Second Auth Lifecycle
- User logs in -> Server issues 15-min JWT in body + 30-day SHA-256 hashed refresh token in `httpOnly` cookie `st_rt`.
- Client stores JWT in JS memory variable (`let accessToken = null`).
- Axios interceptor catches 401 -> deduplicates concurrent callers via `refreshPromise ??= axios.post('/auth/refresh')` -> replays failed requests.
- Password change bumps `user.tokenVersion` -> immediately invalidates outstanding JWTs on all devices.

### [ ] 2. The 60-Second Grounded RAG Pipeline
- PDF uploaded -> inspected for `%PDF-` magic bytes in first 1KB -> uploaded to Cloudinary/local -> enqueued in FIFO worker (concurrency 2).
- Worker extracts text with `unpdf` -> if chars/page < 40, runs Gemini Vision OCR -> chunks text into 3200-char slices with 400-char overlap.
- Batched vector embeddings (768-dim) generated via `gemini-embedding-001`.
- User asks question -> question merged with chat history -> top 6 chunks retrieved via cosine similarity or Atlas `$vectorSearch` -> streamed token-by-token over Server-Sent Events (`text/event-stream`) with clickable page citations.

### [ ] 3. The 60-Second FSRS Memory Algorithm
- Replaces legacy SM-2. Uses `ts-fsrs` with 90% target retention and randomized fuzzing.
- Models memory across **Stability** (decay rate) and **Difficulty**.
- User rates recall 1 to 4 (`Again`, `Hard`, `Good`, `Easy`). System calculates exact next review timestamp.
- Due cards separated from daily new card limit; daily review state normalized to user's local timezone.

### [ ] 4. The 30-Second Express 5 Advantage
- Express 5 natively catches rejected Promises in route handlers and passes them to `next(err)` without requiring `express-async-errors`.
- `req.query` is a read-only getter, preventing query parameter pollution vulnerabilities (parsed queries are accessed via `req.validatedQuery`).

### [ ] 5. Five Key File Anchors to Quote Verbatim
1. `backend/src/middlewares/authMiddleware.js`: Parallel DB query for user and session; token versioning check.
2. `backend/src/controllers/authController.js:86-118`: Google OAuth pre-hijacking squatter eviction.
3. `backend/src/services/ingestion/queue.js`: Concurrency-limited FIFO queue with startup recovery (`resumePendingIngestion`).
4. `frontend/src/lib/api.js`: Concurrency-safe silent token refresh using nullish coalescing assignment (`??=`).
5. `frontend/src/components/PdfViewer.jsx`: Continuous scroll page tracking via `IntersectionObserver` with programmatic scroll lock.
