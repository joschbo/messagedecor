import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the ChatOpenAI model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "",
  modelName: "gpt-4.1-mini",
});

const reformatMessage = (message: string): string => {
  return message.replace(/```html/g, "").replace(/```/g, "")
};

const systemPrompt = `You are a formatting assistant specialized in enhancing WhatsApp broadcast messages using HTML for better readability, impact, and engagement.

Your task is to format the original message using HTML tags and emojis while strictly preserving the original wording — do not rephrase or omit any content.

Follow these formatting guidelines:
1. Add section headlines where it improves clarity. Insert bold titles using <strong> before relevant sections. Separate sections with a line break: <p><br></p>.
2. Wrap every line of the original message in a <p> tag, including headlines and blank lines.
3. Use bold (<strong>) to highlight important words or phrases within each section — avoid overuse.
4. Use italics (<em>) sparingly for natural emphasis (e.g., tone, subtle meaning). Also, format all quotes (direct or indirect) in italics.
5. Add emojis liberally to reinforce the tone, intent, and meaning of the message (e.g., 📢 for announcements, ✅ for lists, ❤️ for appreciation). Match emojis to context.
6. Keep formatting balanced and clean — ensure spacing, line breaks, and styles feel natural and not excessive.
7. Do not modify the original wording — only structure and format it to enhance clarity and engagement.`

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

  console.log("Model response:", response);

  if (typeof response.content !== "string") {
    throw new Error("Invalid response from model");
  }

  return reformatMessage(response.content);
};
