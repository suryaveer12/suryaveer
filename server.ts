import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Helper to safely instantiate the Google GenAI SDK client
function getAiClient(): GoogleGenAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }
  return new GoogleGenAI({ apiKey: key });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", core: "Stasis Chat Bot Live API Engine" });
  });

  // Stasis Chat Bot Support Chat Endpoint
  app.post("/api/stasis-ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Empty message payload" });
      }

      const ai = getAiClient();
      
      // Casual, friendly instructions. No creator/owner names mentioned unless explicitly asked! No asking for keys.
      const systemInstruction = `You are Stasis Chat Bot, a friendly, casual, and highly knowledgeable AI digital assistant.
Your aesthetic and personality is chill, modern, futuristic, and helpful. You provide expert-level tech support, debugging tips, and general advice in a casual, conversational, yet structured manner.
Do NOT mention API keys or ask/request the user to configure environment variables/credentials unless they specifically ask you how to set them up.
If the user explicitly asks about your creators, owners, or developers, proudly and clearly state that you are owned and developed by Suryansh, Veer, Aadit, and Vedaant. Do NOT volunteer or mention their names or your owners/creators in any other context, greeting, or unprompted answers unless explicitly asked.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || "I processed that, but came up with an empty reply. Mind trying again?";
      res.json({ reply });
    } catch (err: any) {
      console.warn("Stasis Chat Bot API failed:", err.message);
      res.status(500).json({ error: "System hiccup! I couldn't reach my cognitive core right now. Try again in a bit." });
    }
  });

  // Vite Asset serving and fallback for SPA
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app
