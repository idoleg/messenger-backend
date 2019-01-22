import { Mongoose, Schema } from "mongoose";

const UserContactSchema = new Schema({
    user_id: { type: String, index: true, unique: true, required: true },
    contact: { type: String, default: "", trim: true },
    byname: { type: String, default: "", trim: true  },
    added_at: { type: Date, default: null },
});

export default (mongoose: Mongoose) => mongoose.model("UserContact", UserContactSchema, "users.contacts");
