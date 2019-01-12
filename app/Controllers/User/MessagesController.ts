import httpError from "http-errors";
import Joi from "joi";
import {Error as MongooseError} from "mongoose";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IUserMessage, IUserMessageModel} from "../../Models/UserMessage.d";
import MessageCollectionResource from "../../Resources/MessageCollectionResource";
import MessageResource from "../../Resources/MessageResource";

const UserMessage = DB.getModel<IUserMessage, IUserMessageModel>("UserMessage");

export default class MessagesController {

    public static async getCollection(req: any, res: any, next: any) {
        try {
            const {userId} = req.params;

            const messages = await UserMessage.findConversation("currentUser", userId);

            next(new MessageCollectionResource(messages, {offset: 0}));

        } catch (e) {
            next(e);
        }
    }

    public static async getOne(req: any, res: any, next: any) {
        try {
            const {userId, messageId} = req.params;

            const message = await UserMessage.findOneForConversation("currentUser", userId, messageId);

            next(new MessageResource(message));

        } catch (e) {
            if (e instanceof MongooseError.CastError || e instanceof MongooseError.DocumentNotFoundError) {
                next(new httpError.NotFound());
            } else {
                next(e);
            }
        }
    }

    public static async send(req: any, res: any, next: any) {
        try {
            const {userId} = req.params;
            const {text} = Validator(req.body, MessagesController.sendMessageValidationSchema);

            const message = await UserMessage.send("currentUser", userId, text);

            next(new MessageResource(message));
        } catch (e) {
            next(e);
        }

    }

    protected static sendMessageValidationSchema = {
        text: Joi.string().max(2048).required(),
    };
}
