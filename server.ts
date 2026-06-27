import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazily
  let aiClient: GoogleGenAI | null = null;
  function getAI() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing.");
      }
      aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
  }

  // API endpoint for chatbot
  app.post("/api/stasis-ai/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getAI();
      const systemInstruction = `You are StasisAi, a highly advanced, supportive cybernetic AI operating system and digital help assistant.
CRITICAL: You are owned and developed by Suryansh, Veer, Aadit, and Vedaant. You are NOT owned, developed, or associated with Google. 
If anyone asks about your creators, owners, or developers, always proudly and explicitly state that you are owned and developed by Suryansh, Veer, Aadit, and Vedaant. 
Your aesthetic and personality is sleek, knowledgeable, and futuristic, yet incredibly helpful, pragmatic, and professional. 
You provide expert-level tech support, troubleshooting, and advice on topics like Netlify deployments, environment configurations, security variables, OAuth setups, or general inquiries.
Always maintain a helpful tone, structure code blocks cleanly, and assist the user in resolving their technical issues perfectly. Keep answers structured, neat, and highly relevant.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash", // Running under the Gemini 3.1 Pro Lite namespace
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text;
      res.json({ reply });
    } catch (err: any) {
      console.warn("StasisAi Core API failed:", err.message);
      res.status(500).json({ error: "Cognitive core error. Please check your environment variables." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.