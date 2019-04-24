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
                sent_at: newMessage.sent_at.getTime(),
            };

            if (group && await GroupMembers.isMember(group, client.user.model)) {
                newMessage = await GroupMessages.send(client.user.model, group, text);
                messagePayload.sent_at = newMessage.sent_at.getTime();
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
                            room.emit("messages:new", messagePayload);
                        }
                    }
                });
            } else if (recipient) {
                newMessage = await UserMessages.send(client.user.model, recipient, text);
                messagePayload.sent_at = newMessage.sent_at.getTime();
                const chat = await UserChats.findChatByUserGroupId(client.user.model, recipient);
                if (chat) {
                    await UserChats.updateChat(client.user.model, recipient, client.user.model, text);
                } else {
                    await UserChats.addChat(client.user.model, false, recipient, client.user.model, text);
                }
                const room = Socket.rooms.get(`user:${recipient}`);
                if (room) {
                    room.emit("messages:new", messagePayload);
                }
            } else {
                return result(false, { error: "Credentials are wrong" });
            }

            result(true, { message: payload, sent_at: newMessage.sent_at.getTime() });
        } catch (err) {
            result(false, { error: err });
        }
    }

    public static async read(payload: any, client: any, result: any) {
        try {
            const { id, sender } = payload;
            const recipient = client.user.model._id.toString();

            if (id && await GroupMembers.isMember(id, client.user.model)) {
                const members = await GroupMembers.getAllMembers(id);
                await members.forEach(async (el) => {
                    const memberId = el.member.toString();
                    await UserChats.resetChatUnread(memberId, id);
                    if ((!el.member.equals(client.user.model._id)) && Socket.rooms.has(`user:${memberId}`)) {
                        const room = Socket.rooms.get(`user:${memberId}`);
                        if (room) {
                            room.emit("messages:read", { id, recipient });
                        }
                    }
                });
            } else if (sender) {
                await UserChats.resetChatUnread(sender, id);
                const room = Socket.rooms.get(`user:${sender}`);
                if (room) {
                    room.emit("messages:read", { id, recipient });
                }
            } else {
                return result(false, { error: "Credentials are wrong" });
            }

            result(true, { message: payload });
        } catch (err) {
            result(false, { error: err });
        }
    }

    public static async typing(payload: any, client: any, result: any) {
        try {
            const { status, group, recipient } = payload;
            const sender = client.user.model._id.toString();

            if (group && await GroupMembers.isMember(group, client.user.model)) {
                const members = await GroupMembers.getAllMembers(group);
                await members.forEach(async (el) => {
                    const id = el.member.toString();
                    if ((!el.member.equals(sender)) && Socket.rooms.has(`user:${id}`)) {
                        const room = Socket.rooms.get(`user:${id}`);
                        if (room) {
                            room.emit("chat:typing", { status, group, sender });
                        }
                    }
                });
            } else if (recipient) {
                const room = Socket.rooms.get(`user:${recipient}`);
                if (room) {
                    room.emit("chat:typing", { status, sender });
                }
            } else {
                return result(false, { error: "Credentials are wrong" });
            }

            result(true, { message: payload, sent_at: new Date() });
        } catch (err) {
            result(false, { error: err });
        }
    }
}
