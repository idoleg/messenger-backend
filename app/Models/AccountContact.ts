import { Mongoose, Schema } from "mongoose";

const ContactSchema = new Schema({
    user_id: { type: String, required: true },
    contact: { type: String, default: "", trim: true },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

ContactSchema.static("addContact", async function(userId: string, contactId: string, byname: string) {
    return await this.findOneAndUpdate({ user_id: userId, contact: contactId },
        { $set: { user_id: userId, contact: contactId, byname, added_at: Date.now() }}, { upsert: true, new: true });
});

ContactSchema.static("updateContact", async function(userId: string, id: string, byname: string) {
    return await this.findOneAndUpdate({ user_id: userId, _id: id },
        { $set: { byname }}, { new: true });
});

ContactSchema.static("deleteContact", async function(userId: string, id: string) {
    return await this.deleteMany({ user_id: userId, _id: id });
});

ContactSchema.static("getById", async function(userId: string, id: string) {
    return await this.findOne({ user_id: userId, _id: id });
});

export default (mongoose: Mongoose) => mongoose.model("AccountContact", ContactSchema, "users.contacts");
