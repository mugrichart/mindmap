import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatMessage, ChatResponse, LlmProvider } from '../interfaces/llm-provider.interface';

@Injectable()
export class OpenAiProvider implements LlmProvider {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async chat(messages: ChatMessage[], model: string = 'gpt-4o'): Promise<ChatResponse> {
        const response = await this.openai.chat.completions.create({
            model,
            messages: messages.map(m => ({
                role: m.role as any,
                content: m.content,
            })),
        });

        const content = response.choices[0].message.content || '';

        return {
            content,
            model: response.model,
            usage: {
                promptTokens: response.usage?.prompt_tokens || 0,
                completionTokens: response.usage?.completion_tokens || 0,
                totalTokens: response.usage?.total_tokens || 0,
            },
        };
    }

    async *stream(messages: ChatMessage[], model: string = 'gpt-4o'): AsyncIterable<string> {
        const stream = await this.openai.chat.completions.create({
            model,
            messages: messages.map(m => ({
                role: m.role as any,
                content: m.content,
            })),
            stream: true,
        });

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                yield content;
            }
        }
    }
}
