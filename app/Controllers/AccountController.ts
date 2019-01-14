import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Joi from "joi";
import Validator from "../../src/HttpServer/Validator";
import {DB} from "../index";
import UserResource from "../Resources/UserResource";

const User = DB.getModel("User");

export default class AccountController {

    public static get(req: any, res: any, next: any) {
        try {
            next(new UserResource(req.user));
        } catch (err) {
            next(err);
        }
    }

    public static async update(req: any, res: any, next: any) {
        try {
            if (req.body.name) {
                const reqName = Validator({name: req.body.name}, AccountController.validationNameSchema);
                req.user.profile = {...req.user.profile, name: reqName.name};
            }
            if (req.body.oldPassword && req.body.newPassword) {
                const isEqual = await bcrypt.compare(req.body.oldPassword, req.user.password);
                if (!isEqual) {
                    throw new httpError.NotFound("Credentials are wrong");
                }
                const {newPassword} = Validator({newPassword: req.body.newPassword}, AccountController.validationPasswordSchema);
                const hashedPw = await bcrypt.hash(newPassword, 12);
                req.user.password = hashedPw;
            }
            await req.user.save();
            next(new UserResource(req.user));
        } catch (err) {
            next(err);
        }
    }

    protected static validationNameSchema = {
        name: Joi.string().required().min(2).max(32),
    };

    protected static validationPasswordSchema = {
        newPassword: Joi.string().required().min(8).max(32),
    };
}
