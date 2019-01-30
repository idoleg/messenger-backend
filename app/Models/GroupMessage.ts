import httpError from "http-errors";
import mongoose, { Error as MongooseError, Mongoose, Schema } from "mongoose";
import { IGroup } from "./Group.d";
import { IUser } from "./User.d";

export const GROUP_MESSAGES_LIMIT = 50;

const getRightId = (id: any) => {
    let tempId;
    if (typeof id === "string") {
        tempId = mongoose.Types.ObjectId(id);
    } else {
        tempId = id._id;
    }

    return tempId;
};

const GroupMessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
    text: { type: String, required: true },
}, {
        timestamps: { createdAt: "sent_at", updatedAt: false },
    });

GroupMessageSchema.static("send", async function(sender: string | IUser, group: string | IGroup, text: string) {
    const groupId = getRightId(group);
    const userId = getRightId(sender);

    return await this.create({ sender: userId, group: groupId, text });
});

GroupMessageSchema.static("findConversation", async function(
    group: string | IGroup,
    offset: number = 0,
    limit: number = GROUP_MESSAGES_LIMIT,
) {
    const groupId = getRightId(group);

    return await this.find({ group: groupId })
        .limit(limit)
        .skip(offset);
});

GroupMessageSchema.static("findOneForConversation", async function(
    group: string | IGroup,
    messageId: string,
) {
    const groupId = getRightId(group);

    const message = await this.findById(messageId);

    if (message && message.group.equals(groupId)) {
        return message;
    }

    throw new httpError.NotFound(
        `In group ${group} there is not message with id ${messageId}`,
    );
});

export default (mongooseVar: Mongoose) => {
    return mongooseVar.model("GroupMessage", GroupMessageSchema, "groups.messages");
};
