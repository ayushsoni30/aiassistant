import User from "../models/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const parseSystemCommand = (prompt, assistantName, userName) => {
  const clean = prompt.trim().toLowerCase();

  // Open YouTube or search YouTube
  if (clean.includes("play") && clean.includes("on youtube")) {
    const query = clean.replace(/play/i, "").replace(/on youtube/i, "").trim();
    return {
      reply: `Searching and playing ${query || "music"} on YouTube.`,
      action: {
        type: "open",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        label: "YouTube",
      },
    };
  }

  if (clean.startsWith("open youtube") || clean === "youtube") {
    return {
      reply: "Opening YouTube for you.",
      action: { type: "open", url: "https://www.youtube.com", label: "YouTube" },
    };
  }

  // Google search
  if (clean.startsWith("search on google") || clean.startsWith("search google for")) {
    const query = clean.replace(/search (on )?google( for)?/i, "").trim();
    return {
      reply: `Searching Google for ${query}.`,
      action: {
        type: "open",
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        label: "Google Search",
      },
    };
  }

  if (clean.startsWith("open google") || clean === "google") {
    return {
      reply: "Opening Google.",
      action: { type: "open", url: "https://www.google.com", label: "Google" },
    };
  }

  // Popular web applications
  if (clean.includes("open instagram") || clean === "instagram") {
    return {
      reply: "Opening Instagram.",
      action: { type: "open", url: "https://www.instagram.com", label: "Instagram" },
    };
  }

  if (clean.includes("open github") || clean === "github") {
    return {
      reply: "Opening GitHub.",
      action: { type: "open", url: "https://www.github.com", label: "GitHub" },
    };
  }

  if (clean.includes("open whatsapp") || clean === "whatsapp") {
    return {
      reply: "Opening WhatsApp Web.",
      action: { type: "open", url: "https://web.whatsapp.com", label: "WhatsApp" },
    };
  }

  if (clean.includes("open spotify") || clean === "spotify") {
    return {
      reply: "Opening Spotify.",
      action: { type: "open", url: "https://open.spotify.com", label: "Spotify" },
    };
  }

  if (clean.includes("open linkedin") || clean === "linkedin") {
    return {
      reply: "Opening LinkedIn.",
      action: { type: "open", url: "https://www.linkedin.com", label: "LinkedIn" },
    };
  }

  if (clean.includes("open twitter") || clean.includes("open x") || clean === "twitter" || clean === "x") {
    return {
      reply: "Opening X.",
      action: { type: "open", url: "https://www.x.com", label: "X" },
    };
  }

  // Date and Time commands
  if (clean.includes("what time") || clean.includes("current time") || clean === "time") {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    return {
      reply: `The current time is ${timeStr}.`,
      action: { type: "info" },
    };
  }

  if (clean.includes("what date") || clean.includes("what's today's date") || clean.includes("today's date") || clean === "date") {
    const dateStr = new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return {
      reply: `Today is ${dateStr}.`,
      action: { type: "info" },
    };
  }

  // Identity queries
  if (clean.includes("who are you") || clean.includes("what is your name") || clean.includes("tell me about yourself")) {
    return {
      reply: `I am ${assistantName || "your AI Assistant"}, customized and ready to assist you with anything you need, ${userName}!`,
      action: { type: "identity" },
    };
  }

  if (clean.includes("who created you") || clean.includes("who made you")) {
    return {
      reply: `I was created by ${userName || "my developer"} as an advanced personal AI virtual assistant!`,
      action: { type: "identity" },
    };
  }

  // Stop and Exit commands
  if (
    clean.includes("stop listening") ||
    clean.includes("stop listen") ||
    clean === "stop" ||
    clean === "exit" ||
    clean === "shut down" ||
    clean === "shut up" ||
    clean === "sleep" ||
    clean === "bye" ||
    clean === "goodbye"
  ) {
    return {
      reply: "Listening mode paused. Click the microphone anytime you wish to speak again.",
      action: { type: "stop_listening" },
    };
  }

  return null;
};

// Generates fallback conversational responses if Gemini API is not yet configured or quota is reached
const generateFallbackReply = (prompt, assistantName, userName) => {
  const clean = prompt.toLowerCase();

  if (clean.includes("hello") || clean.includes("hi") || clean.includes("hey")) {
    return `Hello ${userName}! I'm ${assistantName || "your assistant"}. How can I assist you right now?`;
  }
  if (clean.includes("how are you")) {
    return `I am operating at 100% capacity and ready to assist you, ${userName}! How are you doing today?`;
  }
  if (clean.includes("thank")) {
    return `You're very welcome, ${userName}! Let me know if you need anything else.`;
  }
  if (clean.includes("joke")) {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the developer go broke? Because he used up all his cache!",
      "There are only 10 types of people in the world: those who understand binary, and those who don't.",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  return `I heard: "${prompt}". To enable full AI reasoning with general knowledge, add your GEMINI_API_KEY to the server .env file. Meanwhile, you can ask me to open YouTube, Google, GitHub, Spotify, check the time, date, and more!`;
};

export const askAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assistantName = user.assistantName || "Assistant";
    const userName = user.name || "User";

    // 1. Check for system voice commands first (instant response)
    const commandResult = parseSystemCommand(prompt, assistantName, userName);
    let replyText = "";
    let action = null;

    if (commandResult) {
      replyText = commandResult.reply;
      action = commandResult.action;
    } else if (process.env.GEMINI_API_KEY) {
      // 2. Use Google Gemini if API Key configured
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({model: "gemini-3.5-flash"});

        // Retrieve last 6 conversation turns for continuity
        const recentHistory = (user.history || []).slice(-6).map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        }));

        const systemInstruction = `You are ${assistantName}, a personal, intelligent, friendly AI assistant for ${userName}. Keep answers concise, natural, conversational, and direct (1-3 sentences when possible) since answers are spoken aloud.`;

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: `System Instruction: ${systemInstruction}` }],
            },
            {
              role: "model",
              parts: [{ text: `Understood. I am ${assistantName}, ready to assist ${userName}.` }],
            },
            ...recentHistory,
          ],
        });

        const result = await chat.sendMessage(prompt);
        replyText = result.response.text().trim();
      } catch (geminiError) {
        console.error("Gemini API error, falling back to smart engine:", geminiError.message);
        replyText = generateFallbackReply(prompt, assistantName, userName);
      }
    } else {
      // 3. Built-in smart conversational fallback
      replyText = generateFallbackReply(prompt, assistantName, userName);
    }

    // Save to user history
    user.history.push({ role: "user", content: prompt.trim() });
    user.history.push({ role: "assistant", content: replyText });

    // Keep history capped at the latest 100 entries for performance
    if (user.history.length > 100) {
      user.history = user.history.slice(-100);
    }

    await user.save();

    return res.status(200).json({
      reply: replyText,
      action,
      history: user.history,
    });
  } catch (error) {
    console.error("askAssistant error:", error);
    return res.status(500).json({ message: "Error processing assistant response" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("history assistantName name");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user.history || []);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving history" });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.history = [];
    await user.save();
    return res.status(200).json({ message: "History cleared successfully", history: [] });
  } catch (error) {
    return res.status(500).json({ message: "Error clearing history" });
  }
};
