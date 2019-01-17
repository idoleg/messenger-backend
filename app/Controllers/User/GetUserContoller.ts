import Joi from "joi";
import { Error as MongoseError } from "mongoose";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import { IUser, IUserModel } from "../../Models/User.d";
import UserResource from "../../Resources/UserResource";

const User = DB.getModel<IUser, IUserModel>("User");

export default class GetUserContoller {

    public static async getUserByEmail(req: any, res: any, next: any) {
        try {
            const { email } = Validator(req.query, GetUserContoller.emailValidationSchema);
            const userAccount = await User.getUserByEmail(email);

            next(new UserResource(userAccount));
        } catch (e) {
            next(e);
        }
    }

    public static async getUserById(req: any, res: any, next: any) {
        try {
            const { id } = Validator(req.params, GetUserContoller.idValidationSchema);

            const userAccount = await User.getUserById(id);

            next(new UserResource(userAccount));
        } catch (e) {
            next(e);
        }
    }

    protected static emailValidationSchema = {
        email: Joi.string().email(),
    };

    protected static idValidationSchema = {
        id: Joi.required(),
    };
}
