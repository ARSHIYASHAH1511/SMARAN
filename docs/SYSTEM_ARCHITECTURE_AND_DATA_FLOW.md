# 🏗️ SMARAN: System Architecture & Data Flow Guide

> **Document Type:** Technical & Engineering Architecture Guide  
> **Status:** Current Codebase Baseline + Dual-Face Evolution  

---

## 1. Codebase Directory Map

```
/
├── .env.example                      # Secrets template (GEMINI_API_KEY, APP_URL)
├── firebase-applet-config.json       # Firebase credentials & Firestore project configuration
├── firebase-blueprint.json          # Firestore collection blueprints
├── firestore.rules                   # Security rules for multi-user / caregiver sync
├── index.html                        # PWA entry point & semantic metadata
├── metadata.json                     # Applet capabilities & metadata
├── package.json                      # Dependencies (React 19, Three.js, Lucide, Express, etc.)
├── server.ts                         # Node.js Express server + @google/genai proxy routes
├── tsconfig.json                     # TypeScript compiler configuration
├── vite.config.ts                    # Vite build configuration with Tailwind CSS v4
│
├── public/
│   ├── manifest.json                 # Web App Manifest (standalone PWA, theme color)
│   └── sw.js                         # Service worker for offline asset caching & notifications
│
├── docs/                             # Architectural Specifications
│   ├── DUAL_FACE_DUOLINGO_REHAB_SPEC.md   # Product & UX spec for Duolingo rehab model
│   ├── GEMMA_PHOTO_TIMELINE_SYSTEM.md     # Vision pipeline & prompt engineering
│   └── SYSTEM_ARCHITECTURE_AND_DATA_FLOW.md # (This file) Complete technical architecture
│
└── src/
    ├── App.tsx                       # Main coordinator, tab router, SOS & Voice AI modal
    ├── main.tsx                      # StrictMode entry & ErrorBoundary
    ├── index.css                     # Tailwind v4 import & elder-friendly micro-animations
    │
    ├── assets/
    │   └── images/                   # Pre-bundled high-res cultural photos & therapist avatar
    │
    ├── components/
    │   ├── Dashboard.tsx             # Patient home screen with 8:00 AM alarm & game entry points
    │   ├── DailyTasksView.tsx        # Circadian schedule, reminders, and daily care list
    │   ├── DailyRituals.tsx          # 5 holistic daily anchors (Sunlight, Tea, Movement, Sandhya)
    │   ├── MemoryPalace.tsx          # 3D spatial room (Three.js / React Three Fiber)
    │   ├── PhotoAlbum.tsx            # Realistic 3D card-flip photo album with reminiscence cues
    │   ├── Therapist.tsx             # Reminiscence conversation companion with multi-chat support
    │   ├── ReminderModal.tsx         # Urgent full-screen audio alert for scheduled tasks
    │   ├── ReminderManagerModal.tsx  # Caregiver modal to add/edit repeating reminders
    │   ├── CheckInModal.tsx          # Morning mood, orientation, and season check-in
    │   ├── CognitiveTrendChart.tsx   # Visual graph of memory & motif telemetry
    │   ├── TutorialModal.tsx         # Step-by-step elder walkthrough
    │   │
    │   └── games/
    │       ├── MotifMatch.tsx        # Cultural icon matching (visual recognition)
    │       ├── MemoryCards.tsx       # Flip-card pair matching
    │       └── SequenceMemory.tsx    # Working memory auditory-visual Simon-style sequence
    │
    ├── contexts/
    │   └── LanguageContext.tsx       # Trilingual language state provider (EN, HI, AS)
    │
    └── lib/
        ├── db.ts                     # LocalForage IndexedDB wrapper for Memories & Photos
        ├── activityStore.ts          # Telemetry store for game logs & hesitation times
        ├── reminderEngine.ts         # Audio synthesizer, chime player, & reminder scheduling
        ├── dailyRitualsEngine.ts     # Circadian rituals status & completion tracking
        ├── translations.ts           # Comprehensive translations (English, Hindi, Assamese)
        └── firebase.ts               # Optional Firestore cloud sync initialization
```

---

## 2. End-to-End Data Flow

### 2.1 Daily Habit Loop (Patient Side)

