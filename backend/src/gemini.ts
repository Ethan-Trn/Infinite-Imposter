import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function generateWords(category: string) {
  try {
    const model = genAi.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
    const prompt = `Generate 30 words for the category "${category}". Return only a JSON array of strings, nothing else.`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const words = JSON.parse(text);
    return words
  } catch (error) {
    console.error(error);
  }
}

 export default generateWords