import { Mongoose, Schema } from "mongoose";

const ContactSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", unique: false, index: true, required: true },
    contact: { type: Schema.Types.ObjectId, ref: "User" },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

ContactSchema.static("get", async function(userId: string, offset: number) {
        const contacts = await this.find({ user: userId }).skip(offset);
        let i = 0;
        for (let user of contacts) {
            const contact = await this.findById(user.contact);
            if (!contact) {
                contacts.splice(i, 1);
            }
            i++;         
        }
        return contacts;
});

ContactSchema.static("addContact", async function(userId: string, contactId: string, byname: string) {
    return await this.findOneAndUpdate({ user: userId, contact: contactId },
        { $set: { user: userId, contact: contactId, byname }, $setOnInsert: { added_at: Date.now() }},
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