```
[Time: 08:00 AM] 
       │
       ▼
reminderEngine.ts
       │──> Fires Web Audio chime ("ghanti" prayer bell)
       │──> Web Speech API announces: "Good morning! Time for morning sanctuary."
       │──> Dispatches active reminder alert to App.tsx
       │
       ▼
CheckInModal.tsx
       │──> Patient chooses mood (Peaceful / Cheerful / Restful)
       │──> Verifies today's season & weather
       │──> Increments consecutive streak in localStorage ('smriti_streak')
       │
       ▼
Dashboard.tsx (Quests available)
       │──> Step 1: MotifMatch.tsx (Scores & hesitation logged to activityStore.ts)
       │──> Step 2: PhotoAlbum.tsx (Presents Gemma-generated photo of the day)
       │──> Step 3: Therapist.tsx (Patient answers reminiscence prompt)
       │
       ▼
localforage (memories) & activityStore (telemetry)
       │──> Stored locally with zero network dependency
```

### 2.2 Photo Timeline Ingestion (Caregiver Side)

```
Caregiver uploads 10 family photos
       │
       ▼
db.fileToBase64() (src/lib/db.ts)
       │──> Compresses & encodes image payloads
       │
       ▼
POST /api/timeline/generate (server.ts)
       │──> Google GenAI SDK (Gemini 2.5 Flash / Gemma Vision)
       │──> Reconstructs chronological ordering & tags
       │──> Synthesizes gentle reminiscence cues
       │
       ▼
IndexedDB ('memories' store)
       │──> Saved into local memory array
       │──> Automatically updates PhotoAlbum.tsx and MemoryPalace.tsx
```

### 2.3 Clinical Telemetry & Neurologist Report Generation

```
Caregiver taps "Generate Clinical Report"
       │
       ▼
POST /api/report (server.ts)
       │──> Receives:
       │    - activityStore.getActivities() (scores, hesitation time)
       │    - therapist chat transcripts
       │    - patient age & background
       │
       ▼
Gemini Geriatric Clinical Reasoning
       │──> Analyzes visual working memory stability
       │──> Assesses semantic fluency & vocabulary trends
       │──> Evaluates sundowning risk & medication compliance
       │
       ▼
Returns Formatted Markdown / Printable PDF
       │──> Formatted with clinical staging (FAST 3-4, MCI)
       │──> Actionable home adaptations for family caregivers
```

---

## 3. Technology Stack Rationale

| Layer | Selected Technology | Clinical & Engineering Rationale |
| :--- | :--- | :--- |
| **UI Framework** | React 19 + TypeScript | High stability, component modularity, strict typing for patient telemetry. |
| **Styling** | Tailwind CSS v4 | High-performance CSS without runtime overhead; easy implementation of high-contrast elder styling. |
| **3D Rendering** | Three.js + React Three Fiber | Real-time spatial exploration for the Method of Loci Memory Palace without heavy external game engines. |
| **Client Storage** | LocalForage (IndexedDB) | Accommodates large base64 family images and offline logs far exceeding localStorage's 5MB limit. |
| **Audio Engine** | Web Audio API + HTML5 Audio | Generates precise synthesized acoustic chimes (bell-metal ghanti) without requiring external audio downloads. |
| **Voice & Speech** | Web Speech Recognition & SpeechSynthesis | Enables voice navigation and auditory accessibility for illiterate or visually impaired seniors. |
| **AI Backend** | Express + `@google/genai` TypeScript SDK | Safe server-side proxy for Gemini 2.5 Flash and Gemma Multimodal models with zero client-side API key leakage. |

---

## 4. Dual-Persona Implementation Blueprint

In the next phase of development, the two faces can be toggled via an elder-proof gateway:

```typescript
// Proposed Mode Context
type AppMode = 'patient' | 'caregiver';

interface AppModeContextType {
  mode: AppMode;
  unlockCaregiver: (pin: string) => boolean;
  returnToPatient: () => void;
  activePrescription: CaregiverPrescription;
  updatePrescription: (prescription: CaregiverPrescription) => void;
}
```

- When `mode === 'patient'`: All administrative menus, chart exports, and complex settings are hidden. Only the daily stepping-stone journey, 8:00 AM alarm, games, album, and one-tap family call are visible.
- When `mode === 'caregiver'`: The full telemetry dashboard, batch photo uploader, medication editor, and neurologist report generator are unlocked.

---
*Maintained by the SMARAN Core Engineering Team.*
