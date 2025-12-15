import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateEmailReply = async (
  previousEmails: string,
  customerName: string,
  context: string
): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please provide a valid API key to use the AI drafting feature.";
  }

  try {
    const prompt = `
      You are a helpful customer service agent named Emma at HOB FURNITURE.
      Draft a polite, professional, and concise email reply to the customer, ${customerName}.
      
      Context of the order:
      ${context}

      Previous conversation history:
      ${previousEmails}

      The customer is asking a question. Please answer it inventively but professionally (assume the fabric IS stain resistant for this demo).
      Do not include the subject line, just the body of the email.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "I'm sorry, I couldn't generate a draft at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating draft. Please try again later.";
  }
};