# 🎮 The Duolingo Rehabilitation Paradigm: Dual-Face System Specification

> **Document Type:** Functional & UX Architecture Specification  
> **Target Audience:** Product Managers, Clinical Gerontologists, Frontend & AI Engineers  
> **Status:** Approved Architecture Draft  

---

## 1. The Core Metaphor: Why "Duolingo for Dementia"?

Duolingo revolutionized language learning by taking an intimidating, high-friction cognitive challenge and breaking it down into:
- **Daily Bite-Sized Micro-Sessions (3–5 minutes)**
- **Positive Reinforcement & Loss Aversion through Streaks**
- **Adaptive Progression Curves**
- **Low Cognitive Overhead & High Visual Feedback**

However, **traditional gamification cannot be copied directly to dementia care**. Applying standard competitive mechanics (punitive countdown timers, life-heart depletion, red fail buzzers, leaderboards) causes severe emotional distress (*catastrophic reaction*), leading to agitation, withdrawal, and refusal to participate.

**SMARAN adapts the Duolingo paradigm through a Trauma-Informed, Neuro-Rehabilitative Lens:**

```
+---------------------------------------------------------------------------------------+
|                             TRADITIONAL DUOLINGO VS. SMARAN                           |
+------------------------------------+--------------------------------------------------+
| Traditional Duolingo               | SMARAN Dementia Rehabilitation Loop              |
+------------------------------------+--------------------------------------------------+
| Lose a life when you make a mistake| Infinite calm retries; wrong taps trigger gentle |
|                                    | acoustic chimes with subtle warm highlights      |
+------------------------------------+--------------------------------------------------+
| Ticking countdown timer            | Zero time limits; patient moves at their own     |
|                                    | biological pace                                  |
+------------------------------------+--------------------------------------------------+
| High-pressure testing              | Non-pharmacological Cognitive Stimulation (CST)  |
|                                    | focused on neuroplastic maintenance              |
+------------------------------------+--------------------------------------------------+
| Public competitive leaderboards    | Private family circle; praise shared with loving |
|                                    | family members                                   |
+------------------------------------+--------------------------------------------------+
| Streak breaks on missed day        | Streak Freeze / "Gentle Rest Day": streak stays  |
|                                    | intact if patient is fatigued or unwell          |
+------------------------------------+--------------------------------------------------+
```

---

## 2. The Dual-Face Architecture

The system is deliberately bifurcated into two synchronized interfaces:

```
                          ┌───────────────────────────┐
                          │   SHARED DATA LAYER       │
                          │   (LocalForage / Firebase)│
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
    ┌──────────────────────────┐                  ┌──────────────────────────┐
    │  FACE A: PATIENT MODE    │                  │  FACE B: CAREGIVER MODE  │
    │  "The Sanctuary"         │                  │  "The Command Center"    │
    ├──────────────────────────┤                  ├──────────────────────────┤
    │ • Zero-configuration     │                  │ • Daily Quest Prescriptions
    │ • Large touch targets    │                  │ • Medication & Ritual Time
    │ • 8:00 AM Morning Cue    │                  │ • Batch Photo Upload     │
    │ • Duolingo Habit Steps   │                  │ • Gemma Timeline Review  │
    │ • Spoken audio guidance  │                  │ • Telemetry & Neurologist│
    │ • One-touch SOS dialer   │                  │   Clinical Export        │
    └──────────────────────────┘                  └──────────────────────────┘
```

---

## 3. Face A: The Patient Sanctuary (Elder Ergonomics)

### 3.1 Design Principles for Dementia UX
1. **The 3-Second Rule:** The patient must understand what action to take within 3 seconds of looking at any screen.
2. **Visual Hierarchy & Zero-Clutter:** No floating menus, popover cascades, or hidden swipe drawers. Every primary action is a tactile card with high contrast (>7:1 against background).
3. **Warm Paper Aesthetic:** Instead of clinical sterile white or dark mode (which exacerbates visual floaters and cataract halos), SMARAN utilizes a warm parchment background (`#faf8f5`) reminiscent of traditional Indian homes.
4. **Multisensory Redundancy:** Every piece of visual text is accompanied by optional or automatic spoken audio in the senior's native dialect (Assamese, Hindi, Manipuri, English).

### 3.2 The Daily Rehabilitation Journey ("The Daily Path")

Just as Duolingo presents a linear stepping-stone path, SMARAN guides the senior through a soothing daily path:

```
   [STEP 1: 08:00 AM] ──▶ Morning Sanctuary Awakening (Check-in & Diya Lighting)
           │
           ▼
   [STEP 2: 10:30 AM] ──▶ Visual Motif Match (3-Pair Assamese Cultural Match)
           │
           ▼
   [STEP 3: 02:00 PM] ──▶ Memory Palace Object Check (Keys on Gamosa Table)
           │
           ▼
   [STEP 4: 04:30 PM] ──▶ Reminiscence Companion (Tea Stroll & Old Photo Story)
           │
           ▼
   [STEP 5: 06:30 PM] ──▶ Sandhya Dusk Ritual (Evening Chime & Daily Reflection)
```

