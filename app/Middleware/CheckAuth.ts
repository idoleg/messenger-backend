import httpError from "http-errors";
import jwt from "jsonwebtoken";
import {Document} from "mongoose";
import {Config, DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";

const User = DB.getModel<IUser, IUserModel>("User");

export default class CheckAuth {
    public static async isAuth(req: any, res: any, next: any) {
        try {
            if (req.method === "OPTIONS" || req.url === "/auth/login" || req.url === "/auth/registration" || req.url === "/socket") {
                return next();
            }
            const authHeader = req.get("Authorization");
            const user = await User.findByToken(authHeader);
            if (!user) {
                throw new httpError.Unauthorized("No valid token");
            }
            req.user = user;
            next();
        } catch (err) {
            next(err);
        }
    }
}
