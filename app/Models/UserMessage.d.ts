import {Schema, Model, Document} from "mongoose";
import {IUser} from "./User.d";

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
    send(sender: string | IUser, recipient: string | IUser, text: string): Promise<IUserMessage>;
    findConversation(firstPerson: string | IUser, secondPerson: string | IUser, offset?: number, limit?: number): Promise<IUserMessage[]>;
    findOneForConversation(firstPerson: string | IUser, secondPerson: string | IUser, messageId: string): Promise<IUserMessage>;
}
