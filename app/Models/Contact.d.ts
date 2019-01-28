import {Document, Model} from "mongoose";

export interface IAccountContactDocument extends Document {
    user: string;
    contact: string;
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
