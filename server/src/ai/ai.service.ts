import { Injectable } from '@nestjs/common';
import { OpenAiProvider } from './providers/openai.provider';
import { ChatMessage, ChatResponse } from './interfaces/llm-provider.interface';

@Injectable()
export class AiService {
    constructor(private readonly openaiProvider: OpenAiProvider) { }

    async chat(messages: ChatMessage[], model?: string): Promise<ChatResponse> {
        return this.openaiProvider.chat(messages, model);
    }

    async *stream(messages: ChatMessage[], model?: string): AsyncIterable<string> {
        yield* this.openaiProvider.stream(messages, model);
    }

    async summarize(messages: ChatMessage[]): Promise<string> {
        const summaryPrompt = "Please provide a concise summary of the conversation above in 2-3 sentences. Focus on the core topics and the current state of knowledge established.";
        const response = await this.openaiProvider.chat([
            ...messages,
            { role: 'user', content: summaryPrompt }
        ]);
        return response.content;
    }
}
