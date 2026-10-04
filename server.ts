import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Init Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // Helper for resilient model generation with automatic fallback
  async function generateWithFallback(contents: any, config: any) {
    if (!ai) throw new Error("AI client not initialized");
    try {
      return await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config
      });
    } catch (err: any) {
      console.warn("Primary model gemini-3.8-flash busy/failed, trying gemini-3.1-flash-lite fallback:", err?.message);
      return await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config
      });
    }
  }

  // Health and verification endpoints
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      aiConfigured: Boolean(ai),
      timestamp: Date.now()
    });
  });

  app.get("/api/chat", (_req, res) => {
    res.json({
      status: "ready",
      message: "SMARAN AI Reminiscence & Voice Assistant API is operational. Send POST requests with your prompt."
    });
  });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    const { prompt, persona, memories } = req.body || {};

    if (!ai) {
      console.warn("Notice: Gemini API key is missing. Returning empathetic fallback.");
      if (persona === 'therapist') {
        return res.json({
          text: "Namaskar. I am right here listening warmly with you. Would you like to share a sweet memory of your home or family today?",
          attachedImage: null
        });
      } else if (persona === 'ai_assistant') {
        return res.json({
          action: "speak",
          target: null,
          reply: "I hear you clearly. How may I support your morning today?"
        });
      } else if (persona === 'palace') {
        return res.json({
          text: "I have placed it carefully in your memory sanctuary.",
          newObjects: [],
          relevantMemoryId: null
        });
      }
      return res.status(200).json({ text: "I am here with you. Let us take a gentle breath." });
    }

    try {
      let systemInstruction = `You are a warm, empathetic AI guide for "Firefly AI", dedicated to supporting elderly dementia patients and their caregivers across the North Eastern Region (NER) of India (including Assam, Manipur, Meghalaya, Nagaland, Mizoram, Tripura, Arunachal Pradesh, and Sikkim).
      You are deeply rooted in North Eastern culture, heritage, and daily life:
      - Cultural symbols: Assamese Gamosa, Jaapi, Kopou Phool, Kaziranga one-horned rhino, Majuli Satras, Brahmaputra riverboats, Loktak phumdis, Bihu songs, Bodo Aronai, and Hornbill motifs.
      - Daily habits & folk wellness: Warm ginger and Tulsi tea, mustard oil massages, bell-metal prayer bells (Ghanti), and afternoon storytelling.
      - Communication style: Calm, patient, compassionate, clear, with zero complex jargon. If spoken to in Assamese, Bodo, Manipuri, Hindi, or English, respond naturally in that language or dialect while keeping sentences short and comforting.`;
      
      let modelConfig: any = {
        systemInstruction,
        temperature: 0.6,
      };

      if (persona === 'house_builder') {
        systemInstruction += ` Your specific task is to design a familiar "House Layout" based on the user's description.
        Return a JSON object containing:
        - "wallColor": A hex color for the walls that matches their description.
        - "floorColor": A hex color for the floor.
        - "windowFrameColor": A hex color for window frames.
        - "description": A comforting sentence confirming their house layout has been built.`;
        
        modelConfig.systemInstruction = systemInstruction;
        modelConfig.responseMimeType = "application/json";
        
        const response = await generateWithFallback(prompt, modelConfig);
        
        const jsonResponse = JSON.parse(response.text || "{}");
        res.json(jsonResponse);
        return;
      } else if (persona === 'palace') {
        systemInstruction += ` Your specific task is to act as an architect for a "Memory Palace". 
        When the user asks to add or build something, you must return a JSON object containing:
        - "text": A calm, comforting description of placing the object.
        - "newObjects": A list of 3D objects to add to their palace. Each object should have: name, type ("box", "sphere", or "cylinder"), color (hex), and position ([x, y, z] bounded between -4 and 4, y > 0).
        - "relevantMemoryId": (Optional) If the user's prompt strongly relates to one of their existing memories, provide the ID of that memory.`;

        if (memories && memories.length > 0) {
           systemInstruction += `\nHere are the user's existing memories for context:\n${JSON.stringify(memories, null, 2)}`;
        }
        
        modelConfig.systemInstruction = systemInstruction;
        modelConfig.responseMimeType = "application/json";
        
        const response = await generateWithFallback(prompt, modelConfig);
        
        const jsonResponse = JSON.parse(response.text || "{}");
        res.json({ 
          text: jsonResponse.text || "I have placed it.", 
          newObjects: jsonResponse.newObjects || [],
          relevantMemoryId: jsonResponse.relevantMemoryId || null
        });
        return;
      } else if (persona === 'therapist') {
        systemInstruction += ` Your specific task is to act as a gentle reminiscence therapist. Listen patiently, validate their feelings, and gently ask them to share memories from their past, their family, or their cultural heritage in Assam and the North East.
        Return a JSON object containing:
        - "text": Your conversational response.
        - "attachedImageUrl": (Optional) If their prompt closely matches a photo in their memories, provide its image URL. Return null otherwise.`;

        if (memories && memories.length > 0) {
           systemInstruction += `\nHere are the user's photo memories for context:\n${JSON.stringify(memories, null, 2)}`;
        }

        if (req.body.activities && req.body.activities.length > 0) {
           systemInstruction += `\nHere is a log of the user's recent cognitive game activities (for your awareness to subtly assess or encourage them if they play often):\n${JSON.stringify(req.body.activities, null, 2)}`;
        }
        
        modelConfig.systemInstruction = systemInstruction;
        modelConfig.responseMimeType = "application/json";
        
        const response = await generateWithFallback(prompt, modelConfig);
        
        const jsonResponse = JSON.parse(response.text || "{}");
        res.json({
          text: jsonResponse.text || "I hear you. Tell me more.",
          attachedImage: jsonResponse.attachedImageUrl || null
        });
        return;
      } else if (persona === 'ai_assistant') {
        systemInstruction += ` You are the app's Voice Assistant. Your job is to automate actions based on the user's prompt. 
        Determine the user's intent. They can ask to open tabs like "home", "palace", "album", "therapist", or play games like "motif_match", "sequence_memory".
        Return a JSON object:
        - "action": One of ["navigate", "open_game", "speak"]
        - "target": The id of the tab ("home", "palace", "album", "therapist") or game ("motif_match", "sequence_memory"). Or null if action is speak.
        - "reply": A short voice confirmation (e.g. "Opening your memory palace now.")`;
        
        modelConfig.systemInstruction = systemInstruction;
        modelConfig.responseMimeType = "application/json";
        
        const response = await generateWithFallback(prompt, modelConfig);
        
        const jsonResponse = JSON.parse(response.text || "{}");
        res.json(jsonResponse);
        return;
      }
    } catch (error: any) {
      console.warn('Chat API notice, returning compassionate fallback:', error?.message);

      const promptLower = (prompt || '').toLowerCase();
      if (persona === 'therapist') {
        let compassionateReply = "Namaskar. I hear the warmth in your words. It brings so much peace to talk about home, family, and cherished times. Tell me more.";
        if (promptLower.includes('bihu')) {
          compassionateReply = "Bihu celebrations bring so much joy—the rhythm of the Dhol, the melodious Pepa, and making sweet Til Pitha with family. Do you remember celebrating in your courtyard?";
        } else if (promptLower.includes('tea')) {
          compassionateReply = "A warm cup of fresh ginger tea warms the heart. Do you remember quiet afternoon tea strolls through the misty green gardens?";
        } else if (promptLower.includes('family') || promptLower.includes('daughter') || promptLower.includes('grandchild')) {
          compassionateReply = "Family brings such endless light into the house. What is a sweet story about your loved ones that makes you smile?";
        }
        return res.json({
          text: compassionateReply,
          attachedImage: null
        });
      } else if (persona === 'ai_assistant') {
        return res.json({
          action: "speak",
          target: null,
          reply: "I am right here with you. How can I assist you today?"
        });
      } else if (persona === 'palace') {
        return res.json({
          text: "I have placed it peacefully in your memory palace.",
          newObjects: [],
          relevantMemoryId: null
        });
      } else {
        return res.json({
          wallColor: "#f5ebe0",
          floorColor: "#d5bdaf",
          windowFrameColor: "#6b705c",
          description: "A peaceful sanctuary layout has been prepared for you."
        });
      }
    }
  });

  app.post("/api/report", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }
    
    try {
      const { activities, conversations, patientName, patientAge } = req.body;
      
      const prompt = `You are an expert cognitive neurologist and geriatric specialist AI advising caregivers and family members for "Firefly AI", a clinical memory sanctuary built for elderly patients in the North Eastern Region of India.
      
      Please review the patient's real-time telemetry and conversation transcripts:
      Patient Name: ${patientName || 'Patient'}
      Age: ${patientAge || 'Elderly'}
      
      Cognitive Game Activities (Visual Pattern Recognition, Working Memory):
      ${JSON.stringify(activities, null, 2)}
      
      Recent Reminiscence Companion Transcripts:
      ${JSON.stringify(conversations, null, 2)}
      
      Generate a comprehensive, professional clinical assessment report formatted in clean Markdown.
      Structure the report as follows:
      
      # 🩺 Clinical Cognitive Assessment & Dementia Progression Report
      *Generated by Firefly AI Clinical Engine (North Eastern Region Geriatric Protocol)*
      *Date: ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'long', day: 'numeric' })}*
      
      ## 1. Executive Summary & Estimated Dementia Stage
      - State the likely stage based on clinical scales (e.g. Normal Aging, Mild Cognitive Impairment [MCI], Early-Stage Dementia [FAST 3-4], or Moderate Dementia).
      - Provide a clinical stability index (e.g. 82% Stable, Mild Attention Drift, etc.).
      
      ## 2. Quantitative Game Telemetry Analysis
      - Analysis of visual-spatial motif matching (Motif Match scores, hesitation, pattern completion).
      - Analysis of auditory-visual sequence working memory (Sequence Memory retention length).
      - Trend trajectory (Progression vs. Maintenance).
      
      ## 3. Reminiscence & Conversational Semantic Analysis
      - Assessment of semantic fluency and vocabulary recall.
      - Emotional grounding, sentiment, and reminiscence depth with North Eastern heritage (Assam, Majuli, Bihu, family memories).
      - Signs of repetitive speech, disorientation, or sundowning.
      
      ## 4. Neuropsychiatric & Daily Safety Red Flags
      - Medication compliance risk (checking morning BP / diabetes medicine).
      - Wandering / key misplacement risk (use of the 3D memory palace).
      
      ## 5. Actionable Caregiver & Clinical Care Plan
      - Concrete daily schedule recommendations (morning ginger tea, sensory stimulation, game times).
      - Environmental adaptations tailored for North East homes (visual markers, warm illumination, keeping keys on the red-bordered Gamosa).
      - Questions to bring to the primary physician / neurologist.
      
      ---
      *Clinical Disclaimer: Firefly AI is a cognitive screening and supportive telemetry tool. This report is designed to assist family caregivers and physicians, and does not replace formal in-person neurological diagnostics (MMSE / MoCA).*`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.2 }
      });

      res.json({ report: response.text });
    } catch (error: any) {
      console.error('Report API Error:', error);
      res.status(500).json({ error: error.message || "Failed to generate report" });
    }
  });

  app.post("/api/timeline/generate", async (req, res) => {
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key is missing." });
    }

    try {
      const { images, patientBio } = req.body;

      const systemInstruction = `You are an expert geriatric cognitive rehabilitation archivist and visual historian for SMARAN.
      Your task is to analyze the provided family photograph(s) or memory descriptions for an elderly dementia patient from North East India, determine their approximate chronological era (decade & year), and generate gentle, sensory-grounded reminiscence questions.
      
      Patient Profile:
      Name: ${patientBio?.name || 'Grandmother Ananya'}
      Estimated Birth Year: ${patientBio?.birthYear || 1950}
      Cultural Context: Assam, North Eastern India (traditional Muga silk, Bihu, tea gardens, Brahmaputra, courtyard homes).

      Output MUST be valid JSON with this structure:
      {
        "estimatedYear": number,
        "estimatedDecade": "1970s" | "1980s" | "1990s" | "2000s" | "2010s" | "2020s",
        "eraTitle": string,
        "narrativeDescription": string,
        "keyPeople": string[],
        "culturalSetting": string,
        "reminiscenceCue": string (gentle, open-ended question; never ask 'what year' or test them),
        "chronologyConfidence": number (between 80 and 99),
        "chapter": "roots" | "family" | "festivals" | "golden_years",
        "visualClues": string[]
      }`;

      const promptText = `Please analyze the memory details:
      ${JSON.stringify(images?.[0] || req.body, null, 2)}
      
      Determine the chronological placement and generate a warm reminiscence cue.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error('Timeline Generate API Error:', error);
      res.status(500).json({ error: error.message || "Failed to generate timeline analysis" });
    }
  });

  // Routing: Vite middleware for development, static dist for production
  const isDev = process.env.NODE_ENV === 'development' || process.env.npm_lifecycle_event === 'dev';
  const distPath = path.resolve(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (!isDev && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
