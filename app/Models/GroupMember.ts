import {Mongoose, Schema} from "mongoose";
import {IGroup} from "./Group.d";
import {IUser} from "./User.d";
import {MESSAGES_LIMIT} from "./UserMessage";

export const MEMBERS_LIMIT = 50;

const GroupMemberSchema = new Schema({
    group: {type: String, required: true},
    member: {type: String, required: true},
    role: {type: String, default: "speaker"}
});

GroupMemberSchema.static("isMember", async function(group: string | IGroup, user: string | IUser) {
    if (typeof group !== "string") group = group._id.toString();
    if (typeof user !== "string") user = user._id.toString();

    return null != await this.findOne({group, member: user});
});

GroupMemberSchema.static("addMemberTo", async function(group: string | IGroup, user: string | IUser) {
    if (typeof group !== "string") group = group._id.toString();
    if (typeof user !== "string") user = user._id.toString();

    return await this.findOneAndUpdate({group, member: user}, {$set: {group, member: user}}, {upsert: true, new: true});
});

GroupMemberSchema.static("deleteMemberFrom", async function(group: string | IGroup, member: string | IUser) {
    if (typeof group !== "string") group = group._id.toString();
    if (typeof member !== "string") member = member._id.toString();

    return await this.deleteMany({group, member});
});

GroupMemberSchema.static("changeRoleForMember", async function(group: string | IGroup, member: string | IUser, newRole: string) {
    if (typeof group !== "string") group = group._id.toString();
    if (typeof member !== "string") member = member._id.toString();

    return await this.findOneAndUpdate({group, member},{$set: {role: newRole}});
});

GroupMemberSchema.static("getMembersFor", async function(group: string | IGroup, offset: number = 0, limit: number = MESSAGES_LIMIT) {
    if (typeof group !== "string") group = group._id.toString();

    return await this.find({group}).limit(limit).skip(offset);
});

export default (mongoose: Mongoose) => {
    return mongoose.model("GroupMember", GroupMemberSchema, "groups.members");
};
