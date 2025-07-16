export enum EmojiIntensity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high"
}
export enum EmphasisLevel {
    MINIMAL = "minimal",
    STANDARD = "standard",
    EXPRESSIVE = "expressive"
}
export enum SpacingLevel {
    COMPACT = "compact",
    STANDARD = "standard",
    SPACIOUS = "spacious"
}

export const MessageStyle: {
    FRIENDLY: string;
    PROFESSIONAL: string;
    EXPRESSIVE: string;
    MINIMALIST: string;
    CUSTOM: string;
} = {
    FRIENDLY: "friendly",
    PROFESSIONAL: "professional",
    EXPRESSIVE: "expressive",
    MINIMALIST: "minimalist",
    CUSTOM: "custom"
};

export const messageStyleMapping = {
    [MessageStyle.PROFESSIONAL]: {
        emojiIntensity: EmojiIntensity.LOW,
        emphasisLevel: EmphasisLevel.MINIMAL,
        spacingLevel: SpacingLevel.COMPACT
    },
    [MessageStyle.FRIENDLY]: {
        emojiIntensity: EmojiIntensity.MEDIUM,
        emphasisLevel: EmphasisLevel.STANDARD,
        spacingLevel: SpacingLevel.STANDARD
    },
    [MessageStyle.EXPRESSIVE]: {
        emojiIntensity: EmojiIntensity.HIGH,
        emphasisLevel: EmphasisLevel.EXPRESSIVE,
        spacingLevel: SpacingLevel.SPACIOUS
    },
    [MessageStyle.MINIMALIST]: {
        emojiIntensity: EmojiIntensity.LOW,
        emphasisLevel: EmphasisLevel.MINIMAL,
        spacingLevel: SpacingLevel.COMPACT
    }
};