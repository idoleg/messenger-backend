import { DB } from "../..";
import Validator from "../../../src/HttpServer/Validator";
import Joi from "../../../src/Joi/Joi";
import { IUserBlacklist, IUserBlacklistModel } from "../../Models/UserBlacklist.d";
import BlacklistCollectionResource from "../../Resources/BlacklistCollectionResource";
import BlacklistResource from "../../Resources/BlacklistResource";

const Blacklist = DB.getModel<IUserBlacklist, IUserBlacklistModel>("UserBlacklist");

export default class ContactController {
    public static async get(req: any, res: any, next: any) {
        try {

            const { offset } = Validator(req.query, { offset: Joi.number() });
            const { id } = req.user;

            const contacts = await Blacklist.find({ user: id });

            next(new BlacklistCollectionResource(contacts, { user: id, offset }));

        } catch (err) {
            next(err);
        }
    }

    public static async add(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id: bannedId } = Validator(req.body, { id: Joi.objectId() });

            const contact = await Blacklist.addToBlacklist(userId, bannedId);

            next(new BlacklistResource(contact));

        } catch (err) {
            next(err);
        }
    }

    public static async delete(req: any, res: any, next: any) {
        try {

            const { id: userId } = req.user;

            const { id } = Validator(req.params, { id: Joi.objectId() });

            await Blacklist.removeFromBlacklist(id, userId);

            res.json({ message: "successfully" });

        } catch (err) {
            next(err);
        }
    }

}
