
import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, SearchResult, CategoryId } from "../types";

// Initialize GenAI Client
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs a grounded search using Gemini 2.5 Flash with Google Search tool.
 * tailored for a bilingual encyclopedia experience.
 */
export const searchKnowledgeBase = async (query: string, category: CategoryId): Promise<SearchResult> => {
  const ai = getAiClient();
  const currentDate = new Date().toLocaleDateString("zh-CN", { year: 'numeric', month: 'long', day: 'numeric' });
  
  let contextPrompt = "";
  switch (category) {
    case 'PRIMARY': contextPrompt = "Context: Primary School Education (小学教育). Explain simply for children."; break;
    case 'SECONDARY': contextPrompt = "Context: Middle/High School Curriculum (中学教育). Focus on exam points and academic depth."; break;
    case 'UNIVERSITY': contextPrompt = "Context: University & Research (大学与学术). Provide advanced, scholarly information."; break;
    case 'OLYMPIAD': contextPrompt = "Context: Math Olympiad & Logic (奥数与逻辑). Focus on problem-solving strategies."; break;
    case 'CS': contextPrompt = "Context: Computer Science & Programming (编程与技术). Include code snippets if relevant. Focus on latest versions."; break;
    case 'EXAMS': contextPrompt = `Context: Latest Chinese Exams & Policies (最新考试资讯). Focus on schedules, policies, and official announcements effective in ${currentDate} or upcoming.`; break;
    default: contextPrompt = "Context: General Knowledge (通识百科).";
  }

  const prompt = `
    System Context: Today is ${currentDate}.
    You are the engine for "Study Encyclopedia (学习大百科)". 
    User Query: "${query}"
    ${contextPrompt}
    
    CRITICAL INSTRUCTION FOR FRESHNESS:
    1. The user demands the LATEST, MOST UP-TO-DATE information.
    2. PRIORITIZE information from 2024 and 2025.
    3. If the search results show newer policies/versions than your internal training data, USE THE SEARCH RESULTS.
    4. Explicitly mention dates (e.g., "As of 2025...", "Effective from Jan 2025...").
    5. IGNORE obsolete data (e.g., exam schedules from 2023 or older) unless the user specifically asks for history.
    
    Standard Instructions:
    1. Provide a comprehensive, structured encyclopedia entry.
    2. Language: Use Simplified Chinese as the primary language.
    3. Bilingual Requirement: ALWAYS provide the English translation for the Main Title, Key Concepts, and Technical Terms in parentheses (e.g., 量子力学 (Quantum Mechanics)).
    4. Tone: Educational, objective, and encouraging. Suitable for ages 8+.
    5. Structure: Use headings, bullet points, and bold text for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No information found. / 未找到相关信息。";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { text, sources };
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw new Error("Failed to fetch knowledge. Please check your connection. / 获取知识失败，请检查网络。");
  }
};

/**
 * Generates a structured Mock Test (Quiz).
 */
export const generateMockTest = async (topic: string, difficulty: string = "medium"): Promise<Quiz> => {
  const ai = getAiClient();
  const currentDate = new Date().toLocaleDateString("zh-CN", { year: 'numeric', month: 'long', day: 'numeric' });

  const prompt = `
  Context: Today is ${currentDate}.
  Task: Generate a comprehensive professional practice exam (mock test) for the topic: "${topic}".
  Difficulty: ${difficulty}.
  Language: Chinese (Simplified).
  
  CRITICAL INSTRUCTION ON EXAM QUANTITY & SIMULATION:
  1. **Match Official Count**: Analyze the official format of the exam "${topic}". Generate the SAME number of Multiple Choice Questions as the real exam's standard MCQ section.
  2. **Expanded Capacity**: If the official section is large (e.g. Civil Service XingCe), generate UP TO 50 questions.
  3. **Safety Cap**: Maximum 50 questions per request to ensure data integrity. Do not generate less than 10 unless the official exam specifically has fewer.
  4. **Option Format**: Use the standard number of options for this exam (usually 4, sometimes 5).
  5. **Syllabus**: Ensure questions are based on the LATEST 2024-2025 curriculum/policy.

  Output Requirements:
  - Content must be educational and high-quality.
  - detailed explanation for every question.
  - correct answer index (0-based).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ["id", "question", "options", "correctAnswerIndex", "explanation"],
              },
            },
          },
          required: ["topic", "questions"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Quiz;
    } else {
      throw new Error("Empty response from AI");
    }
  } catch (error) {
    console.error("Gemini Quiz Generation Error:", error);
    throw new Error("Failed to generate quiz. / 生成试题失败。");
  }
};

/**
 * Solves a problem from an image with a specific persona.
 */
export const solveProblemFromImage = async (
  base64Image: string, 
  mimeType: string, 
  persona: string
): Promise<string> => {
  const ai = getAiClient();

  const personaInstruction = persona === 'child' 
    ? "Explain it like I am a 9-year-old child. Use simple analogies, encouraging language, and avoid complex jargon. Break it down into tiny steps. / 请用9岁小朋友能听懂的语言讲解。使用简单的比喻，语言要亲切鼓励，把步骤拆解得非常细致。"
    : "Provide a standard academic explanation suitable for a student. / 请给出标准的学术解答。";

  const prompt = `
    Task: Identify the problem in this image (it could be Math, Science, History, or General Knowledge) and solve it.
    Target Audience Strategy: ${personaInstruction}
    
    Structure of response:
    1. **Problem Identification**: Briefly state what the problem is.
    2. **Step-by-Step Solution**: The detailed thinking process.
    3. **Key Takeaway**: One sentence summary of the concept learned.
    
    Language: Simplified Chinese (with English Key Terms).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          { text: prompt }
        ]
      }
    });

    return response.text || "Could not analyze image. / 无法分析图片。";
  } catch (error) {
    console.error("Gemini Vision Error:", error);
    throw new Error("Failed to analyze image. / 图片分析失败。");
  }
};
