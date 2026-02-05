import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';

@Module({
    imports: [AiModule],
    controllers: [ChatsController],
    providers: [ChatsService],
})
export class ChatsModule { }
