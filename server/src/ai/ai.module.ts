import { Module } from '@nestjs/common';
import { OpenAiProvider } from './providers/openai.provider';
import { AiService } from './ai.service';

@Module({
    providers: [OpenAiProvider, AiService],
    exports: [AiService],
})
export class AiModule { }
