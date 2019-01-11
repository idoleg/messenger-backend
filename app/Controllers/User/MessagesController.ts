import Joi from "joi";
import Validator from "../../../src/HttpServer/Validator";

export default class MessagesController {

    public static get(req: any, res: any, next: any) {
        const {userId} = req.params;
        res.send("it's get:/users/messages" + userId);
        next();
    }

    public static send(req: any, res: any, next: any) {

        const {userId} = req.params;
        const {recipient, text} = Validator(req.body, MessagesController.sendMessageValidationSchema);

        res.json({userId, recipient, text});
        next();

    }

    protected static sendMessageValidationSchema = {
        recipient: Joi.string().required(),
        text: Joi.string().max(2048).required(),
    };
}
