import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ChatsService } from './chats.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }

    @Post('message')
    async sendMessage(@Body() dto: CreateChatMessageDto) {
        return this.chatsService.sendMessage(dto);
    }

    @Post('stream')
    async streamMessage(@Body() dto: CreateChatMessageDto, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const iterable = this.chatsService.getStream(dto);

        for await (const chunk of iterable) {
            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        }

        res.end();
    }
}
