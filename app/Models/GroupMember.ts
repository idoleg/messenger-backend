import {Mongoose, Schema} from "mongoose";
import { getRightId } from "../Common/workWithModels";
import {IGroup} from "./Group.d";
import {IUser} from "./User.d";
import {MESSAGES_LIMIT} from "./UserMessage";

export const MEMBERS_LIMIT = 50;

const GroupMemberSchema = new Schema({
    group: {type: Schema.Types.ObjectId, ref: "Group", required: true},
    member: {type: Schema.Types.ObjectId, ref: "User", required: true},
    role: {type: String, default: "speaker"},
});

GroupMemberSchema.static("isMember", async function(group: string | IGroup, user: string | IUser) {
    const groupId = getRightId(group);
    const userId = getRightId(user);

    return null != await this.findOne({group: groupId, member: userId});
});

GroupMemberSchema.static("addMemberTo", async function(group: string | IGroup, user: string | IUser) {
    const groupId = getRightId(group);
    const userId = getRightId(user);

    return await this.findOneAndUpdate(
        {group: groupId, member: userId},
        {$set: {group: groupId, member: userId}},
        {upsert: true, new: true})
        .populate({path: "member", select: "profile"});
});

GroupMemberSchema.static("deleteMemberFrom", async function(group: string | IGroup, member: string | IUser) {
    const groupId = getRightId(group);
    const userId = getRightId(member);

    return await this.deleteMany({group: groupId, member: userId});
});

GroupMemberSchema.static("changeRoleForMember", async function(group: string | IGroup, member: string | IUser, newRole: string) {
    const groupId = getRightId(group);
    const userId = getRightId(member);

    return await this.findOneAndUpdate({group: groupId, member: userId}, {$set: {role: newRole}})
        .populate({path: "member", select: "profile"});
});

GroupMemberSchema.static("getMembersFor", async function(group: string | IGroup, offset: number = 0, limit: number = MESSAGES_LIMIT) {
    const groupId = getRightId(group);

    return await this.find({group: groupId}).populate({path: "member", select: "profile"}).limit(limit).skip(offset);
});

export default (mongoose: Mongoose) => {
    return mongoose.model("GroupMember", GroupMemberSchema, "groups.members");
};
