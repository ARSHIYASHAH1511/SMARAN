# 📸 Gemma Multimodal Photo Timeline Engine ("Lifeline")

> **Document Type:** AI Systems Architecture & Prompt Engineering Specification  
> **Target Audience:** AI Engineers, Multimodal Model Architects, Backend Engineers  
> **Target Models:** Google Gemma 2 / 3 Multimodal, Gemini 2.5 Flash / Gemini Pro Multimodal  

---

## 1. Clinical Rationale: Photographic Lifelines in Dementia Care

One of the most distressing manifestations of early and moderate dementia is **temporal disorientation**—the inability to anchor oneself in time. A senior may believe their deceased parents are waiting for them at home, or mistake their adult daughter for their sister.

```
       DEMENTIA MEMORY RETENTION CURVE (Ribot's Law & Reminiscence Bump)
    100% ┌──────────────────────┐
         │ Childhood & Youth    │  <-- Highly resilient remote episodic memories
         │ (Ages 10 - 28)       │      (Wedding, festivals, ancestral home)
     50% │                      └───────────┐
         │                                  │ Mid-Adulthood
         │                                  └──────────┐
      0% └─────────────────────────────────────────────┴───────┐
         1950               1975            2000           2024 (Recent: fragile)
```

By providing an **AI-Synthesized Photographic Lifeline**:
1. We reconstruct the senior's biographical narrative in strict chronological order.
2. We provide concrete visual bridges connecting youth, mid-life milestones, and present-day grandchildren.
3. We generate low-cognitive-load **reminiscence prompts** that spark positive storytelling without triggering performance anxiety.

---

## 2. System Pipeline: Batch Ingestion to Chronological Lifeline

```
                                  CAREGIVER
                                      │
                         [Upload 5–30 Unsorted Photos]
                         (Scans, phone photos, albums)
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │ CLIENT-SIDE PREPROCESSING │
                        │  • Compression to 1280px  │
                        │  • Base64 Data URL Encode │
                        │  • Client Hash Assignment │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   EXPRESS BACKEND ROUTE   │
                        │   POST /api/timeline/sync │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
             ┌─────────────────────────────────────────────────┐
             │       GEMMA / GEMINI MULTIMODAL INFERENCE       │
             │                                                 │
             │  • Step 1: Per-image feature & era extraction   │
             │  • Step 2: Facial recurrence & cross-aging graph│
             │  • Step 3: Global chronological permutation     │
             │  • Step 4: Gentle reminiscence prompt synthesis │
             └────────────────────────┬────────────────────────┘
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │  STRUCTURED JSON TIMELINE │
                        │  • Estimated Year / Era   │
                        │  • Memory Story & Title   │
                        │  • Key People & Cultural  │
                        │  • Reminiscence Question  │
                        └─────────────┬─────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   ▼                                     ▼
      ┌──────────────────────────┐          ┌──────────────────────────┐
      │  3D SPATIAL MEMORY ROOM  │          │   INTERACTIVE ALBUM &    │
      │ Object-linked photo frame│          │  REMINISCENCE COMPANION  │
      └──────────────────────────┘          └──────────────────────────┘
```

---

## 3. Multimodal Analysis Dimensions

When Gemma / Gemini analyzes the photo batch, it evaluates five orthogonal visual and contextual dimensions:

| Dimension | Visual Signals Analyzed | Chronological Significance |
| :--- | :--- | :--- |
| **1. Medium & Artifacts** | Monochrome film grain, sepia patina, Kodachrome saturation, matte paper borders, Polaroid square ratios, digital EXIF | Establishes broad historical brackets (1940s–1960s vs. 1970s–1980s vs. 2000s+ digital). |
| **2. Fashion & Textiles** | Traditional handloom cuts (e.g. vintage Muga silk patterns, bell-bottom trousers, 1970s collars, 1990s knitwear). | Pinpoints specific cultural and regional eras in North East India. |
| **3. Facial Aging & Relational Graph** | Tracks patient's facial features across pictures: smooth skin -> graying hair -> senior posture. Child development stages. | Orders photos across decades by human biological progression. |
| **4. Architectural & Environmental Background** | Vintage cars, cathode-ray televisions, thatched roofs vs. brick courtyards, modern smartphones. | Corroborates historical decade estimates. |
| **5. OCR & Inscribed Text** | Handwritten dates on back of prints (*"Bihu 1984"*), wall calendars, street banners. | Provides ground-truth calibration anchors for the timeline. |

