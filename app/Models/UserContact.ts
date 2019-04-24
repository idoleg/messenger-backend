import { Mongoose, Schema } from "mongoose";

const ContactSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", unique: false, index: true, required: true },
    profile: { type: Object, ref: "User" },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

ContactSchema.static("get", async function(userId: string, offset: number) {
    return await this.find({ user: userId }).skip(offset);
});

ContactSchema.static("addContact", async function(userId: string, userProfile: object, byname: string) {
    return await this.findOneAndUpdate({ user: userId, profile: userProfile },
        { $set: { user: userId, profile: userProfile, byname }, $setOnInsert: { added_at: Date.now() }},
        { upsert: true, new: true });
});

ContactSchema.static("updateContact", async function(id: string, userId: string, byname: string) {
    return await this.findOneAndUpdate({ contact: id, user: userId },
        { $set: { byname }}, { new: true });
});

ContactSchema.static("deleteContact", async function(id: string, userId: string) {
    return await this.deleteMany({ contact: id, user: userId });
});

export default (mongoose: Mongoose) => mongoose.model("UserContact", ContactSchema, "users.contacts");
