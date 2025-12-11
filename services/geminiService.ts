import { GoogleGenAI } from "@google/genai";
import { Account } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not defined in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeAccountHealth = async (account: Account): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Error: API Key is missing. Please configure process.env.API_KEY.";
  }

  const prompt = `
    You are a social media account health expert. Analyze the following account data and provide a brief health assessment (2-3 sentences) and one actionable recommendation.
    
    Data:
    - Status: ${account.status}
    - Friend Count: ${account.friendCount}
    - Created Date: ${account.createdDate}
    - Last Updated: ${account.lastUpdated}
    - Has Friend Suggestions: ${account.hasFriendSuggestions ? 'Yes' : 'No'}
    - Notes: ${account.notes || 'None'}
    
    Keep the tone professional and concise.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate analysis. Please try again later.";
  }
};