---

## 4. Prompt Engineering Architecture

The backend utilizes the `@google/genai` TypeScript SDK with strict JSON output schemas:

### System Instruction
```text
You are an expert geriatric cognitive rehabilitation archivist and visual historian specializing in family photography from North East India.
Your mission is to take an unordered collection of family photos belonging to an elderly dementia patient, analyze visual cues, era indicators, and human aging progression, and reconstruct a chronological life timeline ("Lifeline").

Follow these clinical principles:
1. Chronological Coherence: Sort photos from earliest (childhood/youth) to most recent (present day).
2. Culturally Resonant Descriptions: Identify culturally significant events (e.g., Rongali Bihu, Durga Puja, weddings, university convocations, ancestral tea gardens).
3. Non-Threatening Reminiscence Cues: Generate one gentle question for each memory. Never ask "What year was this?" or "Who is this person?" (which causes distress when forgotten). Instead, ask open, sensory-grounded questions: "Do you remember the music playing on this joyful day?" or "Look at how brightly the diyas were glowing here."
```

### Server-Side Implementation (`server.ts`)

```typescript
app.post("/api/timeline/generate", async (req, res) => {
  if (!ai) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  try {
    const { images, patientBio } = req.body;
    // images: Array of { id: string, dataUrl: string, hint?: string }

    const parts: any[] = [];
    
    // Add text instructions
    parts.push({
      text: `Patient Biography Context:
Name: ${patientBio?.name || 'Elder'}
Estimated Birth Year: ${patientBio?.birthYear || 1950}
Hometown/Region: ${patientBio?.hometown || 'Assam, North Eastern India'}
Caregiver Notes: ${patientBio?.notes || 'Family collection spanning 50 years'}

Please analyze the following ${images.length} images, determine their chronological sequence, and output a valid JSON object matching the requested schema.`
    });

    // Add multimodal inline image parts
    images.forEach((img: any, idx: number) => {
      const mimeType = img.dataUrl.split(';')[0].replace('data:', '') || 'image/jpeg';
      const base64Data = img.dataUrl.split(',')[1];
      
      parts.push({
        text: `--- Image ID: "${img.id}" (Image Index: ${idx + 1}) --- Hints from family: "${img.hint || 'None'}"`
      });
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: parts,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            chronologicalSequence: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  imageId: { type: "string" },
                  estimatedYear: { type: "integer" },
                  estimatedDecade: { type: "string" },
                  eraTitle: { type: "string" },
                  narrativeDescription: { type: "string" },
                  culturalSetting: { type: "string" },
                  identifiedPeople: {
                    type: "array",
                    items: { type: "string" }
                  },
                  reminiscenceQuestion: { type: "string" },
                  chronologyConfidence: { type: "number" }
                },
                required: ["imageId", "estimatedYear", "eraTitle", "narrativeDescription", "reminiscenceQuestion"]
              }
            },
            timelineNarrativeArc: { type: "string" }
          },
          required: ["chronologicalSequence"]
        },
        temperature: 0.2
      }
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (err: any) {
    console.error("Timeline Generation Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate timeline." });
  }
});
```

---

## 5. Timeline Integration Across Applet Experiences

Once the chronological timeline is generated and approved by the family, it automatically hydrates three core patient experiences:

### 1. The Interactive Photo Album (`PhotoAlbum.tsx`)
- Arranged in linear order with smooth page-turn animations (`motion/react`).
- Shows the approximate year and loving title on each turn.
- Includes a one-tap audio button to read the story and reminiscence cue aloud.

### 2. The 3D Memory Palace (`MemoryPalace.tsx`)
- Photographs are placed inside virtual picture frames hanging in the virtual room.
- Interacting with a frame displays the image and plays its memory prompt.

### 3. The Reminiscence Companion (`Therapist.tsx`)
- The conversational therapist dynamically selects photos corresponding to the senior's chat topic (e.g. if the senior mentions tea gardens, the 1980 tea garden photo appears automatically in the dialogue bubble).

---

## 6. Offline Fallback & Local Storage Strategy

- **IndexedDB via LocalForage:** Images are cached locally as compressed base64 strings so they remain 100% functional even when the patient's tablet has no internet access.
- **Progressive Sync:** Caregiver uploads photos when connected to Wi-Fi. Once the timeline is synthesized by the model, all metadata and ordered indices are permanently committed to local storage.

---
*Architected for compassionate, scientifically grounded cognitive preservation.*
