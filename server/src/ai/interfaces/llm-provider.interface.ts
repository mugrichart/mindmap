export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface ChatResponse {
    content: string;
    model: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface LlmProvider {
    chat(messages: ChatMessage[], model?: string): Promise<ChatResponse>;
    stream(messages: ChatMessage[], model?: string): AsyncIterable<string>;
}
