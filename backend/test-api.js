import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-pro"
    });

    const result = await model.generateContent(
      "Hello Gemini, respond with a short greeting."
    );

    const response = await result.response;

    console.log("✅ Gemini Response:");
    console.log(response.text());

  } catch (error) {
    console.error("❌ Gemini Error:");
    console.error(error);
  }
}

testGemini();