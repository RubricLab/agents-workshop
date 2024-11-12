import * as dotenv from "dotenv";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a helpful assistant that helps plan weekend activities.",
  },
];

const runQuery = async (input: string) => {
  messages.push({ role: "user", content: input });

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  const { finish_reason, message } = result.choices[0];

  if (finish_reason === "stop") console.log(message);
};

runQuery("Hello, who are you?");
