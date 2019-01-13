import jwt from "jsonwebtoken";
import httpError from "http-errors";
import { DB, Config } from "../index";
const User = DB.getModel("User");

export default class CheckAuth {
    public static async isAuth(req: any, res: any, next: any) {
        try {
            if (req.url === "/auth/login" || req.url === "/auth/registration" || req.url === "/socket") {
                return next();
            }
            const authHeader = req.get('Authorization');
            if (!authHeader || authHeader.split(' ')[0] !== 'Bearer') {
                throw new httpError.NotFound("No token");
            }
            const token = authHeader.split(' ')[1];
            let decodedToken;
            try {
                decodedToken = jwt.verify(token, Config.get("auth.privateKey"));
            } catch(err) {
                throw new httpError.NotFound("No valid token");
            }

            if (!decodedToken) {
                throw new httpError.Unauthorized("No valid token");
            }
            const user = await User.findById(decodedToken.userId);
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
