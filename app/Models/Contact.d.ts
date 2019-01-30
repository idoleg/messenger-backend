import {Document, Model, Types} from "mongoose";

export interface IAccountContactDocument extends Document {
    user: Types.ObjectId;
    contact: Types.ObjectId;
    byname: string;
    added_at: Date;
}

export interface IContact extends IAccountContactDocument {
}

export interface IUserContactModel extends Model<IContact> {
    addContact(userId: string, contactId: string, byname: string): Promise<IContact>;
    updateContact(id: string, userId: string, byname: string): Promise<IContact>;
    deleteContact(id: string, userId: string): Promise<IContact>;
}
