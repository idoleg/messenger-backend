import { Mongoose, Schema } from "mongoose";

const UserContactSchema = new Schema({
    user_id: { type: String, index: true, unique: true, required: true },
    contact: { type: String, default: "", trim: true },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

UserContactSchema.static("addContact", async function(userId: string, contactId: string, byname: string) {
    return await this.findOneAndUpdate({ user_id: userId, contact: contactId, byname },
        { $set: { user_id: userId, contact: contactId, byname, added_at: Date.now() }}, { upsert: true, new: true });
});

export default (mongoose: Mongoose) => mongoose.model("AccountContact", UserContactSchema, "users.contacts");
