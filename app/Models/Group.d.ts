import {Model, Document, Types} from "mongoose";
import {IUser} from "./User.d";
import {IGroupMember} from "./GroupMember.d";

export interface IGroupDocument extends Document {
    creator: Types.ObjectId;
    name: string;
    description: string;
    invitation_code: string;
    created_at: Date;
}

export interface IGroup extends IGroupDocument {
    isCreator(user: string | IUser): boolean;
    isMember(user: string | IUser): Promise<boolean>;
    addMember(user: string | IUser): Promise<IGroupMember>;
    changeRoleForMember(member: string | IUser, newRole: string): Promise<IGroupMember>;
    deleteMember(member: string | IUser): Promise<IGroupMember>;
    getMembers(offset?: number, limit?: number): Promise<IGroupMember>;
    updateGroup(name?: string, description?: string): void;
    // getInvite(): string;changeRoleForMember
    createInvite(): void;
    deleteInvite(): void;
}

export interface IGroupModel extends Model<IGroup> {
    getGroup(id: string): Promise<IGroup>;
    addGroup(user: IUser, name: string, description?: string): Promise<IGroup>;
    getGroupByInvitationCode(invitation_code: string): Promise<IGroup>;
}
