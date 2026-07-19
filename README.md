# StadiaX — The Autonomous AI Operating System for Smart Stadiums

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.100+-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Project-FFCA28?style=flat&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**StadiaX** is an enterprise-grade AI operational intelligence platform purpose-built for the **FIFA World Cup 2026** and future mega sporting events. Designed to resemble a real-time FIFA Command Center, StadiaX connects Fans, Stadium Operators, Security Teams, Volunteers, Transit Authorities, Concessions Vendors, and Medical/Accessibility units into a single unified AI-driven operating network.

---

## 🎯 Production Live Environment

* **Live Telemetry Cockpit URL:** [https://stadiax-c8ab0.web.app](https://stadiax-c8ab0.web.app)
* **GitHub Codebase:** [https://github.com/Adityasri05/StadiaX](https://github.com/Adityasri05/StadiaX)

---

## 🏗️ Architecture Design

StadiaX is built on a decoupled, asynchronous, event-driven microservices architecture.

```
                         StadiaX Frontend
                                │
                                │ HTTP / WebSockets
                      API Gateway (FastAPI)
                                │
      ──────────────────────────────────────────────────────────
      │                 │                 │                  │
Auth Service       AI Gateway          Crowd              Transit
 (JWT/RBAC)      (LangGraph/Qdrant)   Service            Service
      │                 │                 │                  │
  [SQL DB]       [Memory Vectors]     [Sensor streams]   [Schedules]
      │                 │                 │                  │
      ──────────────────────────────────────────────────────────
                                │
                        Redis Message Bus
                         (Event Stream)
                                │
      ──────────────────────────────────────────────────────────
      │                 │                 │                  │
Security            Volunteer         Operations          Vendors
Service              Service           Service            Service
(Evac overrides)     (Rosters)        (Facility checks)   (POS/Stock)
```

---

## ⚡ Technical Stack

### Frontend Client
* **Framework:** Next.js 16 (App Router, Server-Safe Client Rendering).
* **State Management:** Zustand (reactive stores for telemetry and event routing).
* **3D Visualizer:** WebGL Three.js Stadium wireframes with particle swarm simulations.
* **Interactive Map:** Asynchronous vector SVG stadium layout with layer managers.
* **Animations:** Framer Motion (smooth micro-animations, audio waves, scans).
* **Styling:** Tailwind CSS v4 (luxury glassmorphic cards, glowing borders, Space Grotesk/Inter fonts).

### Backend Microservices
* **Core Engine:** FastAPI (stateless REST APIs).
* **Event Broker:** Redis Streams (asynchronous publisher-subscriber client).
* **Auth Guard:** Signed JWT Access/Refresh tokens with Role-Based Access Control (RBAC).
* **Fault Tolerance:** Custom stateful Circuit Breaker decorators with HTTP/Gemini API fallbacks.
* **Database Layer:** SQLite (auth registers), Qdrant (vector AI memories), and local JSON ledger stores.

---

## 🤖 Gemini AI Integration
StadiaX integrates Gemini AI to power the **AI Fan Concierge** module:
* **Model:** `gemini-2.5-flash-lite` (highly optimized, low-latency multimodal reasoning).
* **Context Ingestion:** The agent pulls live context from the stadium operations grid, including current match time/score, active stadium simulation mode, and live incidents list.
* **Route Generation**: If users request help navigating the stadium, the assistant outputs a structured JSON block containing route telemetry (estimated walk times, wheelchair accessibility parameters, and emergency bypass updates) which is then projected onto the 2D vector map layout in real-time.

---

## 🧪 Unit & Component Testing
The project includes a robust testing suite containing **27 unit & component tests** built on top of **Vitest** and **React Testing Library**:
* **Testing Engine**: Vitest (featuring jsdom environment and Vite path alias resolution).
* **Mock Environment**: Mocked Canvas contexts (for Three.js and background visualizers) and Firebase Client SDK components.
* **Coverage Scope**:
  - `store.test.ts`: Zustand store mutations (match minute ticking, incident resolution, map layers).
  - `error-boundary.test.tsx`: Exploding React components rendering containment and system reinitializations.
  - `topbar.test.tsx`: Top bar layout rendering, accessibility `aria-label` values, and language listbox controls.
  - `sidebar.test.tsx`: Sidebar items and dynamic state incident counter badge values.
  - `landing.test.tsx`: Feature modules rendering grids and direct auth paths.
  - `auth.test.tsx`: Tab-based login/signup toggles and input validations.

To run the full test suite locally:
```bash
npm run test
```

---

## 🚀 Setup & Execution

### 1. Configure Environment Files

Create [.env.local](file:///d:/Hackathon%20Projects/StadiaX/.env.local) in the root directory and [backend/.env](file:///d:/Hackathon%20Projects/StadiaX/backend/.env) in the `/backend` directory:

```env
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key

# Firebase SDK Credentials
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=stadiax-c8ab0.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=stadiax-c8ab0
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=stadiax-c8ab0.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Start the Backend Server (Local Mock Mode)
To run the backend instantly without setting up external Redis or Qdrant databases:
```bash
cd backend
pip install -r requirements.txt
python run_local_mock.py
```
This runs a unified FastAPI backend on `http://localhost:8000` with simulated Redis Streams, in-memory SQLite, and real-time WebSocket broadcasters.

### 3. Start the Backend Server (Production Docker Mode)
If Docker is installed:
```bash
cd backend
docker compose up --build
```

### 4. Start the Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the StadiaX command dashboard.

---

## ⚡ Testing the Event Pipeline
Test the real-time event broadcaster using curl:
```bash
curl -X POST http://localhost:8000/api/v1/security/incident \
  -H "Content-Type: application/json" \
  -d '{"title": "Elevator B-3 Outage", "location": "Sector 108 Corridor", "priority": "high", "category": "Accessibility"}'
```
The API Gateway will receive the incident, update the analytics timeline, and instantly push a JSON notice via the WebSocket channel (`ws://localhost:8000/ws/telemetry`), prompting the frontend cockpit to update live alert indicators in real time.
