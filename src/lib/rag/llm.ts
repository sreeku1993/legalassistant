import dotenv from "dotenv";

dotenv.config({
  path: ".env.local"
});

import { ChatGoogleGenerativeAI }
from "@langchain/google-genai";

export const llm =
  new ChatGoogleGenerativeAI({

    apiKey:
      process.env.GOOGLE_API_KEY,

    model:
      "gemini-2.5-flash",

    temperature: 0.2
});