import {Mongoose, Schema} from "mongoose";
import {Error as MongooseError} from "mongoose";
import {IUser} from "./User.d";

export const MESSAGES_LIMIT = 50;

const UserMessageSchema = new Schema({
    sender: {type: String, required: true},
    recipient: {type: String, required: true},
    text: {type: String, required: true},
    read: {type: Boolean, default: false},
}, {
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

UserMessageSchema.static("send", async function(sender: string | IUser, recipient: string | IUser, text: string) {
    if (typeof sender !== "string") sender = sender._id.toString();
    if (typeof recipient !== "string") recipient = recipient._id.toString();

    return await this.create({sender, recipient, text});
});

UserMessageSchema.static("findConversation", async function(
    firstPerson: string | IUser,
    secondPerson: string | IUser,
    offset: number = 0,
    limit: number = MESSAGES_LIMIT,
) {
    if (typeof firstPerson !== "string") firstPerson = firstPerson._id.toString();
    if (typeof secondPerson !== "string") secondPerson = secondPerson._id.toString();

    return await this.find(
        {
            $or: [
                {sender: firstPerson, recipient: secondPerson},
                {sender: secondPerson, recipient: firstPerson},
            ],
        })
        .limit(limit).skip(offset);
});

UserMessageSchema.static("findOneForConversation", async function(
    firstPerson: string | IUser,
    secondPerson: string | IUser,
    messageId: string,
) {
    if (typeof firstPerson !== "string") firstPerson = firstPerson._id.toString();
    if (typeof secondPerson !== "string") secondPerson = secondPerson._id.toString();

    const message = await this.findById(messageId);

    if (
        message && (
        (message.sender === firstPerson && message.recipient === secondPerson)
        || (message.sender === secondPerson && message.recipient === firstPerson))
    ) {
        return message;
    }

    throw new MongooseError.DocumentNotFoundError(
        `Between users ${firstPerson} and ${secondPerson} there is not message with id ${messageId}`,
    );
});

export default (mongoose: Mongoose) => {
    return mongoose.model("UserMessage", UserMessageSchema, "users.messages");
};
