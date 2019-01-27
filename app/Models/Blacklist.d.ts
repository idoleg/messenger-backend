import {Document, Model} from "mongoose";

export interface IBlacklistDocument extends Document {
    user_id: string;
    banned: string;
    added_at: Date;
}

export interface IBlacklist extends IBlacklistDocument {
}

export interface IBlacklostModel extends Model<IBlacklist> {
    addToBlacklist(userId: string, bannedId: string): Promise<IBlacklist>;
    removeFromBlacklist(id: string): Promise<IBlacklist>;
}
