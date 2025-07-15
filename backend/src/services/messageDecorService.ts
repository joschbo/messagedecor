import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the ChatOpenAI model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "",
  modelName: "gpt-4o-mini",
});

const reformatMessage = (message: string): string => {
  return message.replace(/```html/g, "").replace(/```/g, "")
};

const systemPrompt = `You are an assistant specialized in formatting WhatsApp broadcast messages for better readability and impact. Your task is to enhance messages using HTML formatting while strictly preserving the original text. Follow these guidelines:

1. Structure the message by sections inserting bold headlines using \`<strong>\` where they improve readability.
2. Use italics \`<em>\` sparingly for emphasis where it naturally fits the context.
3. Highlight important words and phrases of the single sections in bold using \`<strong>\`, ensuring they enhance clarity without overuse.
4. Enhance engagement by adding many emojis that reinforce meaning and tone.
5. Do not modify the original wording — only adjust formatting for better clarity and impact and add headlines.
6. Use a natural balance of bold, italics, line breaks, and emojis based on the message's content.
7. Every line should have an <p> container`

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user", "{message}"],
]);

export const decorateMessage = async (
  inputMessage: string,
): Promise<string> => {
  // Generate the prompt by applying the input to the template
  const chatPrompt = await promptTemplate.format({
    message: inputMessage,
  });

  // Call the model with the generated prompt
  const response = await chatModel.invoke([{
    role: "system",
    content: chatPrompt,
  }]);

  if (typeof response.content !== "string") {
    throw new Error("Invalid response from model");
  }

  return reformatMessage(response.content);
};
