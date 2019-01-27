import {Mongoose, Schema, Error as MongooseError} from "mongoose";
import {IUser} from "./User.d";
import {IGroup} from "./Group.d";

export const GROUP_MESSAGES_LIMIT = 50;

const GroupMessageSchema = new Schema({
    sender: {type: String, required: true},
    group: {type: String, required: true},
    text: {type: String, required: true},
}, {
    timestamps: {createdAt: "sent_at", updatedAt: false},
});

GroupMessageSchema.static("send", async function(sender: string | IUser, group: string | IGroup, text: string) {
    if (typeof sender !== "string") sender = sender._id.toString();
    if (typeof group !== "string") group = group._id.toString();

    return await this.create({sender, group, text});
});

GroupMessageSchema.static("findConversation", async function(
    group: string | IGroup,
    offset: number = 0,
    limit: number = GROUP_MESSAGES_LIMIT,
) {
    if (typeof group !== "string") group = group._id.toString();

    return await this.find({group})
        .limit(limit)
        .skip(offset);
});

GroupMessageSchema.static("findOneForConversation", async function(
    group: string | IGroup,
    messageId: string,
) {
    if (typeof group !== "string") group = group._id.toString();

    const message = await this.findById(messageId);

    if (message && message.group === group) {
        return message;
    }

    throw new MongooseError.DocumentNotFoundError(
        `In group ${group} there is not message with id ${messageId}`,
    );
});

export default (mongoose: Mongoose) => {
    return mongoose.model("GroupMessage", GroupMessageSchema, "groups.messages");
};
