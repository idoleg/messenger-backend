import Validator from "../../../src/HttpServer/Validator";
import Joi from "../../../src/Joi/Joi";
import {DB} from "../../index";
import { IUser, IUserModel } from "../../Models/User.d";
import UserProfileResource from "../../Resources/UserProfileResource";

const User = DB.getModel<IUser, IUserModel>("User");

export default class UserContoller {

    public static async getByEmail(req: any, res: any, next: any) {
        try {
            const { email } = Validator(req.query, UserContoller.emailValidationSchema);
            const userAccount = await User.getByEmail(email);

            next(new UserProfileResource(userAccount.profile));
        } catch (e) {
            next(e);
        }
    }

    public static async getUserById(req: any, res: any, next: any) {
        try {
            const { userId } = Validator(req.params, UserContoller.idValidationSchema);

            const userAccount: any = await User.findById(userId);

            next(new UserProfileResource(userAccount.profile));
        } catch (e) {
            next(e);
        }
    }

    protected static emailValidationSchema = {
        email: Joi.string().email(),
    };

    protected static idValidationSchema = {
        userId: Joi.objectId(),
    };
}
