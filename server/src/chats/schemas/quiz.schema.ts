import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
    @Prop({ type: Types.ObjectId, ref: 'Chat', required: true })
    chatId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({
        type: [{
            question: String,
            options: [String],
            correctAnswer: Number, // index of the option
            userAnswer: Number
        }],
        required: true
    })
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
        userAnswer?: number;
    }[];

    @Prop({ default: 0 })
    score: number;

    @Prop({ default: 0 })
    maxScore: number;

    @Prop({ required: true, enum: ['quiz', 'exam'] })
    type: 'quiz' | 'exam';

    @Prop({ default: false })
    completed: boolean;
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
