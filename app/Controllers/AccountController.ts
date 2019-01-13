import Joi from "joi";
import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Validator from "../../src/HttpServer/Validator";
import { DB } from "../index";

const User = DB.getModel("User");

export default class AccountController {

    public static get(req: any, res: any, next: any) {
        try {
            res.status(200).json({
                id: req.user._id.toString(),
                email: req.user.email,
                profile: {
                    name: req.user.profile.name,
                    last_name: req.user.profile.last_name,
                    last_seen: req.user.profile.last_seen,
                }
            });
        } catch (err) {
            next(err)
        }
    }

    public static async update(req: any, res: any, next: any) {
        try {
            if (req.body.name) {
                const reqName = Validator({name: req.body.name}, AccountController.validationNameSchema);
                req.user.profile = { ...req.user.profile, name: reqName.name };
            }
            if (req.body.oldPassword && req.body.newPassword) {
                const isEqual = await bcrypt.compare(req.body.oldPassword, req.user.password);
                if (!isEqual) {
                    throw new httpError.NotFound("Credentials are wrong");
                }
                const { newPassword } = Validator({newPassword: req.body.newPassword}, AccountController.validationPasswordSchema);
                const hashedPw = await bcrypt.hash(newPassword, 12);
                req.user.password = hashedPw;
            }
            await req.user.save();
            res.status(200).json({
                id: req.user._id.toString(),
                email: req.user.email,
                profile: {
                    name: req.user.profile.name,
                    last_name: req.user.profile.last_name,
                    last_seen: req.user.profile.last_seen,
                }
            });
        } catch (err) {
            next(err);
        }
    }

    protected static validationNameSchema = {
        name: Joi.string().required().min(2).max(32),
    }

    protected static validationPasswordSchema = {
        newPassword: Joi.string().required().min(8).max(32),
    }
}
