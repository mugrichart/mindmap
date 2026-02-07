export class CreateChatMessageDto {
    content: string;
    model?: string;
    chatId?: string;
    parentId?: string;
}
