import {Document, Model} from "mongoose";

export interface IAccountContactDocument extends Document {
    user_id: string;
    contact: string;
    byname: string;
    added_at: Date;
}

export interface IAccountContact extends IAccountContactDocument {
}

export interface IUserContactModel extends Model<IAccountContact> {
    addContact(userId: string, contactId: string, byname: string): Promise<IAccountContact>;
    updateContact(id: string, byname: string): Promise<IAccountContact>;
    deleteContact(id: string): Promise<IAccountContact>;
}
