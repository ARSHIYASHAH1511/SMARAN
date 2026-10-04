# 🌿 SMARAN (FireFly AI)
### *A Dual-Faced Cognitive Rehabilitation Sanctuary & Duolingo-Style Daily Habit Loop for Dementia Care*

> **"Remember. Relive. Reconnect."**  
> An offline-first, culturally anchored cognitive therapy platform engineered to slow dementia progression through gentle gamified habit loops, family-prescribed therapy sessions, and AI-synthesized photographic lifelines powered by Google Gemma and Gemini multimodal models.

---

## 📑 Table of Contents

1. [Executive Summary & Core Philosophy](#1-executive-summary--core-philosophy)
2. [The Duolingo Paradigm for Dementia: Rehabilitation vs. Testing](#2-the-duolingo-paradigm-for-dementia-rehabilitation-vs-testing)
3. [The Dual-Faced Architecture: Patient vs. Family](#3-the-dual-faced-architecture-patient-vs-family)
   - [Face A: The Patient Sanctuary (Elder-First UX)](#face-a-the-patient-sanctuary-elder-first-ux)
   - [Face B: The Family & Caregiver Command Center](#face-b-the-family--caregiver-command-center)
4. [Gemma Multimodal Photo Timeline Engine ("Lifeline")](#4-gemma-multimodal-photo-timeline-engine-lifeline)
   - [The Memory Degradation Gradient & Rationale](#the-memory-degradation-gradient--rationale)
   - [Batch Photo Ingestion & Chronological Synthesis Pipeline](#batch-photo-ingestion--chronological-synthesis-pipeline)
   - [Multimodal Prompt Architecture](#multimodal-prompt-architecture)
5. [Cognitive Rehabilitation Modules & Daily Quests](#5-cognitive-rehabilitation-modules--daily-quests)
   - [Module 1: Orientation & Circadian Anchoring (Daily 8:00 AM)](#module-1-orientation--circadian-anchoring-daily-800-am)
   - [Module 2: Visual Motif & Pattern Recognition (Motif Match)](#module-2-visual-motif--pattern-recognition-motif-match)
   - [Module 3: Working Memory & Auditory Retention (Sequence Memory)](#module-3-working-memory--auditory-retention-sequence-memory)
   - [Module 4: Spatial Anchoring (3D Memory Palace)](#module-4-spatial-anchoring-3d-memory-palace)
   - [Module 5: Reminiscence Companion (Conversational Therapy)](#module-5-reminiscence-companion-conversational-therapy)
6. [System Architecture & Offline-First Engineering](#6-system-architecture--offline-first-engineering)
7. [Data Models & Schema Specifications](#7-data-models--schema-specifications)
8. [API Reference](#8-api-reference)
9. [Privacy, Data Sovereignty & Clinical Disclaimers](#9-privacy-data-sovereignty--clinical-disclaimers)
10. [Local Development & Deployment Guide](#10-local-development--deployment-guide)

---

## 1. Executive Summary & Core Philosophy

Dementia and Alzheimer's disease affect over 55 million individuals worldwide, with millions of elderly individuals living in multi-generational households across South Asia and developing regions where specialized memory care institutions are scarce or culturally resisted.

Traditional digital cognitive tools fail dementia patients because they are:
1. **Diagnostic & Stress-Inducing:** They subject seniors to high-pressure pass/fail neuropsychological tests (e.g., MMSE, MoCA) that trigger catastrophic emotional reactions and agitation.
2. **Culturally Alien:** They utilize westernized iconography and abstract logic games disconnected from the senior's lived experience.
3. **Passive or Single-Sided:** They either place all burden on the patient alone or require caregivers to constantly supervise without automated structure.

**SMARAN (FireFly AI)** reimagines dementia care as a **positive, rehabilitative habit loop inspired by Duolingo**, built upon a strict **Two-Faced ecosystem**:

```
+--------------------------------------------------------------------------------+
|                                SMARAN ECOSYSTEM                                |
+--------------------------------------------------------------------------------+
|                                                                                |
|   FACE A: PATIENT SANCTUARY                         FACE B: CAREGIVER PORTAL   |
|   (Zero Stress • Daily Habit Loop)                 (Prescribe • Monitor • Tune)|
|                                                                                |
|   • Gentle 8:00 AM Wakeup & Anchoring               • Prescribe Daily Quests   |
|   • Duolingo-style Bite-Sized Quests                • Schedule Meds & Rituals  |
|   • Cultural Motif Match & Sequence Puzzles         • Upload Family Photo Pack |
|   • 3D Spatial Memory Palace                        • Gemma Timeline Generator |
|   • Reminiscence Therapy Companion                  • Cognitive Telemetry &    |
|   • Multi-dialect Audio & High-Contrast UI            Clinical Reports (PDF)   |
|                                                                                |
+---------------------------------------+----------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |          OFFLINE-FIRST CORE ENGINE          |
                 |  IndexedDB Local Cache • Service Worker PWA |
                 |    Gemini / Gemma Vision & Chat Pipeline    |
                 +---------------------------------------------+
```

---

## 2. The Duolingo Paradigm for Dementia: Rehabilitation vs. Testing

| Traditional Dementia Apps / Memory Tests | SMARAN: The Duolingo Rehab Paradigm |
| :--- | :--- |
| **Pass / Fail Grading:** "You scored 14/30. Severe decline detected." | **Effort & Continuity Celebration:** "5-Day Morning Streak! 🌟 You lit today's Diya!" |
| **High Friction & Complexity:** Deep settings menus, passwords, tiny buttons. | **Zero Friction Tap-and-Play:** Max 1 primary action per screen, warm voice guidance. |
| **Standardized Abstract Shapes:** Generic circles, triangles, chess pieces. | **Culturally Grounded Reminiscence:** Assamese Gamosa, Jaapi, brass prayer bell, family tea garden photos. |
| **Punitive Fail States:** Red buzzer sounds, game over screens. | **Gentle Redirection:** No losing screen. Gentle hints, soft audio chimes, infinite calm retries. |
| **Isolated Solo Play:** Senior plays alone; family only finds out when a crisis occurs. | **Family-in-the-Loop:** Family configures daily quests and receives longitudinal telemetry without intruding. |

### The "Dementia Duolingo" Habit Loop
1. **The Morning Anchor (Cue):** At 8:00 AM daily, a soothing temple chime sounds with a localized voice reminder (*"Suprabhat Ma. Let us begin our peaceful morning together"*).
2. **Micro-Quests (Routine):** 3 bite-sized daily activities taking no more than 3-5 minutes each:
   - *Quest 1: Morning Check-in & Orientation* (State today's feeling, identify the day/season).
   - *Quest 2: Cultural Pattern Match* (Match 3 pairs of familiar motifs like Jaapi or Kopou Phool).
   - *Quest 3: Photographic Reminiscence* (Look at an auto-dated photo from the family timeline and share one thought).
3. **Calm Affirmation (Reward):** Lighting a virtual brass Diya, unlocking a memory node in their 3D palace, and building their daily streak counter.
4. **Neuroplasticity Preservation:** Consistent, stress-free activation of frontal and temporal lobes maintains synaptic connections, reducing apathy and agitation (sundowning).

---

## 3. The Dual-Faced Architecture: Patient vs. Family

The application operates as two distinct operational modes sharing a unified local-first data layer:

### Face A: The Patient Sanctuary (Elder-First UX)

Designed specifically for users with Mild Cognitive Impairment (MCI) through Moderate Dementia (FAST stages 3 to 5):

- **Zero Passwords / Frictionless Access:** Instant launch via PWA home screen icon or scheduled service-worker push notification.
- **Physical Ergonomics:** Minimum 56px touch targets, generous spacing, high color contrast (>7:1 ratio), soft warm paper background (`#faf8f5`) to eliminate glare and eye fatigue.
- **Cognitive Ergonomics:**
  - No nested navigation trees; all core destinations available in a bottom tab dock.
  - Consistent iconography paired with plain language labels.
  - Spoken audio fallback on every item (Text-to-Speech in English, Hindi, Assamese, etc.).
- **Gentle Panic Fallback (One-Touch Family SOS):** Big, calming "Call Daughter/Son" button that connects directly with visual confirmation without dialing confusion.

### Face B: The Family & Caregiver Command Center

Designed for adult children, spouses, and geriatric nursing aides:

1. **Therapy & Quest Prescription Engine:**
   - Define which cognitive quests are assigned each day (e.g., higher visual emphasis on Mondays, auditory memory on Wednesdays).
   - Adjust difficulty curves dynamically (2x2 grid vs. 3x3 grid, sequence speed, reminder snooze durations).
2. **Circadian Care & Medical Protocol Configuration:**
   - Configure medication alarms (e.g., Morning Blood Pressure at 8:15 AM, Evening Metformin at 8:00 PM).
   - Schedule circadian anchors: Morning courtyard sunlight, 11:00 AM hydration, 4:00 PM Tulsi tea, 6:30 PM Sandhya evening lamp lighting.
3. **Family Photo Uploader & Timeline Synthesizer:**
   - Drag-and-drop batch upload of up to 30 family photographs at once.
   - Triggers the Gemma Multimodal Vision pipeline to extract approximate dates, tags, people, and context.
   - Review and fine-tune AI-generated dates and descriptions before publishing to the patient's album and 3D palace.
4. **Telemetry & Neurological Progression Analytics:**
   - Longitudinal tracking of hesitation times, sequence retention length, and daily completion consistency.
   - Automated export of **Clinical Cognitive Assessment & Dementia Progression Reports** formatted in Markdown/PDF for the patient's neurologist.

---

## 4. Gemma Multimodal Photo Timeline Engine ("Lifeline")

```
   +---------------------------------------------------------------------+
   |                      CAREGIVER PHOTO BATCH UPLOAD                   |
   |   (Old vintage photos, festival prints, weddings, grandchildren)    |
   +----------------------------------+----------------------------------+
                                      |
                                      v
   +---------------------------------------------------------------------+
   |         GEMMA / GEMINI MULTIMODAL VISION REASONING PIPELINE         |
   |                                                                     |
   |  1. Visual Era Analysis      : Monochrome vs. Kodachrome, fashion  |
   |  2. OCR & Artifact Detection : Handwritten years, calendar walls    |
   |  3. Inter-Photo Chronology   : Facial aging, children milestones    |
   |  4. Cultural Grounding       : Festivals (Bihu, Durga Puja, Diwali) |
   |  5. Reminiscence Prompts     : Open-ended, non-threatening questions|
   +----------------------------------+----------------------------------+
                                      |
                                      v
   +---------------------------------------------------------------------+
   |                SYNTHESIZED CHRONOLOGICAL LIFELINE                   |
   |                                                                     |
   |   [1958] Childhood in Dibrugarh    -> Tea garden stroll             |
   |   [1974] Wedding Day              -> Traditional Muga silk Mekhela  |
   |   [1982] First Home               -> Courtyard tulsi plantation     |
   |   [2005] Daughter's Graduation     -> Family celebration            |
   |   [2021] Grandchildren at Bihu     -> Dancing in courtyard          |
   +----------------------------------+----------------------------------+
                   |                                  |
                   v                                  v
   +-------------------------------+  +-------------------------------+
   |      3D MEMORY PALACE         |  |   AI REMINISCENCE COMPANION   |
   |  Interactive Spatial Nodes    |  |  Grounded Memory Conversation |
   +-------------------------------+  +-------------------------------+
```

### The Memory Degradation Gradient & Rationale

According to **Ribot's Law of Retrograde Amnesia**, memories formed most recently are lost first, whereas remote episodic memories formed in youth and early adulthood (the "Reminiscence Bump", ages 10–30) remain resilient longest.

When patients are presented with unorganized, out-of-order photos, their brain struggles with temporal disorientation, leading to distress. The **Gemma Timeline Engine** automatically reconstructs a linear, chronological autobiography:
- **Childhood / Early Years (Roots):** Establishes psychological safety and identity.
- **Adulthood / Family Formation (Anchor):** Connects emotional bonds to children and home.
- **Later Years / Grandchildren (Bridge):** Helps the senior bridge remote memories to their current reality.

### Batch Photo Ingestion & Chronological Synthesis Pipeline

1. **Client-Side Image Optimization:** Caregiver uploads multiple images (`.png`, `.jpg`, `.heic`). Images are compressed client-side to max 1280px resolution and converted to base64 or stored in IndexedDB/Cloud Storage.
2. **Parallel Vision Analysis:** The batch is sent to `/api/timeline/generate` with contextual caregiver hints (e.g., patient birth year: 1950, patient hometown: Guwahati).
3. **Multimodal Sorting Algorithm:** The AI model cross-references:
   - Visual aging of recurring family members across images.
   - Print characteristics (black-and-white grain, sepia tone, 1980s color saturation, digital mobile photos).
   - Contextual cultural artifacts (clothing cuts, vintage automobiles, furniture styles).
   - Explicit timestamps or background text detected via OCR.
4. **Output Schema:** Returns an ordered JSON timeline array enriched with reminiscence questions designed to stimulate recall without causing anxiety.

### Multimodal Prompt Architecture

```json
{
  "systemInstruction": "You are a geriatric cognitive rehabilitation specialist and multimodal archivist for SMARAN. Your task is to analyze a collection of family photographs belonging to an elderly dementia patient and synthesize an orderly, chronological 'Lifeline' with gentle reminiscence prompts.",
  "parameters": {
    "temperature": 0.2,
    "responseMimeType": "application/json"
  },
  "promptContract": {
    "timeline": [
      {
        "estimatedYear": 1974,
        "estimatedDecade": "1970s",
        "title": "Wedding Blessing",
        "description": "Draped in a traditional ivory and gold Muga silk Mekhela Chador with red floral borders, surrounded by joyful family members.",
        "keyPeopleDetected": ["Patient (Bride)", "Groom", "Elder Matriarch"],
        "culturalContext": "Assamese Traditional Wedding Ceremony",
        "reminiscenceCue": "Do you remember the sweet fragrance of the Kopou Phool flowers in your hair on this sunny day?",
        "confidenceScore": 0.92
      }
    ]
  }
}
```

---

## 5. Cognitive Rehabilitation Modules & Daily Quests

### Module 1: Orientation & Circadian Anchoring (Daily 8:00 AM)
- **Clinical Basis:** Disruption of circadian rhythms is a hallmark of dementia, accelerating cognitive decline and nighttime agitation (sundowning).
- **Implementation:** Automatic 8:00 AM audio gong, time-of-day greeting, and check-in modal prompting the senior to observe the weather and acknowledge morning medications.

### Module 2: Visual Motif & Pattern Recognition (Motif Match)
- **Clinical Basis:** Stimulates the ventral visual stream and parietal-occipital lobes.
- **Cultural Design:** Employs indigenous North Eastern motifs:
  - 🦏 *Kaziranga Rhino* (State symbol of Assam)
  - 🧣 *Gamosa Border* (Handwoven red-and-white motif)
  - 🌸 *Kopou Phool* (Foxtail orchid, festive blossom)
  - 👒 *Jaapi* (Conical woven sun hat)
  - 🪕 *Dhol & Pepa* (Festive Bihu musical instruments)
- **Duolingo Mechanic:** Starts with a 4-card match (Level 1), progressing smoothly to 6 and 8 cards as the senior's confidence stabilizes.

### Module 3: Working Memory & Auditory Retention (Sequence Memory)
- **Clinical Basis:** Exercises the phonological loop and prefrontal working memory buffers.
- **Implementation:** Visual and rhythmic sequences where cultural icons pulse with harmonious chimes. The senior repeats the sequence at their own pace with no time penalty.

### Module 4: Spatial Anchoring (3D Memory Palace)
- **Clinical Basis:** The *Method of Loci* leverages intact spatial memory (hippocampus and parahippocampal gyrus) to anchor misplaced daily items and core memories.
- **Implementation:** Interactive 3D home environment built with Three.js. Seniors navigate room to room, placing virtual objects (reading glasses, brass prayer bell, key ring) onto familiar surfaces (the dining table, the entryway console draped in a Gamosa).

### Module 5: Reminiscence Companion (Conversational Therapy)
- **Clinical Basis:** Non-pharmacological validation therapy. Eliciting positive long-term memories triggers dopamine release, improves communication fluency, and reduces depressive symptoms.
- **Implementation:** Real-time conversational AI persona powered by Gemini 2.5 Flash, equipped with patient family memories, local cultural vocabulary, and empathetic pacing.

---

## 6. System Architecture & Offline-First Engineering

SMARAN is built to withstand intermittent rural connectivity and regional power fluctuations:

```
+---------------------------------------------------------------------------------+
|                               CLIENT (Vite SPA)                                 |
|                                                                                 |
|  +--------------------+  +----------------------+  +-------------------------+  |
|  |   React 19 / JSX   |  | Three.js R3F Canvas  |  | Service Worker (sw.js)  |  |
|  |  Tailwind CSS v4   |  | 3D Spatial Sanctuary |  | Audio / Asset Caching   |  |
|  +---------+----------+  +----------+-----------+  +------------+------------+  |
|            |                        |                           |               |
|            v                        v                           v               |
|  +---------------------------------------------------------------------------+  |
|  |                         LOCAL STATE & STORAGE                             |  |
|  |  • LocalForage (IndexedDB for Photos, Timeline, Activities & Offline Logs)|  |
|  |  • Reminder Engine (Web Audio API Chimes + Background Interval Tickers)   |  |
|  |  • Web Speech Recognition & Native Synthesis (Offline Dialect Audio)      |  |
|  +---------------------------------------------------------------------------+  |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                            SERVER (Node.js / Express)                           |
|                                                                                 |
|  +---------------------+  +-----------------------+  +-----------------------+  |
|  | /api/chat           |  | /api/timeline/generate|  | /api/report           |  |
|  | Reminiscence Engine |  | Gemma Multimodal Vision| | Neurological Report   |  |
|  +----------+----------+  +-----------+-----------+  +-----------+-----------+  |
|             \                         |                         /               |
|              \                        |                        /                |
|               v                       v                       v                 |
|             +---------------------------------------------------+               |
|             |          @google/genai TypeScript SDK             |               |
|             |          Gemini 2.5 Flash / Gemma Vision          |               |
|             +-------------------------+-------------------------+               |
|                                       |                                         |
|                                       v                                         |
|             +---------------------------------------------------+               |
|             |      Firebase Firestore & Authentication          |               |
|             |      (Optional Cloud Backup & Caregiver Sync)     |               |
|             +---------------------------------------------------+               |
+---------------------------------------------------------------------------------+
```

---

## 7. Data Models & Schema Specifications

### `Memory` (Single Timeline Node)
```typescript
interface Memory {
  id: string;
  objectId?: string;         // Links to 3D object in Memory Palace
  image: string | null;      // Base64 or local object URL
  description: string;       // Contextual story / summary
  date: number;              // Timestamp (epoch ms)
  estimatedYear?: number;    // Extracted by Gemma (e.g. 1974)
  eraTitle?: string;         // e.g., "Courtyard Garden Days"
  keyPeople?: string[];      // ["Granddaughter Meera", "Husband Bikram"]
  reminiscenceCue?: string;  // Conversation starter
}
```

### `PrescribedQuest` (Caregiver-Configured Daily Task)
```typescript
interface PrescribedQuest {
  id: string;
  title: string;
  category: 'orientation' | 'motif' | 'sequence' | 'reminiscence' | 'ritual';
  difficulty: 'gentle' | 'moderate' | 'challenging';
  assignedTime: string;      // "08:00", "16:00", etc.
  completed: boolean;
  streakCount: number;
  icon: string;
}
```

### `CognitiveTelemetryEntry` (Longitudinal Tracking)
```typescript
interface CognitiveTelemetryEntry {
  id: string;
  timestamp: number;
  gameType: 'motif_match' | 'sequence_memory' | 'reminiscence';
  score: number;
  durationSeconds: number;
  hesitationTimeMs: number;
  accuracyRate: number;      // 0.0 - 1.0
  notes?: string;
}
```

---

## 8. API Reference

### `POST /api/chat`
Handles conversational Reminiscence Therapy with attached memory context.
- **Request Body:**
  ```json
  {
    "prompt": "I was looking at the old photo of Bihu celebrations.",
    "persona": "therapist",
    "memories": [{ "id": "m1", "description": "Family Bihu feast", "date": 1618358400000 }],
    "activities": []
  }
  ```
- **Response:**
  ```json
  {
    "text": "The joyful rhythm of the Dhol and Pepa brings so much warmth. Did you enjoy making Pitha together with your family?",
    "attachedImage": null
  }
  ```

### `POST /api/timeline/generate`
Generates a structured, chronological photographic lifeline from uploaded images.
- **Request Body:**
  ```json
  {
    "images": [
      { "id": "img1", "base64": "data:image/jpeg;base64,...", "hint": "Wedding day" },
      { "id": "img2", "base64": "data:image/jpeg;base64,...", "hint": "Tea garden visit" }
    ],
    "patientBio": {
      "birthYear": 1952,
      "hometown": "Jorhat, Assam"
    }
  }
  ```
- **Response:**
  ```json
  {
    "timeline": [
      {
        "id": "img1",
        "estimatedYear": 1975,
        "title": "Wedding in Jorhat",
        "description": "Joyous wedding ceremony adorned in Muga silk.",
        "reminiscenceCue": "Can you recall who was singing the Biyanaam wedding songs?"
      }
    ]
  }
  ```

### `POST /api/report`
Synthesizes telemetry data into a professional clinical neuropsychological report.
- **Request Body:**
  ```json
  {
    "patientName": "Grandmother Ananya",
    "patientAge": 74,
    "activities": [...],
    "conversations": [...]
  }
  ```
- **Response:**
  ```json
  {
    "report": "# 🩺 Clinical Cognitive Assessment & Dementia Progression Report\n..."
  }
  ```

---

## 9. Privacy, Data Sovereignty & Clinical Disclaimers

### Data Sovereignty & Senior Privacy
1. **Local-First Retention:** All personal family photographs, voice recordings, and conversation histories are retained on the client device via IndexedDB.
2. **Zero Commercial Data Usage:** Patient data is never used to train generalized consumer machine learning models.
3. **No Hidden Trackers:** The platform features zero advertising pixels, third-party analytics trackers, or social sharing SDKs.

### Clinical Disclaimer
> **Medical Notice:** SMARAN (FireFly AI) is an assistive digital therapy and caregiver coordination platform. It is designed to provide non-pharmacological cognitive stimulation, circadian anchoring, and reminiscence therapy. It does not provide definitive medical diagnoses and is not a substitute for formal neurological evaluation (such as MRI, PET scans, or clinical MMSE/MoCA assessments). Caregivers should always consult certified geriatric physicians regarding medical treatments and pharmacological prescriptions.

---

## 10. Local Development & Deployment Guide

### Prerequisites
- Node.js 20+
- Modern Web Browser with Web Audio and WebGL support
- Google Gemini API Key (`GEMINI_API_KEY`)

### Setup Instructions
```bash
# 1. Clone repository
git clone <repository_url>
cd smaran-firefly-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Set GEMINI_API_KEY="your-gemini-api-key"

# 4. Run development server (Vite + Express on Port 3000)
npm run dev

# 5. Build for production
npm run build
npm start
```

---
*Built with reverence and dedication for elders living with memory loss and the families who care for them.*
