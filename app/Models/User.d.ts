import {Model, Document} from "mongoose";

export interface IUserDocument extends Document {
    email: string;
    password: string;
    profile: {
        name: string;
        last_name: string;
        last_seen: Date;
    };
    created_at: Date;
}

export interface IUser extends IUserDocument {

}

export interface IUserModel extends Model<IUser> {
    registration(email: string, password: string, name: string): Promise<IUser>;
}
