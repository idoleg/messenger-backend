import {Document, Model, Types} from "mongoose";

export interface IUserContactDocument extends Document {
    user: Types.ObjectId;
    profile: Object;
    byname: string;
    added_at: Date;
}

export interface IUserContact extends IUserContactDocument {
}

export interface IUserContactModel extends Model<IUserContact> {
    get(userId: string, offset?: number): Promise<[IUserContact]>;
    addContact(userId: string, userProfile: object, byname: string): Promise<IUserContact>;
    updateContact(id: string, userId: string, byname: string): Promise<IUserContact>;
    deleteContact(id: string, userId: string): Promise<IUserContact>;
}
