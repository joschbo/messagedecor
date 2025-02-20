const countWords = (message: string): number => {
    return message.trim().split(/\s+/).length;
  }
const removeHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, ''); // Matches anything between < and > and removes it
  };


export const validateMessage = (message: string): string[] => {
    const errors = [];

    const cleanedMessage = removeHtmlTags(message);
    const wordCount = countWords(cleanedMessage);
    if (wordCount < 5) {
        errors.push("Message must contain at least 5 words.");
    }

    if (wordCount > 500) {
        errors.push("Message cannot contain more than 500 words.");
    }

    if (cleanedMessage.length > 10000) {
        errors.push("Message cannot be longer than 10.000 characters.");
    }
    return errors;
}