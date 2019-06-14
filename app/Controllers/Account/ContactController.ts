import httpError from "http-errors";
import { DB } from "../..";
import Validator from "../../../src/HttpServer/Validator";
import Joi from "../../../src/Joi/Joi";
import { IUserContact, IUserContactModel } from "../../Models/UserContact.d";
import ContactCollectionResource from "../../Resources/ContactCollectionResource";
import ContactResource from "../../Resources/ContactResource";

const Contact = DB.getModel<IUserContact, IUserContactModel>("UserContact");

export default class ContactController {
    public static async get(req: any, res: any, next: any) {
        try {

            const { offset } = Validator(req.query, { offset: Joi.number() });
            const { id } = req.user;

            const contacts = await Contact.get(id, offset);

            next(new ContactCollectionResource(contacts, {user: id, offset}));

        } catch (err) {
            next(err);
        }
    }

    public static async getById(req: any, res: any, next: any) {
        try {

            const userId = req.user._id;

            const { id } = Validator(req.params, { id: Joi.objectId() });

            const contact = await Contact.findById(id);

            if (!contact || !contact.user.equals(userId)) throw new httpError.NotFound("Contact with such id was not found");

            next(new ContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async add(req: any, res: any, next: any) {
        try {
            const { id: userId } = req.user;

            const { user: contactId, byname } = Validator(req.body, ContactController.postContactValidationSchema);

            const contact = await Contact.addContact(userId, contactId, byname);

            next(new ContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async update(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id } = Validator(req.params, { id: Joi.objectId() });

            const { byname } = Validator(req.body, { byname: Joi.string().required() });

            const contact = await Contact.updateContact(id, userId, byname);

            if (!contact) throw new httpError.NotFound("Contact with such id was not found");

            next(new ContactResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async delete(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id } = Validator(req.params, { id: Joi.objectId() });

            await Contact.deleteContact(id, userId);

            res.json({message: "successfully"});

        } catch (err) {
            next(err);
        }
    }

    protected static postContactValidationSchema = {
        user: Joi.objectId().required(),
        byname: Joi.string(),
    };
}
