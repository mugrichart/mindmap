import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AiService } from '../ai/ai.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { ChatMessage } from '../ai/interfaces/llm-provider.interface';

@Injectable()
export class ChatsService {
    constructor(
        private readonly aiService: AiService,
        @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
    ) { }

    async findAllRoot() {
        return this.chatModel.find({ parentId: null }).sort({ updatedAt: -1 }).exec();
    }

    async findOne(id: string) {
        const chat = await this.chatModel.findById(id).exec();
        if (!chat) throw new NotFoundException('Chat not found');
        return chat;
    }

    async findChildren(parentId: string) {
        return this.chatModel.find({ parentId: new Types.ObjectId(parentId) }).sort({ createdAt: 1 }).exec();
    }

    async getAncestry(id: string) {
        const ancestry: any[] = [];
        let current = await this.chatModel.findById(id).lean().exec();

        while (current) {
            ancestry.unshift({
                id: current._id,
                label: current.title,
                type: 'folder'
            });
            if (current.parentId) {
                current = await this.chatModel.findById(current.parentId).lean().exec();
            } else {
                current = null;
            }
        }

        return ancestry;
    }

    async sendMessage(dto: CreateChatMessageDto): Promise<string> {
        if (dto.chatId) {
            const chat = await this.chatModel.findById(dto.chatId).exec();
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
                await chat.save();
                return response.content;
            }
        }

        const response = await this.aiService.chat([
            { role: 'user', content: dto.content }
        ], dto.model);

        const title = await this.generateTitle(dto.content);
        const newChat = new this.chatModel({
            title,
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

    async *getStream(dto: CreateChatMessageDto): AsyncIterable<any> {
        let conversation: ChatMessage[] = [];
        let chat: ChatDocument | null = null;

        if (dto.chatId) {
            chat = await this.chatModel.findById(dto.chatId).exec();
            if (chat) {
                conversation = chat.messages.map(m => ({
                    role: m.role as 'user' | 'assistant' | 'system',
                    content: m.content
                }));
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
}
