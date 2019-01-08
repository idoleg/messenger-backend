import {Mongoose, Schema} from "mongoose";

const UserChatSchema = new Schema({
    user_id: {type: String, index: true, unique: true, required: true},
    message: {
        group: {type: String, default: null},
        sender: {type: String, default: "", trim: true},
        unread: {type: Number, default: 0},
    },
});

export default (mongoose: Mongoose) => {
    return mongoose.model("UserChat", UserChatSchema, "users.chats");
};
