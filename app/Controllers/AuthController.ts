import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Validator from "../../src/HttpServer/Validator";
import {Config, DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";
import UserResource from "../Resources/UserResource";

const User = DB.getModel<IUser, IUserModel>("User");

export default class AuthController {

    public static async login(req: any, res: any, next: any) {
        try {
            const {email, password} = Validator(req.body, AuthController.loginValidationSchema);
            const user = await User.findOne({email});

            if (!user) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const token = user.createToken();

            res.status(200).json({token, user: (new UserResource(user)).attach(req, res).uncover()});
        } catch (err) {
            next(err);
        }
    }

    public static async registration(req: any, res: any, next: any) {
        try {
            const {email, name, password} = Validator(req.body, AuthController.registrationValidationSchema);

            if (await User.findOne({email})) {
                throw new httpError.Conflict("This email has already existed");
            }
            const user = await User.registration(email, password, name);
            const token = user.createToken();

            res.status(201).json({token, user: (new UserResource(user)).attach(req, res).uncover()});
        } catch (err) {
            next(err);
        }
    }

    protected static loginValidationSchema = {
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    };

    protected static registrationValidationSchema = {
        email: Joi.string().required().email(),
        name: Joi.string().required().min(2).max(32),
        password: Joi.string().required().min(8).max(32),
    };
}
