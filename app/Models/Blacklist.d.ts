import {Document, Model, Types} from "mongoose";

export interface IBlacklistDocument extends Document {
    user: Types.ObjectId;
    banned: Types.ObjectId;
    added_at: Date;
}

export interface IBlacklist extends IBlacklistDocument {
}

export interface IBlacklostModel extends Model<IBlacklist> {
    addToBlacklist(userId: string, bannedId: string): Promise<IBlacklist>;
    removeFromBlacklist(id: string, userId: string): Promise<IBlacklist>;
}
