import { Model, Document, Types } from "mongoose";
import { IUser } from "./User.d";

export interface IUserChatDocument extends Document {
    user: Types.ObjectId,
    group: Types.ObjectId,
    direct: Types.ObjectId,
    sender: Types.ObjectId,
    preview: string,
    unread: number,
}

export interface IUserChat extends IUserChatDocument {

}

export interface IUserChatModel extends Model<IUserChat> {
    getChats(user: string | IUser): Promise<IUserChat>;
    findChatById(chatId: string): Promise<IUserChat>;
    findChatByUserGroupId(user: string | IUser, id: string): Promise<IUserChat>;
    addChat(user: string | IUser, group: boolean, id: string, sender: string | IUser, preview: string): Promise<IUserChat>;
    updateChat(user: string | IUser, id: string, sender: string | IUser, preview: string): Promise<IUserChat>;
    deleteChatById(chatId: string): Promise<boolean>;
    deleteChatByUserGroupId(user: string | IUser, id: string): Promise<IUser> | Promise<boolean>;
}
