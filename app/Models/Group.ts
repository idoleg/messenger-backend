import { Model, Mongoose, Schema } from "mongoose";
import { getRightId } from "../Common/workWithModels";
import { IGroup } from "./Group.d";
import { IGroupMember, IGroupMemberModel } from "./GroupMember.d";
import { IUser } from "./User.d";

let GroupMember: IGroupMemberModel;

const GroupSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    invitation_code: { type: String, default: null },
}, {
        timestamps: { createdAt: "created_at", updatedAt: false },
    });

GroupSchema.method("isCreator", function(user: string | IUser) {
    const userId = getRightId(user);

    return this.creator.equals(userId);
});

GroupSchema.method("isMember", async function(user: string | IUser) {
    return await GroupMember.isMember(this, user);
});

GroupSchema.method("addMember", async function(user: string | IUser) {
    return await GroupMember.addMemberTo(this, user);
});

GroupSchema.method("changeRoleForMember", async function(member: string | IUser, newRole: string) {
    return await GroupMember.changeRoleForMember(this, member, newRole);
});

GroupSchema.method("deleteMember", async function(member: string | IUser) {
    return await GroupMember.deleteMemberFrom(this, member);
});

GroupSchema.method("getMembers", async function(offset?: number, limit?: number) {
    return await GroupMember.getMembersFor(this, offset, limit);
});

GroupSchema.static("getGroup", async function(id: string) {
    return await this.findById(id);
});

GroupSchema.static("getGroupByInvitationCode", async function(invitationCode: string) {
    return await this.findOne({ invitation_code: invitationCode });
});

GroupSchema.static("addGroup", async function(user: string | IUser, name: string, description?: string) {
    const userId = getRightId(user);

    return await this.create({ name, description, creator: userId, invitation_code: null });
});

GroupSchema.method("updateGroup", function(name?: string, description?: string) {
    this.name = name || this.name;
    this.description = description || this.description;
    return;
});

// GroupSchema.method("getInvite", function() {
//     return this.invitation_code;
// });

GroupSchema.method("createInvite", async function() {
    this.invitation_code = "invite" + this._id.toString() + Math.random() * Math.random() * 1000000;
    return;
});

GroupSchema.method("deleteInvite", function() {
    this.invitation_code = null;
    return;
});

export default function(mongoose: Mongoose) {
    this.on("registeredAllModels", () => GroupMember = this.getModel("GroupMember"));
    return mongoose.model("Group", GroupSchema);
}
