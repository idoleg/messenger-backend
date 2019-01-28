import { Mongoose, Schema } from "mongoose";

const ContactSchema = new Schema({
    user: { type: String, unique: false, index: true, required: true },
    contact: { type: String, default: "", trim: true },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

ContactSchema.static("addContact", async function(userId: string, contactId: string, byname: string) {
    return await this.findOneAndUpdate({ user: userId, contact: contactId },
        { $set: { user: userId, contact: contactId, byname, added_at: Date.now() }}, { upsert: true, new: true });
});

ContactSchema.static("updateContact", async function(id: string, byname: string) {
    return await this.findOneAndUpdate({ _id: id },
        { $set: { byname }}, { new: true });
});

ContactSchema.static("deleteContact", async function(id: string) {
    return await this.deleteMany({ _id: id });
});

export default (mongoose: Mongoose) => mongoose.model("Contact", ContactSchema, "users.contacts");
