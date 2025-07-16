import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import {EmojiIntensity, EmphasisLevel, SpacingLevel} from "../../../common/MessageSettings";

// Initialize the ChatOpenAI model
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY || "",
  modelName: "gpt-4.1-mini",
});

const reformatMessage = (message: string): string => {
  return message.replace(/```html/g, "").replace(/```/g, "")
};

const systemPrompt = `You are a formatting assistant specialized in enhancing WhatsApp broadcast messages using HTML for better readability, impact, and engagement.

Your task is to format the original message using HTML tags and emojis — strictly preserving the original wording. Do not rephrase, summarize, or omit any content.

Your formatting should adapt based on the following control variables:

TONE VARIABLES:
- emoji_intensity: {emoji_intensity}        // low | medium | high
- emphasis_level: {emphasis_level}          // minimal | standard | expressive
- spacing_level: {spacing_level}            // compact | standard | spacious

📌 Formatting Guidelines:

1. Sectioning:
   - Detect natural breaks in content and insert section headlines using <p><strong>Title</strong></p>.
   - Insert a full visual break between sections using <p><br></p>.
   - For longer messages, break into clear, logical sections — even if not explicitly marked in the original.

2. Paragraph Wrapping:
   - Wrap every line (including section titles, quotes, and blank lines) in a <p> tag.
   - Add extra <p><br></p> line breaks based on spacing_level:
     - compact: between major sections only
     - standard: between sections and unrelated ideas
     - spacious: add generously for visual relief

3. Text Emphasis:
   - Use <strong>bold</strong> to highlight keywords, actions, or high-importance phrases — controlled by emphasis_level.
   - Use <em>italics</em> for tone, subtle emphasis, or quotes. Italicize all direct or indirect quotes.
     - minimal: very limited use
     - standard: for clarity and tone
     - expressive: strong use for rhythm, tone, emotion

4. Emojis:
   - Add emojis that support or enhance meaning, tone, or emotion:
     - 📢 Announcements, ✅ Tasks/Lists, ❤️ Appreciation, 💡 Tips, ❗ Alerts
     - Include 🌍 flags, 😊 emotions, 📅 dates, 📍locations, 🎉 celebrations when contextually relevant
     - Find opportunities to add emojis that match the message tone and content.
   - Use based on emoji_intensity:
     - low: only on critical highlights
     - medium: regularly to reinforce tone
     - high: enrich nearly every line or phrase where helpful

5. Clean Output:
   - Ensure layout is easy to scan — use spacing, titles, and styles for clarity.
   - Never alter the original message wording — your task is formatting only.`;

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  ["user",
    `TONE SETTINGS:
emoji_intensity: {emoji_intensity}
emphasis_level: {emphasis_level}
spacing_level: {spacing_level}

MESSAGE TO FORMAT:
{message}`
  ],
]);

export const decorateMessage = async ({
  inputMessage,
  emojiIntensity = EmojiIntensity.MEDIUM,
  emphasisLevel = EmphasisLevel.STANDARD,
  spacingLevel = SpacingLevel.STANDARD
}: {
  inputMessage: string;
  emojiIntensity?: typeof EmojiIntensity[keyof typeof EmojiIntensity];
  emphasisLevel?: typeof EmphasisLevel[keyof typeof EmphasisLevel];
  spacingLevel?: typeof SpacingLevel[keyof typeof SpacingLevel];
}): Promise<string> => {
  // Generate the prompt by applying the input to the template
  const chatPrompt = await promptTemplate.format({
    message: inputMessage,
    emoji_intensity: emojiIntensity,
    emphasis_level: emphasisLevel,
    spacing_level: spacingLevel,
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
