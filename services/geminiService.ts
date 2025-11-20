import { GoogleGenAI, Type } from "@google/genai";
import { LEVELS } from "../constants";
import { MathProblem } from "../types";

// Ensure API KEY is available
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const geminiService = {
  /**
   * Generates a math problem based on the user's current level.
   */
  generateProblem: async (level: number): Promise<MathProblem> => {
    if (!API_KEY) {
        // Fallback for demo/dev if no key provided (though instruction says hard req)
        console.error("API Key missing");
        throw new Error("API Key missing");
    }

    const topic = LEVELS[level as keyof typeof LEVELS] || "General Math";
    
    const prompt = `
      Generate a unique math problem for a student at Level ${level}: ${topic}.
      The problem should be challenging but solvable mentally or with scratch paper.
      Provide 4 multiple choice options.
      
      Return strictly JSON.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "The math question text" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Array of 4 possible answers" 
              },
              correctOptionIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer" },
              topic: { type: Type.STRING, description: "Short math topic name" },
              difficultyRating: { type: Type.INTEGER, description: "1-10 difficulty" }
            },
            required: ["question", "options", "correctOptionIndex", "topic", "difficultyRating"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text) as MathProblem;
      }
      throw new Error("Empty response from AI");
    } catch (error) {
      console.error("Gemini generation error:", error);
      // Fallback problem to prevent app crash
      return {
        question: `Calculate ${level} * 12 + 5`,
        options: [`${level * 12 + 4}`, `${level * 12 + 5}`, `${level * 12 + 6}`, `${level * 12 + 10}`],
        correctOptionIndex: 1,
        topic: "Fallback Arithmetic",
        difficultyRating: 1
      };
    }
  },

  /**
   * Explains why an answer was incorrect or praises a correct one with context.
   */
  explainAnswer: async (problem: MathProblem, chosenOption: string, isCorrect: boolean): Promise<string> => {
    if (!API_KEY) return "Great job!";

    const prompt = `
      The user was asked: "${problem.question}".
      The correct answer is "${problem.options[problem.correctOptionIndex]}".
      The user chose: "${chosenOption}".
      Is Correct: ${isCorrect}.
      
      Provide a very short (1 sentence) feedback message. 
      If wrong, explain the error simply.
      If right, give a fun math fact related to the number or topic.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text || (isCorrect ? "Correct!" : "Incorrect, try again!");
    } catch (e) {
        return isCorrect ? "Correct!" : "Incorrect.";
    }
  }
};