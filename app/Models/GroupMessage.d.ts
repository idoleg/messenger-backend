import {Schema, Model, Document} from "mongoose";
import {IGroup} from "./Group.d";
// import {IUser} from "./User.d";

export interface IGroupMessageDocument extends Document {
    sender: string;
    group: string;
    text: string;
    sent_at: Date;
}

export interface IGroupMessage extends IGroupMessageDocument {

}

export interface IGroupMessageModel extends Model<IGroupMessage> {
    send(sender: string | IGroup, group: string | IGroup, text: string): Promise<IGroupMessage>;
    findConversation(group: string | IGroup, offset?: number, limit?: number): Promise<IGroupMessage[]>;
    findOneForConversation(group: string | IGroup, messageId: string): Promise<IGroupMessage>;
}
