import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_KEY) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

export default genAI; 