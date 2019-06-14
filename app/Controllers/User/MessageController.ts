import httpError from "http-errors";
import {Error as MongooseError} from "mongoose";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IUserMessage, IUserMessageModel} from "../../Models/UserMessage.d";
import MessageCollectionResource from "../../Resources/MessageCollectionResource";
import MessageResource from "../../Resources/MessageResource";
import Joi from "./../../../src/Joi/Joi";

const UserMessage = DB.getModel<IUserMessage, IUserMessageModel>("UserMessage");

export default class MessageController {

    public static async getCollection(req: any, res: any, next: any) {
        try {
            const {userId} = Validator(req.params, {userId: Joi.objectId()});
            const {offset} = Validator(req.query, {offset: Joi.number()});

            const messages = await UserMessage.findConversation(req.user, userId, offset);

            next(new MessageCollectionResource(messages, {offset}));

        } catch (err) {
            next(err);
        }
    }

    public static async getOne(req: any, res: any, next: any) {
        try {
            const {userId, messageId} = Validator(req.params, {userId: Joi.objectId(), messageId: Joi.objectId()});

            const message = await UserMessage.findOneForConversation(req.user, userId, messageId);

            next(new MessageResource(message));

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
            const {userId} = Validator(req.params, {userId: Joi.objectId()});
            const {text} = Validator(req.body, MessageController.sendMessageValidationSchema);

            const message = await UserMessage.send(req.user, userId, text);

            next(new MessageResource(message));
        } catch (err) {
            next(err);
        }

    }

    protected static sendMessageValidationSchema = {
        text: Joi.string().max(2048).required(),
    };
}
