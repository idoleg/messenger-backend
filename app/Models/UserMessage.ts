import {Mongoose, Schema} from "mongoose";

const UserMessageSchema = new Schema({
    sender: {type: String, required: true},
    recipient: {type: String, required: true},
    text: {type: String, required: true},
    read: {type: Boolean, default: false},
}, {
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

export default (mongoose: Mongoose) => {
    return mongoose.model("UserMessage", UserMessageSchema, "users.messages");
};
