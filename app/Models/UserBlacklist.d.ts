import {Document, Model, Types} from "mongoose";

export interface IBlacklistDocument extends Document {
    user: Types.ObjectId;
    banned: Types.ObjectId;
    added_at: Date;
}

export interface IUserBlacklist extends IBlacklistDocument {
}

export interface IUserBlacklistModel extends Model<IUserBlacklist> {
    addToBlacklist(userId: string, bannedId: string): Promise<IUserBlacklist>;
    removeFromBlacklist(id: string, userId: string): Promise<IUserBlacklist>;
}
