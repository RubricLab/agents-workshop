import * as dotenv from "dotenv";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content: "You are a helpful assistant that helps plan weekend activities.",
  },
];

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get a location of a user based on their IP address",
      parameters: { type: "object", properties: {} },
    },
  },
];

const getLocation = async () => {
  const response = await fetch("https://ipapi.co/json/");

  const locationData = await response.json();

  return locationData;
};

const availableTools = { getLocation };

const runQuery = async (input: string) => {
  messages.push({ role: "user", content: input });

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    tools,
  });

  const { finish_reason, message } = result.choices[0];

  if (finish_reason === "tool_calls" && message.tool_calls) {
    const toolCalls = message.tool_calls;

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function
        .name as keyof typeof availableTools;

      const functionToCall = availableTools[functionName];

      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === "getLocation") {
        const response = await functionToCall();
        console.log(response);
      }
    }
  } else if (finish_reason === "stop") console.log(message);
};

runQuery("Hello, where am I?");
