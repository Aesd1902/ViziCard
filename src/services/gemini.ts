import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractCardData(base64Image: string) {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash-latest",
    contents: [
      {
        parts: [
          {
            text: "Extract all information from this visiting card. Return a JSON object with fields: name, email, phone, address, website, company, dates (array of strings), and fullText (all text found). If a field is not found, leave it null.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          email: { type: Type.STRING },
          phone: { type: Type.STRING },
          address: { type: Type.STRING },
          website: { type: Type.STRING },
          company: { type: Type.STRING },
          dates: { type: Type.ARRAY, items: { type: Type.STRING } },
          fullText: { type: Type.STRING },
        },
        required: ["fullText"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return { fullText: response.text };
  }
}
