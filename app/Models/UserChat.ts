import { Mongoose, Schema } from "mongoose";

const UserChatSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", index: true, required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", default: null },
    direct: { type: Schema.Types.ObjectId, ref: "User" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    preview: { type: String, required: true, trim: true },
    unread: { type: Number, default: 0 },
});

export default (mongoose: Mongoose) => {
    return mongoose.model("UserChat", UserChatSchema, "users.chats");
};
