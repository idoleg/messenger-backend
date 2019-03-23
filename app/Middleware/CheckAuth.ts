import httpError from "http-errors";
import {DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";

const User = DB.getModel<IUser, IUserModel>("User");

export default class CheckAuth {
    public static async isAuth(req: any, res: any, next: any) {
        try {
            if (req.method === "OPTIONS"
                ||
                (req.method === "POST"
                &&
                (req.url === "/auth/login" || req.url === "/auth/registration" || req.url === "/socket"))) {
                return next();
            }
            const authHeader = req.get("Authorization");
            if (!authHeader || authHeader.split(" ")[0].toLowerCase() !== "bearer") {
                throw new httpError.Unauthorized("No valid token");
            }
            const token = authHeader.split(" ")[1];
            const user = await User.findByToken(token);
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
