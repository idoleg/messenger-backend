import { Mongoose, Schema } from "mongoose";

const BlacklistSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", unique: false, index: true, required: true },
    banned: { type: Schema.Types.ObjectId, ref: "User" },
    added_at: { type: Date, default: null },
});

BlacklistSchema.static("addToBlacklist", async function(userId: string, bannedId: string) {
    return await this.findOneAndUpdate({ user: userId, banned: bannedId },
        { $set: { user: userId, banned: bannedId }, $setOnInsert: { added_at: Date.now() }}, { upsert: true, new: true });
});

BlacklistSchema.static("removeFromBlacklist", async function(id: string, userId: string) {
    return await this.deleteMany({ _id: id, user: userId });
});

export default (mongoose: Mongoose) => mongoose.model("Blacklist", BlacklistSchema, "users.blacklist");
