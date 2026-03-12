### StudyTantra – AI Learning Assistant (MERN + Google Gemini)

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

## ✨ Core Features

1. **User Authentication (JWT)**
   - Secure **login** and **signup**
   - JSON Web Token–based authentication
   - Protected routes on both frontend and backend

2. **PDF Upload & Management**
   - Upload PDFs from the dashboard
   - Store file metadata (size, pages, title, owner)
   - View, delete, and manage documents per user

3. **Embedded PDF Viewer**
   - Read documents **inside the app**
   - No need to download / open in external viewer
   - Works together with AI chat and other tabs

4. **AI‑Powered Chat (Google Gemini)**
   - Ask questions **about a specific PDF**
   - Context‑aware responses based on document content
   - Chat history stored per document & per user

5. **AI Document Summary**
   - One‑click **summaries** of entire documents
   - Helps quickly revise or decide what to read in detail

6. **AI Concept Explainer**
   - Highlight a topic / phrase and ask for explanations
   - Get detailed, simplified breakdowns of complex concepts

7. **Auto‑Generated Flashcards**
   - AI generates smart **Q/A flashcards** from your document
   - Flip animation & clean UI for active recall
   - Filter favourites, track which you’ve reviewed

8. **AI Quiz Generator**
   - Generate **multiple‑choice quizzes** from document content
   - Configurable number of questions
   - Stores correct answer with explanation

9. **Quiz Results & Analytics**
   - See score breakdown per attempt
   - View correct/incorrect answers and detailed explanations
   - Track improvement over multiple attempts

10. **Progress Tracking Dashboard**
    - Overview cards:
      - Total documents
      - Total flashcards
      - Total quizzes and average score
    - Recent activity feed (uploads, quizzes, chats)

11. **Favorites System**
    - Mark important flashcards / documents as favourites
    - Quick access for revision sessions

12. **Responsive, Modern UI**
    - Built with **React + Tailwind CSS**
    - Mobile‑friendly layout, dark‑mode friendly design (optional)
    - Clean, dashboard‑style experience

---

## 🧱 Tech Stack

### Frontend (`/study-dashboard`)

- **React** (with **Vite**)
- **React Router** (for SPA routing)
- **Tailwind CSS** (utility‑first styling)
- Optional libraries:
  - Icon set (e.g. Lucide, Heroicons)
  - Charting (Recharts / Chart.js) for dashboards
  - `react-pdf` for PDF viewing

### Backend (planned)

- **Node.js** + **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- File storage:
  - Local uploads folder **or**
  - Cloud storage (Cloudinary, AWS S3, etc.)

### AI / LLM

- **Google Gemini API**
- Node.js SDK or REST HTTP client
- Prompt engineering for:
  - Summaries
  - Concept explanations
  - Flashcard generation
  - Quiz generation
  - Chat responses

---

## 📂 Project Structure (planned)

High‑level structure:

```text
StudyTantra-MERN-1/
  ├─ readme.md                 # Project-level README (this file)
  ├─ backend/                  # Node + Express + MongoDB (planned)
  │   ├─ src/
  │   │   ├─ models/           # User, Document, Flashcard, Quiz, ChatHistory
  │   │   ├─ routes/           # Auth, documents, AI, flashcards, quizzes, dashboard
  │   │   ├─ controllers/
  │   │   ├─ middlewares/      # auth, error handling
  │   │   └─ utils/            # AI, PDF processing, helpers
  │   └─ ...
  └─ study-dashboard/          # React frontend (Vite + Tailwind)
      ├─ src/
      │   ├─ pages/            # Login, Register, Dashboard, Document, Quiz, Profile, etc.
      │   ├─ components/       # Navbar, Cards, Chat UI, Flashcard, Charts, etc.
      │   ├─ hooks/            # auth, API, etc.
      │   ├─ lib/              # API client, constants
      │   └─ ...
      ├─ package.json
      └─ ...