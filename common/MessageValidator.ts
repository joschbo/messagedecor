const countWords = (message: string): number => {
    return message.trim().split(/\s+/).length;
  }
const removeHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, ''); // Matches anything between < and > and removes it
  };

const MIN_WORD_COUNT = 5;
const MAX_WORD_COUNT = 500;
const MAX_CHARACTER_COUNT = 10000;


export const validateMessage = (message: string): string[] => {
    const errors = [];

    const cleanedMessage = removeHtmlTags(message);
    const wordCount = countWords(cleanedMessage);
    if (wordCount < MIN_WORD_COUNT) {
        errors.push(`Message must contain at least ${MIN_WORD_COUNT} words.`);
    }

    if (wordCount > MAX_WORD_COUNT) {
        errors.push(`Message cannot contain more than ${MAX_WORD_COUNT} words.`);
    }

    if (cleanedMessage.length > MAX_CHARACTER_COUNT) {
        errors.push(`Message cannot be longer than ${MAX_CHARACTER_COUNT} characters.`);
    }
    return errors;
}