import {Mongoose, Schema} from "mongoose";

const UserSchema = new Schema({
    email: {type: String, index: true, unique: true, required: true, trim: true},
    password: {type: String, default: "", trim: true},
    profile: {
        name: {type: String, default: "", trim: true},
        last_name: {type: String, default: "", trim: true},
        last_seen: {type: Date, default: null},
    },
}, {
    timestamps: {createdAt: "created_at", updatedAt: false},
});

export default (mongoose: Mongoose) => {
    return mongoose.model("User", UserSchema);
};
