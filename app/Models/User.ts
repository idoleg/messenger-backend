import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Mongoose, Schema} from "mongoose";
import {Config} from "../index";

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

UserSchema.static("getByEmail", async function(email: string) {
    return await this.findOne({ email });
});

UserSchema.static("registration", async function(email: string, password: string, name: string) {
    password = await bcrypt.hash(password, 12);
    return await this.create({email, password, profile: {name}});
});

UserSchema.static("isExist", async function(id: string) {
    return null != await this.findById(id);
});

UserSchema.method("createToken", function() {
    return jwt.sign(
        {
            userId: this._id.toString(),
        },
        Config.get("auth.privateKey"),
        {expiresIn: Config.get("auth.expiresTime")},
    );
});

export default (mongoose: Mongoose) => {
    return mongoose.model("User", UserSchema);
};
