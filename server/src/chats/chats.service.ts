import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiService } from '../ai/ai.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { ChatMessage } from '../ai/interfaces/llm-provider.interface';
import { Quiz, QuizDocument } from './schemas/quiz.schema';

@Injectable()
export class ChatsService {
    constructor(
        private readonly aiService: AiService,
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
        @InjectModel(Quiz.name) private readonly quizModel: Model<QuizDocument>,
    ) { }

    async findAllRoot(userId: string) {
        return this.chatModel.find({ parentId: null, userId: new Types.ObjectId(userId) }).sort({ updatedAt: -1 }).exec();
    }

    async findOne(id: string, userId: string) {
        const chat = await this.chatModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).exec();
        if (!chat) throw new NotFoundException('Chat not found');
        return chat;
    }

    async findChildren(parentId: string, userId: string) {
        return this.chatModel.find({ parentId: new Types.ObjectId(parentId), userId: new Types.ObjectId(userId) }).sort({ createdAt: 1 }).exec();
    }

    async getAncestry(id: string, userId: string) {
        const ancestry: any[] = [];
        let current = await this.chatModel.findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) }).lean().exec();

        while (current) {
            ancestry.unshift({
                id: current._id,
                label: current.title,
                type: 'folder'
            });
            if (current.parentId) {
                current = await this.chatModel.findOne({ _id: current.parentId, userId: new Types.ObjectId(userId) }).lean().exec();
            } else {
                current = null;
            }
        }

        return ancestry;
    }

    async sendMessage(dto: CreateChatMessageDto, userId: string): Promise<string> {
        if (dto.chatId) {
            const chat = await this.chatModel.findOne({ _id: new Types.ObjectId(dto.chatId), userId: new Types.ObjectId(userId) }).exec();
            if (chat) {
                const messages: ChatMessage[] = chat.messages.map(m => ({
                    role: m.role as 'user' | 'assistant' | 'system',
                    content: m.content
                }));

                const response = await this.aiService.chat([
                    ...messages,
                    { role: 'user', content: dto.content }
                ], dto.model);

                chat.messages.push({ role: 'user', content: dto.content });
                chat.messages.push({ role: 'assistant', content: response.content });

                if (chat.messages.length % 6 === 0) {
                    const messagesToSummarize: ChatMessage[] = chat.messages.map(m => ({
                        role: m.role as any,
                        content: m.content
                    }));
                    this.aiService.summarize(messagesToSummarize).then(summary => {
                        chat.summary = summary;
                        chat.save();
                    }).catch(err => console.error('Summarization failed:', err));
                }

                await chat.save();
                return response.content;
            }
        }

        let conversation: ChatMessage[] = [];
        if (dto.parentId) {
            const parent = await this.chatModel.findOne({ _id: new Types.ObjectId(dto.parentId), userId: new Types.ObjectId(userId) }).exec();
            if (parent && parent.summary) {
                conversation = [
                    {
                        role: 'system',
                        content: `Context from parent topic ("${parent.title}"): ${parent.summary}\nUse this to understand the background of the user's request.`
                    }
                ];
            }
        }

        const response = await this.aiService.chat([
            ...conversation,
            { role: 'user', content: dto.content }
        ], dto.model);

        const title = await this.generateTitle(dto.content);
        const newChat = new this.chatModel({
            title,
            userId: new Types.ObjectId(userId),
            messages: [
                { role: 'user', content: dto.content },
                { role: 'assistant', content: response.content }
            ],
            parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
            aiModel: dto.model || 'gpt-4o'
        });

        await newChat.save();
        return response.content;
    }

    async *getStream(dto: CreateChatMessageDto, userId: string): AsyncIterable<any> {
        let conversation: ChatMessage[] = [];
        let chat: ChatDocument | null = null;

        if (dto.chatId) {
            chat = await this.chatModel.findOne({ _id: new Types.ObjectId(dto.chatId), userId: new Types.ObjectId(userId) }).exec();
            if (chat) {
                conversation = chat.messages.map(m => ({
                    role: m.role as 'user' | 'assistant' | 'system',
                    content: m.content
                }));
            }
        } else if (dto.parentId) {
            const parent = await this.chatModel.findOne({ _id: new Types.ObjectId(dto.parentId), userId: new Types.ObjectId(userId) }).exec();
            if (parent && parent.summary) {
                conversation = [
                    {
                        role: 'system',
                        content: `Context from parent topic ("${parent.title}"): ${parent.summary}\nUse this to understand the background of the user's request.`
                    }
                ];
            }
        }

        const currentMessages: ChatMessage[] = [...conversation, { role: 'user', content: dto.content }];
        let accumulatedResponse = '';
        const stream = this.aiService.stream(currentMessages, dto.model);

        for await (const chunk of stream) {
            accumulatedResponse += chunk;
            yield { content: chunk };
        }

        if (!dto.chatId) {
            const title = await this.generateTitle(dto.content);
            const newChat = new this.chatModel({
                title,
                userId: new Types.ObjectId(userId),
                messages: [
                    { role: 'user', content: dto.content },
                    { role: 'assistant', content: accumulatedResponse }
                ],
                parentId: dto.parentId ? new Types.ObjectId(dto.parentId) : null,
                aiModel: dto.model || 'gpt-4o'
            });
            const savedChat = await newChat.save();
            yield { metadata: { chatId: savedChat._id, title: savedChat.title } };
        } else if (chat) {
            chat.messages.push({ role: 'user', content: dto.content });
            chat.messages.push({ role: 'assistant', content: accumulatedResponse });

            if (chat.messages.length % 6 === 0) {
                const messagesToSummarize: ChatMessage[] = chat.messages.map(m => ({
                    role: m.role as any,
                    content: m.content
                }));
                this.aiService.summarize(messagesToSummarize).then(summary => {
                    chat.summary = summary;
                    chat.save();
                }).catch(err => console.error('Summarization failed:', err));
            }

            await chat.save();
        }
    }

    private async generateTitle(prompt: string): Promise<string> {
        const titlePrompt = `Generate a very short, concise title (max 5 words) for a chat that starts with this message: "${prompt}". Return ONLY the title text.`;
        const response = await this.aiService.chat([
            { role: 'user', content: titlePrompt }
        ], 'gpt-4o');
        return response.content.replace(/["']/g, '').trim();
    }

    // Quiz and Exam Methods
    async getQuiz(chatId: string, userId: string) {
        const chat = await this.findOne(chatId, userId);
        const questions = await this.aiService.generateQuizQuestions(
            chat.messages.map(m => ({ role: m.role as any, content: m.content })),
            5
        );

        // Overwrite: remove any previous quiz attempts for this chat
        await this.quizModel.deleteMany({ chatId: new Types.ObjectId(chatId), userId: new Types.ObjectId(userId), type: 'quiz' }).exec();

        const quiz = new this.quizModel({
            chatId: new Types.ObjectId(chatId),
            userId: new Types.ObjectId(userId),
            questions,
            maxScore: questions.length,
            type: 'quiz'
        });

        return quiz.save();
    }

    async getExam(chatId: string, userId: string) {
        const rootChat = await this.findOne(chatId, userId);
        const allQuestions: any[] = [];

        const rootQuestions = await this.aiService.generateQuizQuestions(
            rootChat.messages.map(m => ({ role: m.role as any, content: m.content })),
            5
        );
        allQuestions.push(...rootQuestions);

        const children = await this.findChildren(chatId, userId);
        for (const child of children) {
            const childQuestions = await this.collectQuestionsForExam(child);
            allQuestions.push(...childQuestions);
        }

        const EXAM_CAP = 15;
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, EXAM_CAP);

        // Overwrite: remove any previous exam attempts for this chat
        await this.quizModel.deleteMany({ chatId: new Types.ObjectId(chatId), userId: new Types.ObjectId(userId), type: 'exam' }).exec();

        const exam = new this.quizModel({
            chatId: new Types.ObjectId(chatId),
            userId: new Types.ObjectId(userId),
            questions: selected,
            maxScore: selected.length,
            type: 'exam'
        });

        return exam.save();
    }

    private async collectQuestionsForExam(chat: ChatDocument): Promise<any[]> {
        return this.aiService.generateQuizQuestions(
            chat.messages.map(m => ({ role: m.role as any, content: m.content })),
            3
        );
    }

    async submitQuiz(quizId: string, answers: number[], userId: string) {
        const quiz = await this.quizModel.findOne({ _id: new Types.ObjectId(quizId), userId: new Types.ObjectId(userId) }).exec();
        if (!quiz) throw new NotFoundException('Quiz not found');

        let score = 0;
        quiz.questions.forEach((q, i) => {
            q.userAnswer = answers[i];
            if (q.userAnswer === q.correctAnswer) {
                score++;
            }
        });

        quiz.score = score;
        quiz.completed = true;
        await quiz.save();

        const chat = await this.chatModel.findOne({ _id: quiz.chatId, userId: new Types.ObjectId(userId) }).exec();
        if (chat) {
            if (quiz.type === 'quiz') {
                chat.bestQuizScore = score;
                chat.quizTaken = true;
            } else {
                chat.bestExamScore = score;
                chat.examTaken = true;
            }
            await chat.save();
        }

        return quiz;
    }
}
