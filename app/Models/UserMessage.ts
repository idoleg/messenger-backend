import {DocumentNotFoundError, Mongoose, Schema} from "mongoose";
import {Error as MongooseError} from "mongoose";

export const MESSAGES_LIMIT = 50;

const UserMessageSchema = new Schema({
    sender: {type: String, required: true},
    recipient: {type: String, required: true},
    text: {type: String, required: true},
    read: {type: Boolean, default: false},
}, {
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

UserMessageSchema.static("send", async function(sender: string, recipient: string, text: string) {
    return await this.create({sender, recipient, text});
});

UserMessageSchema.static("findConversation", async function(
    firstPerson: string,
    secondPerson: string,
    offset: number = 0,
    limit: number = MESSAGES_LIMIT) {
    return await this.find(
        {
            $or: [
                {sender: firstPerson, recipient: secondPerson},
                {sender: secondPerson, recipient: firstPerson},
            ],
        })
        .limit(limit).skip(offset);
});

UserMessageSchema.static("findOneForConversation", async function(firstPerson: string, secondPerson: string, messageId: string) {
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
