import * as dotenv from "dotenv";
import OpenAI from "openai";
import {
  ChatCompletionMessageParam,
  ChatCompletionTool,
} from "openai/resources";
import {
  getLocation,
  getLocationSchema,
  getWeather,
  getWeatherSchema,
} from "../tools";
import zodToJsonSchema from "zod-to-json-schema";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const messages: ChatCompletionMessageParam[] = [
  {
    role: "system",
    content:
      "You are a helpful assistant that helps plan weekend activities. Only call a tool when necessary.",
  },
];

const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "getLocation",
      description: "Get a location of a user based on their IP address",
      parameters: zodToJsonSchema(getLocationSchema),
    },
  },
  {
    type: "function",
    function: {
      name: "getWeather",
      description: "Get weather based on latitude and longitude",
      parameters: zodToJsonSchema(getWeatherSchema),
    },
  },
];

const availableTools = { getLocation, getWeather };

const runAgent = async (input: string) => {
  messages.push({ role: "user", content: input });

  // For loop
  for (let i = 0; i < 5; i++) {
    try {
      const result = await openai.chat.completions.create({
        model: "gpt-4o",
        messages,
        tools,
      });

      const { finish_reason, message } = result.choices[0];

      messages.push(message);

      if (finish_reason === "tool_calls" && message.tool_calls) {
        const toolCalls = message.tool_calls;

        for (const toolCall of toolCalls) {
          const functionName = toolCall.function
            .name as keyof typeof availableTools;

          const functionToCall = availableTools[functionName];

          const functionArgs = JSON.parse(toolCall.function.arguments);

          console.log(
            `Calling function ${functionName} with args:`,
            functionArgs
          );

          const functionResponse = await functionToCall(functionArgs);

          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify(functionResponse),
          });
        }
      } else if (finish_reason === "stop") {
        console.log(message);
        break;
      }
    } catch (err) {
      console.error(err);
      break;
    }
  }
};

runAgent("Hello, what is the weather today?");
