
import { GoogleGenAI, Type } from "@google/genai";
import { AuditLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSecurityAnalysis = async (logs: AuditLog[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Quyidagi tizim loglarini tahlil qiling va kiberxavfsizlik bo'yicha qisqacha hisobot bering (O'zbek tilida). Shubhali harakatlarni aniqlang: ${JSON.stringify(logs)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Xavfsizlik holati bo'yicha umumiy xulosa" },
            risks: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING }
                }
              }
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["summary", "risks", "recommendations"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return null;
  }
};

export const generatePhishingScenario = async (trend: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O'zbekiston sharoiti uchun kiber-xavfsizlik test ssenariysi yarating. Trend: ${trend}. Xodimga yuboriladigan xabar matni va u aldanmasligi uchun nimalarga e'tibor berishi kerakligini tushuntiring.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            messageContent: { type: Type.STRING },
            redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
            channel: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Scenario Error:", error);
    return null;
  }
};
