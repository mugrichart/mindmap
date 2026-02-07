import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiModule } from '../ai/ai.module';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';

@Module({
    imports: [
        AiModule,
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Quiz.name, schema: QuizSchema },
        ]),
    ],
    controllers: [ChatsController],
    providers: [ChatsService],
})
export class ChatsModule { }
