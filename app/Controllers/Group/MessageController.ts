import httpError from "http-errors";
import {Error as MongooseError} from "mongoose";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroupMessage, IGroupMessageModel} from "../../Models/GroupMessage.d";
import GroupMessageCollectionResource from "../../Resources/GroupMessageCollectionResource";
import GroupMessageResource from "../../Resources/GroupMessageResource";
import Joi from "./../../../src/Joi/Joi";

const GroupMessage = DB.getModel<IGroupMessage, IGroupMessageModel>("GroupMessage");

export default class GroupMessageController {

    public static async getCollection(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {offset} = Validator(req.query, {offset: Joi.number()});

            const messages = await GroupMessage.findConversation(groupId, offset);

            next(new GroupMessageCollectionResource(messages, {offset}));

        } catch (err) {
            next(err);
        }
    }

    public static async getOne(req: any, res: any, next: any) {
        try {
            const {groupId, messageId} = Validator(req.params, {groupId: Joi.objectId(), messageId: Joi.objectId()});

            const message = await GroupMessage.findOneForConversation(groupId, messageId);

            next(new GroupMessageResource(message));

        } catch (err) {
            if (err instanceof MongooseError.CastError || err instanceof MongooseError.DocumentNotFoundError) {
                next(new httpError.NotFound());
            } else {
                next(err);
            }
        }
    }

    public static async send(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {text} = Validator(req.body, GroupMessageController.sendMessageValidationSchema);

            const message = await GroupMessage.send(req.user, groupId, text);

            next(new GroupMessageResource(message));
        } catch (err) {
            next(err);
        }

    }

    protected static sendMessageValidationSchema = {
        text: Joi.string().max(2048).required(),
    };
}
