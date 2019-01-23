import {Document, Model} from "mongoose";

export interface IUserContactDocument extends Document {
    user_id: string;
    contact: string;
    byname: string;
    added_at: Date;
}

export interface IUserContact extends IUserContactDocument {
}

export interface IUserContactModel extends Model<IUserContact> {
}
