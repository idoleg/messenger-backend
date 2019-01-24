import { DB } from "..";
import Validator from "../../src/HttpServer/Validator";
import Joi from "../../src/Joi/Joi";
import { IAccountContact, IUserContactModel } from "../Models/AccountContact.d";
import ContactCollectionResource from "../Resources/ContactCollectionResource";
import ContactResource from "../Resources/ContactResource";

const Contact = DB.getModel<IAccountContact, IUserContactModel>("AccountContact");

export default class ContactController {
    public static async get(req: any, res: any, next: any) {
        try {

            const { offset } = Validator(req.query, { offset: Joi.number() });

            const { id } = Validator(req.user, { id: Joi.objectId() });

            const contacts = await Contact.find({ user_id: id });

            console.log(contacts);

            next(new ContactCollectionResource(contacts, {user_id: id, offset}));

        } catch (err) {
            next(err);
        }
    }

    public static async getById(req: any, res: any, next: any) {
        try {

            const { id } = Validator(req.params, ContactController.idValidationSchema);

            const contact = await Contact.findById(id);
            next(new ContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async AddAccount(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id: contactId, byname } = Validator(req.body, ContactController.postContactValidationSchema);

            const contact = await Contact.addContact(userId, contactId, byname);

            next(new ContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    protected static idValidationSchema = {
        id: Joi.objectId().required(),
    };

    protected static bynameValidationSchema = {
        byname: Joi.string().required(),
    };

    protected static postContactValidationSchema = {
        id: Joi.objectId(),
        byname: Joi.string().required(),
    };

}
