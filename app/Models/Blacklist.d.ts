import {Document, Model} from "mongoose";

export interface IBlacklistDocument extends Document {
    user_id: string;
    contact: string;
    byname: string;
    added_at: Date;
}

export interface IBlacklist extends IBlacklistDocument {
}

export interface IBlacklostModel extends Model<IBlacklist> {
    addToBlacklist(userId: string, bannedId: string): Promise<IBlacklist>;
    removeFromBlacklist(userId: string, id: string): Promise<IBlacklist>;
}
