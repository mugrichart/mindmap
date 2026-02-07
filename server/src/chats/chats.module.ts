import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from '../ai/ai.module';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
    imports: [
        AiModule,
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    ],
    controllers: [ChatsController],
    providers: [ChatsService],
})
export class ChatsModule { }
