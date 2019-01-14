import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Validator from "../../src/HttpServer/Validator";
import {Config, DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";

const User = DB.getModel<IUser, IUserModel>("User");

export default class AuthController {

    public static async login(req: any, res: any, next: any) {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await User.findOne({email});
            if (!user) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id.toString(),
                },
                Config.get("auth.privateKey"),
                {expiresIn: Config.get("auth.expiresTime")},
            );
            res.status(200).json({token, userId: user._id.toString()});
        } catch (err) {
            next(err);
        }
    }

    public static async registration(req: any, res: any, next: any) {
        try {
            const {email, name, password} = Validator(req.body, AuthController.validationSchema);
            const user = await User.findOne({email});
            if (user) {
                throw new httpError.Conflict("This email has already existed");
            }
            const result = await User.registration(email, password, name);
            const token = jwt.sign(
                {
                    email: result.email,
                    userId: result._id.toString(),
                },
                Config.get("auth.privateKey"),
                {expiresIn: Config.get("auth.expiresTime")},
            );
            res.status(201).json({token, userId: result._id});
        } catch (err) {
            next(err);
        }
    }

    protected static validationSchema = {
        email: Joi.string().required().email(),
        name: Joi.string().required().min(2).max(32),
        password: Joi.string().required().min(8).max(32),
    };
}
