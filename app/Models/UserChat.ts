import { Error as MongooseError, Mongoose, Schema } from "mongoose";
import { getRightId } from "../Common/workWithModels";
import { IUser } from "./User.d";

export const CHATS_LIMIT = 20;

const UserChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    direct: { type: Schema.Types.ObjectId, ref: "User", default: null },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    preview: { type: String, required: true, trim: true },
    unread: { type: Number, default: 0 },
});

UserChatSchema.static("getChats", async function(user: string | IUser, offset: number) {
    const userId = getRightId(user);
    if (offset) {
        return await this.find({ user: userId }).skip(offset).limit(offset + CHATS_LIMIT);
    } else {
        return await this.find({ user: userId });
    }
});

UserChatSchema.static("findChatById", async function(chatId: string) {
    return await this.findById(chatId);
});

UserChatSchema.static("findChatByUserGroupId", async function(user: string | IUser, id: string) {
    const userId = getRightId(user);
    const userGroupId = getRightId(id);
    return await this.findOne({
        user: userId,
        $or: [
            { group: userGroupId },
            { direct: userGroupId },
        ],
    });
});

UserChatSchema.static("addChat", async function(user: string | IUser, group: boolean, id: string, sender: string | IUser, preview: string) {
    const userGroupId = getRightId(id);
    const userId = getRightId(user);
    const senderId = getRightId(sender);

    if (group) {
        return this.create({ user: userId, group: userGroupId, sender: senderId, preview });
    }
    return this.create({ user: userId, direct: userGroupId, sender: senderId, preview });
});

UserChatSchema.static("updateChat", async function(user: string | IUser, id: string, sender: string | IUser, preview: string) {
    const chat = await this.findChatByUserGroupId(user, id);
    const userId = getRightId(user);
    const senderId = getRightId(sender);

    chat.preview = preview;
    chat.sender = senderId;
    if (senderId === userId) {
        chat.unread = 0;
    } else {
        chat.unread++;
    }
    await chat.save();

    return chat;
});

UserChatSchema.static("deleteChatById", async function(chatId: string) {
    await this.findOneAndRemove({ _id: chatId });
    return true;
});

UserChatSchema.static("deleteChatByUserGroupId", async function(user: string | IUser, id: string) {
    const userId = getRightId(user);
    const userGroupId = getRightId(id);
    await this.findOneAndRemove({
        user: userId,
        $or: [
            { group: userGroupId },
            { direct: userGroupId },
        ],
    });
    return true;
});

export default (mongoose: Mongoose) => {
    return mongoose.model("UserChat", UserChatSchema, "users.chats");
};
