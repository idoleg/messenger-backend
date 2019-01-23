import {Model, Document} from "mongoose";
import {IUser} from "./User.d";
import {IGroup} from "./Group.d";

export interface IGroupMemberDocument extends Document {
    email: string;
    password: string;
    profile: {
        name: string;
        last_name: string;
        last_seen: Date;
    };
    created_at: Date;
}

export interface IGroupMember extends IGroupMemberDocument {

}

export interface IGroupMemberModel extends Model<IGroupMember> {
    isMember(group: string | IGroup, user: string | IUser): Promise<boolean>;
    addMemberTo(group: string | IGroup, user: string | IUser): Promise<IGroupMember>;
    changeRoleForMember(group: string | IGroup, member: string | IUser, newRole: string): Promise<IGroupMember>;
    deleteMemberFrom(group: string | IGroup, member: string | IUser): Promise<IGroupMember>;
    getMembersFor(group: string | IGroup, offset?: number, limit?: number): Promise<IGroupMember>;
}
