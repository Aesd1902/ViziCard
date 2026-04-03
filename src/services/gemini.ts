import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("Gemini API Key is missing. OCR features will fail.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// Helper to resize image if it's too large for mobile AI processing
async function optimizeImage(base64Str: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH || height > MAX_HEIGHT) {
        if (width > height) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        } else {
          width = Math.round((width * MAX_HEIGHT) / height);
          height = MAX_HEIGHT;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Str); // Fallback to original if canvas fails
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => {
      console.warn("Failed to optimize image, using original.");
      resolve(base64Str);
    };
  });
}

export async function extractCardData(base64Image: string) {
  if (!apiKey) {
    throw new Error("Gemini API Key is not configured.");
  }

  try {
    const optimizedBase64 = await optimizeImage(base64Image);
    const base64Data = optimizedBase64.split(',')[1] || base64Image.split(',')[1];

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use stable model version
      contents: [
        {
          parts: [
            {
              text: "Extract all relevant information from this visiting/business card. Return a JSON object with fields: name, email, phone, address, website, company, dates (array of strings if any dates/events are found), and fullText (all raw text found on the card). If a specific field is not found or unclear, leave it null.",
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
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
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON response:", parseError);
      return { fullText: response.text };
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process card with AI.");
  }
}
