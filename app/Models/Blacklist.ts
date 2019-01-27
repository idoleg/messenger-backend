import { Mongoose, Schema } from "mongoose";

const BlacklistSchema = new Schema({
    user_id: { type: String, unique: false, index: true, required: true },
    banned: { type: String, default: "", trim: true },
    added_at: { type: Date, default: null },
});

BlacklistSchema.static("addToBlacklist", async function(userId: string, bannedId: string) {
    return await this.findOneAndUpdate({ user_id: userId, banned: bannedId },
        { $set: { user_id: userId, banned: bannedId, added_at: Date.now() }}, { upsert: true, new: true });
});

BlacklistSchema.static("removeFromBlacklist", async function(id: string) {
    return await this.deleteMany({ _id: id });
});

export default (mongoose: Mongoose) => mongoose.model("Blacklist", BlacklistSchema, "users.blacklist");
