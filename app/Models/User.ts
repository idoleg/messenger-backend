import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Mongoose, Schema} from "mongoose";
import {Document} from "mongoose";
import {Config} from "../index";

const UserSchema = new Schema({
    email: {type: String, index: true, unique: true, required: true, trim: true},
    password: {type: String, default: "", trim: true},
    profile: {
        username: {type: String, default: "", trim: true},
        fullname: {type: String, default: "", trim: true},
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
    return await this.create({email, password, profile: {username: name}});
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

UserSchema.static("findByToken", async function(token: string) {
    try {
        const decodedToken = jwt.verify(token, Config.get("auth.privateKey")) as any;
        let user: Document | null;

        if (!decodedToken || typeof  decodedToken !== "object") {
            return false;
        }

        if ("userId" in decodedToken) {
            user = await this.findById(decodedToken.userId);
        } else {
            return false;
        }

        if (!user) {
            return false;
        }
        return user;
    } catch (err) {
        return false;
    }
});

export default (mongoose: Mongoose) => {
    return mongoose.model("User", UserSchema);
};
