import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
    @Prop({ required: true })
    title: string;

    @Prop({ type: [{ role: String, content: String }], default: [] })
    messages: { role: string; content: string }[];

    @Prop({ type: Types.ObjectId, ref: 'Chat', default: null })
    parentId: Types.ObjectId | null;

    @Prop({ default: 'gpt-4o' })
    aiModel: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
