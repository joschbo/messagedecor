export const EmojiIntensity = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high"
} as const;

export const EmphasisLevel = {
    MINIMAL: "minimal",
    STANDARD: "standard",
    EXPRESSIVE: "expressive"
} as const;
export const SpacingLevel = {
    COMPACT: "compact",
    STANDARD: "standard",
    SPACIOUS: "spacious"
} as const

export const MessageStyle = {
    FRIENDLY: "friendly",
    PROFESSIONAL: "professional",
    EXPRESSIVE: "expressive",
    CUSTOM: "custom"
} as const;

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
    }
};