import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {Mongoose, Schema} from "mongoose";
import {Config} from "../index";
import {Document} from "mongoose";

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

UserSchema.static("findByToken", async function(authHeader: string) {
    if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
        return null;
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, Config.get("auth.privateKey")) as any;
    let user: Document | null;

    if (!decodedToken || typeof  decodedToken !== "object") {
        return null;
    }

    if ("userId" in decodedToken) {
        user = await this.findById(decodedToken.userId);
    } else {
        return null;
    }

    if (!user) {
        return null;
    }
    return user;
});

export default (mongoose: Mongoose) => {
    return mongoose.model("User", UserSchema);
};
