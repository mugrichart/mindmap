import { Controller, Post, Body, Res, Get, Param, Query } from '@nestjs/common';
import type { Response } from 'express';
import { ChatsService } from './chats.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }

    @Get()
    async getRootChats() {
        return this.chatsService.findAllRoot();
    }

    @Get(':id')
    async getChat(@Param('id') id: string) {
        return this.chatsService.findOne(id);
    }

    @Get(':id/ancestry')
    async getAncestry(@Param('id') id: string) {
        return this.chatsService.getAncestry(id);
    }

    @Get(':id/children')
    async getChildren(@Param('id') id: string) {
        return this.chatsService.findChildren(id);
    }

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
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        res.end();
    }

    @Get(':id/quiz')
    async getQuiz(@Param('id') id: string) {
        return this.chatsService.getQuiz(id);
    }

    @Get(':id/exam')
    async getExam(@Param('id') id: string) {
        return this.chatsService.getExam(id);
    }

    @Post('quiz/:quizId/submit')
    async submitQuiz(@Param('quizId') quizId: string, @Body('answers') answers: number[]) {
        return this.chatsService.submitQuiz(quizId, answers);
    }
}
