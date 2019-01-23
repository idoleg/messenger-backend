import { DB } from "..";
import Validator from "../../src/HttpServer/Validator";
import Joi from "../../src/Joi/Joi";
import { IUserContact, IUserContactModel } from "../Models/AccountContact.d";
import UserContactResource from "../Resources/UserContactResource";

const Contact = DB.getModel<IUserContact, IUserContactModel>("UserContact");

export default class ContactController {
    public static async get(req: any, res: any, next: any) {
        try {

            const userId = req.user._id;

            const contacts = await Contact.find({ user_id: userId });

            next(contacts.map((contact) => new UserContactResource(contact)));

        } catch (err) {
            next(err);
        }
    }

    public static async getById(req: any, res: any, next: any) {
        try {

            const userId = req.user._id;

            const id = Validator(req.params, ContactController.idValidationSchema);

            const contact = await Contact.find({ _id: id,  user_id: userId });

            next(new UserContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async AddAccount(req: any, res: any, next: any) {
        try {
            const { id } = Validator(req.body, ContactController.idValidationSchema);
            const { byname } = Validator(req.body, ContactController.bynameValidationSchema);
        } catch (err) {
            next(err);
        }
    }

    protected static idValidationSchema = {
        id: Joi.objectId(),
    };

    protected static bynameValidationSchema = {
        byname: Joi.string().required(),
    };

}
