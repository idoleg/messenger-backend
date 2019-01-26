import httpError from "http-errors";
import jwt from "jsonwebtoken";
import {Document} from "mongoose";
import {Config, DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";

const User = DB.getModel<IUser, IUserModel>("User");

export default class CheckAuth {
    public static async isAuth(req: any, res: any, next: any) {
        try {
            let user: Document | null;
            if (req.method === 'OPTIONS' || req.url === "/auth/login" || req.url === "/auth/registration" || req.url === "/socket") {
                return next();
            }
            const authHeader = req.get("Authorization");
            if (!authHeader || authHeader.split(" ")[0] !== "Bearer") {
                throw new httpError.Unauthorized("No valid token");
            }
            const token = authHeader.split(" ")[1];
            const decodedToken = jwt.verify(token, Config.get("auth.privateKey")) as any;

            if (!decodedToken || typeof  decodedToken !== "object") {
                throw new httpError.Unauthorized("No valid token");
            }

            if ("userId" in decodedToken) {
                user = await User.findById(decodedToken.userId);
            } else {
                throw new httpError.Unauthorized("No valid token");
            }

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
