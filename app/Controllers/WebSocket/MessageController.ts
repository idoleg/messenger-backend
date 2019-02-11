import { DB, Socket } from "../../index";
import { IGroupMember, IGroupMemberModel } from "../../Models/GroupMember.d";
import { IGroupMessage, IGroupMessageModel } from "../../Models/GroupMessage.d";
import { IUserChat, IUserChatModel } from "../../Models/UserChat.d";
import { IUserMessage, IUserMessageModel } from "../../Models/UserMessage.d";

const UserMessages = DB.getModel<IUserMessage, IUserMessageModel>("UserMessage");
const GroupMessages = DB.getModel<IGroupMessage, IGroupMessageModel>("GroupMessage");
const GroupMembers = DB.getModel<IGroupMember, IGroupMemberModel>("GroupMember");
const UserChats = DB.getModel<IUserChat, IUserChatModel>("UserChat");

export default class MessageWSController {

    public static async receive(payload: any, client: any, result: any) {
        try {
            const { text, group, recipient } = payload;
            let newMessage = {sent_at: new Date()};
            const messagePayload = {
                id: 1,
                type: group ? "group" : "direct",
                sender: client.user.model.id,
                recipient,
                group,
                text,
                read: false,
                sent_at: newMessage.sent_at,
            };

            if (group && await GroupMembers.isMember(group, client.user.model)) {
                newMessage = await GroupMessages.send(client.user.model, group, text);
                messagePayload.sent_at = newMessage.sent_at;
                const members = await GroupMembers.getAllMembers(group);
                await members.forEach(async (el) => {
                    const id = el.member.toString();
                    const chat = await UserChats.findChatByUserGroupId(id, group);
                    if (chat) {
                        await UserChats.updateChat(id, group, client.user.model, text);
                    } else {
                        await UserChats.addChat(id, true, group, client.user.model, text);
                    }
                    if ((!el.member.equals(client.user.model._id)) && Socket.rooms.has(`user:${id}`)) {
                        const room = Socket.rooms.get(`user:${id}`);
                        if (room) {
                            room.emit("message:new", messagePayload);
                        }
                    }
                });
            } else if (recipient) {
                newMessage = await UserMessages.send(client.user.model, recipient, text);
                messagePayload.sent_at = newMessage.sent_at;
                const chat = await UserChats.findChatByUserGroupId(client.user.model, recipient);
                if (chat) {
                    await UserChats.updateChat(client.user.model, recipient, client.user.model, text);
                } else {
                    await UserChats.addChat(client.user.model, false, recipient, client.user.model, text);
                }
                const room = Socket.rooms.get(`user:${recipient}`);
                if (room) {
                    room.emit("message:new", messagePayload);
                }
            } else {
                result(false, { error: "Credentials are wrong" });
            }

            result(true, { message: payload, sent_at: newMessage.sent_at });
        } catch (err) {
            result(false, { error: err });
        }
    }

}
