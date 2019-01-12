import {Schema, Model, Document} from "mongoose";

export interface IUserMessageDocument extends Document {
    sender: string;
    recipient: string;
    text: string;
    read: string;
    sent_at: Date;
}

export interface IUserMessage extends IUserMessageDocument {

}

export interface IUserMessageModel extends Model<IUserMessage> {
    send(sender: string, recipient: string, text: string): Promise<IUserMessage>;
    findConversation(firstPerson: string, secondPerson: string, offset?: number, limit?: number): Promise<IUserMessage[]>;
    findOneForConversation(firstPerson: string, secondPerson: string, messageId: string): Promise<IUserMessage>;
}