#### Step 1: Morning Awakening & Circadian Anchoring
- **Trigger:** Automated 8:00 AM temple bell chime (`ghanti.mp3`) and spoken greeting: *"Suprabhat Ma. Today is a peaceful Tuesday morning."*
- **Action:** The senior taps the glowing golden Diya icon.
- **Feedback:** Golden spark animation and a 1-day increment to their streak count: *"Wonderful! You have started your day with mindfulness. 4-day streak! 🌟"*

#### Step 2: Visual Cognitive Stimulation (Motif Match)
- **Objective:** Maintain visual-spatial discrimination and short-term recognition memory.
- **Interaction:** 4 to 6 large tactile cards flipped face-up for 3 seconds, then face down. Cards reveal culturally familiar items:
  - *Jaapi* (Assamese sun hat)
  - *Kaziranga Rhino*
  - *Kopou Phool* (Foxtail orchid)
  - *Brass Prayer Bell*
- **No-Lose Mechanic:** Tapping non-matching cards results in a gentle soft woodblock tone, and cards flip back slowly without alarms or deduction of points.

#### Step 3: Spatial Method of Loci (3D Palace)
- **Objective:** Prevent common daily crises (misplacing spectacles, keys, prayer beads).
- **Interaction:** Patient enters a virtual rendering of a warm courtyard home. They verify where their keys and spectacles are kept.

#### Step 4: Reminiscence Companion Therapy
- **Objective:** Stimulate remote episodic memory and language fluency.
- **Interaction:** The companion presents a photo from the family timeline generated by Gemma. The companion asks an open-ended question:
  - *"Ma, do you remember who was sitting next to you during the Bihu feast?"*
- **Input:** Patient can speak their answer via microphone (Web Speech API) or tap suggested gentle memories.

---

## 4. Face B: The Family & Caregiver Command Center

Family members are the primary architects of the patient's rehabilitation journey. Through Face B, they configure, adapt, and supervise care without helicopter parenting.

### 4.1 Daily Quest Prescriptions
Caregivers toggle which therapy modules are active and set custom difficulty levels:

```typescript
interface CaregiverPrescription {
  patientId: string;
  dailyQuests: {
    questId: 'morning_checkin' | 'motif_match' | 'sequence_memory' | 'reminiscence_chat' | 'palace_walk';
    enabled: boolean;
    scheduledTime: string;      // e.g. "08:00"
    difficultyLevel: 1 | 2 | 3;  // 1: 4 cards, 2: 6 cards, 3: 8 cards
    promptNotes?: string;        // Notes for the AI Companion
  }[];
  snoozeIntervalMinutes: number; // Default 15 mins
  enableVoiceAnnouncements: boolean;
  preferredLanguage: 'en' | 'hi' | 'as';
}
```

### 4.2 Medical & Circadian Protocol Scheduler
- **Fixed-Time Alarms:**
  - 08:15 AM: Blood Pressure & Diabetes medications.
  - 01:30 PM: Post-lunch rest reminder.
  - 07:45 PM: Evening calming tea & night tablets.
- **Interval Hydration Reminders:** Gentle audio prompts every 90 minutes reminding the senior to drink a glass of fresh water or warm herbal tea.

### 4.3 Family Photo Uploader & Timeline Approver
1. Family members upload loose scanned prints or smartphone snapshots.
2. The **Gemma Timeline Pipeline** auto-estimates dates, tags, and generates reminiscence cues.
3. Family members review the draft timeline:
   - Edit names: e.g., AI guessed *"Young girl"*; daughter updates to *"Granddaughter Ananya at age 5"*.
   - Adjust date: e.g., AI guessed *1978*; family corrects to *1976 (Brahmaputra boat trip)*.
4. One-click publish updates the senior's Photo Album and 3D Palace instantly.

### 4.4 Cognitive Telemetry & Clinical Reporting
The portal aggregates silent, non-invasive metrics:
- **Mean Reaction Time:** Milliseconds taken to respond to cards.
- **Working Memory Retention Depth:** Sequence span (3-step vs. 5-step).
- **Verbal Fluency Index:** Vocabulary diversity in reminiscence chats.
- **Sundowning Warning:** Nighttime app openings between 1:00 AM – 5:00 AM triggering alert notifications to the family.

A single tap on **"Generate Neurologist Report"** compiles a 2-page clinical summary formatted with clinical scales (MCI vs. FAST scale staging) ready to email or print for medical appointments.

---

## 5. Security & Access Switching Mechanism

To prevent the dementia patient from getting lost in caregiver configuration screens, Face B is protected by an **Elder-Safe Gate**:

- **Biometric / PIN Access:** Simple 4-digit PIN known to the caregiver (e.g., year of birth).
- **Physical Long-Press Gesture:** 4-second hold on the discreet settings gear icon.
- **Remote Web Access:** Family members can access the Caregiver Portal from their own smartphones while the tablet remains in Patient Mode at the senior's bedside.

---

*This specification guides all sprint engineering tasks for the dual-face architecture in SMARAN.*
