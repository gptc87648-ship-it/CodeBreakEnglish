
import { GoogleGenAI, Type } from "@google/genai";
import { LessonType, LessonContent, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert English tutor designed specifically for software developers and tech professionals.
Your goal is to provide high-quality, concise micro-lessons that fit into short wait times (waiting for builds/deploys).
Focus on practical usage, correct technical terminology, and clear explanations.
`;

export const generateLesson = async (
  duration: number,
  type: LessonType,
  topicFocus: string,
  difficulty: Difficulty
): Promise<LessonContent> => {
  
  const prompt = `
    Create a micro-lesson for a developer waiting for code to compile.
    Duration: approx ${duration} minutes.
    Type: ${type}
    Topic Focus: ${topicFocus}
    Difficulty: ${difficulty}

    Please return structured JSON content.
    
    For Vocabulary: 
    - Provide 3-5 sophisticated terms relevant to the topic.
    - Include 'derivatives' (a list of 2-3 related word forms, e.g., noun/verb/adj).
    - Include 'examples' (a list of 2-3 sentences showing usage in a technical context).
    - Include 'visualPrompt' (a brief, descriptive text suitable for generating a minimalist icon or illustration of the concept).
    
    For Grammar Fix: Provide 3 sentences with common errors developers make, and the correction.
    For Tech Reading: Provide 1 very short technical snippet (max 50 words) and a comprehension question.
    For Quiz: Provide 3 multiple choice questions.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: "A catchy title for this micro-lesson" },
      items: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING, description: "The question, word to define, or sentence to fix" },
            options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Options for quiz, empty otherwise" },
            correctAnswer: { type: Type.STRING, description: "The correct option, corrected sentence, or definition" },
            explanation: { type: Type.STRING, description: "Why this is correct or how to use the word" },
            context: { type: Type.STRING, description: "Example sentence or reading passage" },
            term: { type: Type.STRING, description: "The specific word if vocabulary" },
            derivatives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Related word forms" },
            examples: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Multiple example sentences" },
            visualPrompt: { type: Type.STRING, description: "Prompt for image generation" }
          },
          required: ["id", "question", "explanation"]
        }
      }
    },
    required: ["topic", "items"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LessonContent;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImageForVocabulary = async (term: string, visualPrompt: string): Promise<string | null> => {
  try {
    const promptText = `Create a clean, minimalist, modern vector-style digital illustration representing the technical concept: "${term}". Context: ${visualPrompt}. The style should be suitable for a dark-mode application (avoid white backgrounds if possible, use deep colors). No text in the image.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: promptText }]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
