import {Document, Model, Types} from "mongoose";

export interface IUserContactDocument extends Document {
    user: Types.ObjectId;
    contact: Types.ObjectId;
    byname: string;
    added_at: Date;
}

export interface IUserContact extends IUserContactDocument {
}

export interface IUserContactModel extends Model<IUserContact> {
    addContact(userId: string, contactId: string, byname: string): Promise<IUserContact>;
    updateContact(id: string, userId: string, byname: string): Promise<IUserContact>;
    deleteContact(id: string, userId: string): Promise<IUserContact>;
}
