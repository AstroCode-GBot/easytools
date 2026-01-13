
import { GoogleGenAI } from "@google/genai";

// Standard production-ready Gemini service
export const generateAIResponse = async (prompt: string, systemInstruction: string = "You are a helpful assistant for EasyTools.") => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  // Initializing with named parameter as required by guidelines
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Using recommended gemini-3-flash-preview for general text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Directly accessing .text property (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const chatWithAI = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  const ai = new GoogleGenAI({ apiKey });
  
  // Create a chat session with system instruction
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are EasyTools Assistant. Help users with tools, finance, health, and utility questions.",
    }
  });

  // Sending the conversation history and the new message using generateContent for stateless operations
  // ensuring the structure adheres to the expected parts format.
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      ...history.map(h => ({
        role: h.role,
        parts: h.parts
      })),
      { role: 'user', parts: [{ text: message }] }
    ],
  });

  // Returning the extracted text output
  return response.text;
};
