import {Model, Document} from "mongoose";
import {IUser} from "./User.d";
import {IGroupMember} from "./GroupMember.d";

export interface IGroupDocument extends Document {
    email: string;
    password: string;
    profile: {
        name: string;
        last_name: string;
        last_seen: Date;
    };
    created_at: Date;
}

export interface IGroup extends IGroupDocument {
    isCreator(user: string | IUser): boolean;
    isMember(user: string | IUser): Promise<boolean>;
    addMember(user: string | IUser): Promise<IGroupMember>;
    deleteMember(member: string | IUser): Promise<IGroupMember>;
    getMembers(offset?: number, limit?: number): Promise<IGroupMember>;
}

export interface IGroupModel extends Model<IGroup> {

}
