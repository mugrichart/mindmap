import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AiService } from '../ai/ai.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Injectable()
export class ChatsService {
    constructor(private readonly aiService: AiService) { }

    async sendMessage(dto: CreateChatMessageDto): Promise<string> {
        const response = await this.aiService.chat([
            { role: 'user', content: dto.content }
        ], dto.model);

        return response.content;
    }

    async *getStream(dto: CreateChatMessageDto): AsyncIterable<string> {
        yield* this.aiService.stream([
            { role: 'user', content: dto.content }
        ], dto.model);
    }
}
