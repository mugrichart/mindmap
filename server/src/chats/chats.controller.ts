import { Controller, Post, Body, Res, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import type { Response, Request } from 'express';
import { ChatsService } from './chats.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) { }

    @Get()
    async getRootChats(@Req() req: any) {
        return this.chatsService.findAllRoot(req.user.userId);
    }

    @Get(':id')
    async getChat(@Param('id') id: string, @Req() req: any) {
        return this.chatsService.findOne(id, req.user.userId);
    }

    @Get(':id/ancestry')
    async getAncestry(@Param('id') id: string, @Req() req: any) {
        return this.chatsService.getAncestry(id, req.user.userId);
    }

    @Get(':id/children')
    async getChildren(@Param('id') id: string, @Req() req: any) {
        return this.chatsService.findChildren(id, req.user.userId);
    }

    @Post('message')
    async sendMessage(@Body() dto: CreateChatMessageDto, @Req() req: any) {
        return this.chatsService.sendMessage(dto, req.user.userId);
    }

    @Post('stream')
    async streamMessage(@Body() dto: CreateChatMessageDto, @Req() req: any, @Res() res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const iterable = this.chatsService.getStream(dto, req.user.userId);

        for await (const chunk of iterable) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        res.end();
    }

    @Get(':id/quiz')
    async getQuiz(@Param('id') id: string, @Req() req: any) {
        return this.chatsService.getQuiz(id, req.user.userId);
    }

    @Get(':id/exam')
    async getExam(@Param('id') id: string, @Req() req: any) {
        return this.chatsService.getExam(id, req.user.userId);
    }

    @Post('quiz/:quizId/submit')
    async submitQuiz(@Param('quizId') quizId: string, @Body('answers') answers: number[], @Req() req: any) {
        return this.chatsService.submitQuiz(quizId, answers, req.user.userId);
    }
}
