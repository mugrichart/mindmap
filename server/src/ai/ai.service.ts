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

    async generateQuizQuestions(messages: ChatMessage[], count: number = 5): Promise<any[]> {
        const quizPrompt = `Based on the conversation above, generate ${count} multiple-choice questions to test the user's understanding. 
        Return ONLY a JSON array of objects with the following structure:
        [
          {
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": 0 // index of correct option
          }
        ]
        Make sure the questions are challenging and cover the key concepts discussed.`;

        const response = await this.openaiProvider.chat([
            ...messages,
            { role: 'user', content: quizPrompt }
        ], 'gpt-4o');

        try {
            // Clean the response if it contains markdown code blocks
            const cleaned = response.content.replace(/```json|```/g, '').trim();
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Failed to parse quiz questions:', error);
            return [];
        }
    }
}
