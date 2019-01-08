import {Mongoose, Schema} from "mongoose";

const GroupMessageSchema = new Schema({
    sender: {type: String, required: true},
    group: {type: String, required: true},
    text: {type: String, required: true},
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

export default (mongoose: Mongoose) => {
    return mongoose.model("GroupMessage", GroupMessageSchema, "groups.messages");
};
