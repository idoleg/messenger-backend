import mongoose, {Mongoose, Schema} from "mongoose";
import {Error as MongooseError} from "mongoose";
import {IUser} from "./User.d";

export const MESSAGES_LIMIT = 50;

const getRightId = (id: any) => {
    let tempId;
    if (typeof id === "string") {
        tempId = mongoose.Types.ObjectId(id);
    } else {
        tempId = id._id;
    }

    return tempId;
};

const UserMessageSchema = new Schema({
    sender: {type: Schema.Types.ObjectId, ref: "User", required: true},
    recipient: {type: Schema.Types.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    read: {type: Boolean, default: false},
}, {
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

UserMessageSchema.static("send", async function(sender: string | IUser, recipient: string | IUser, text: string) {
    const senderId = getRightId(sender);
    const recipientId = getRightId(recipient);

    return await this.create({sender: senderId, recipient: recipientId, text});
});

UserMessageSchema.static("findConversation", async function(
    firstPerson: string | IUser,
    secondPerson: string | IUser,
    offset: number = 0,
    limit: number = MESSAGES_LIMIT,
) {
    const firstPersonId = getRightId(firstPerson);
    const secondPersonId = getRightId(secondPerson);

    return await this.find(
        {
            $or: [
                {sender: firstPersonId, recipient: secondPersonId},
                {sender: secondPersonId, recipient: firstPersonId},
            ],
        })
        .limit(limit).skip(offset);
});

UserMessageSchema.static("findOneForConversation", async function(
    firstPerson: string | IUser,
    secondPerson: string | IUser,
    messageId: string,
) {
    const firstPersonId = getRightId(firstPerson);
    const secondPersonId = getRightId(secondPerson);

    const message = await this.findById(messageId);

    if (
        message && (
        (message.sender.equals(firstPersonId) && message.recipient.equals(secondPersonId))
        || (message.sender.equals(secondPersonId) && message.recipient.equals(firstPersonId)))
    ) {
        return message;
    }

    throw new MongooseError.DocumentNotFoundError(
        `Between users ${firstPerson} and ${secondPerson} there is not message with id ${messageId}`,
    );
});

export default (mongooseVar: Mongoose) => {
    return mongooseVar.model("UserMessage", UserMessageSchema, "users.messages");
};
