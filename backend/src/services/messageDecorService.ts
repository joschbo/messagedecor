import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// Initialize the ChatOpenAI model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "",
  modelName: "gpt-4o-mini",
});

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", "You are an assistant specialized in enhancing WhatsApp messages for broadcast messages. Your task is to: 1. Insert bold headlines where it improves readability. 2. Highlight important words in bold where it makes sense in the context. 3. Insert paragraphs to make the message easier to read and follow. 4. Add relevant emojis where appropriate, to add emphasis or tone without changing the original content. 5. Do not alter the original text of the message; only adjust formatting for better clarity and impact."],
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

  return response.content;
};
