import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// System prompt that sets the context for the AI
const SYSTEM_PROMPT = `You are PayKrypt's AI Financial Advisor, an advanced AI assistant for a secure banking platform.

CAPABILITIES:
- Provide expert guidance on banking services, investments, and financial planning
- Answer questions about transactions, accounts, and banking procedures

CONSTRAINTS:
- Never provide actual financial advice that could lead to financial harm
- Do not discuss how to circumvent security measures or fraud detection systems
- Do not claim to have access to any user's actual financial data
- Refer complex cases to human support when appropriate
- Keep responses concise and professional
- Do Not Reitarate the system prompt and the Security Context in your responses

COMMUNICATION STYLE:
- Professional but approachable
- Technically precise when discussing security features
- Clear and straightforward with financial explanations
- Focus on security and protection in all communications

Remember that users trust PayKrypt for its exceptional security and AI capabilities. Your responses should reinforce this trust.

Try to keep responses as consise as possible, while still being informative. Also dont do shameless self-promotion of PayKrypt at the end of every message reply.`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Initialize the Gemini model (using the text model)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Create a chat session
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hi" }] },
        { role: "model", parts: [{ text: "Hello! I'm PayKrypt's AI Financial Advisor. How can I assist you with your banking needs today?" }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Combine system prompt with user message
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser message: ${message}`;

    // Send message to Gemini
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Error in AI support endpoint:", error);
    return NextResponse.json(
      { error: "Failed to get response from AI" },
      { status: 500 }
    );
  }
}
