import { Express } from "express";
import UserChatController from "../Controllers/ChatsController";

export default function(express: Express) {

    this.get("/account/chats", UserChatController.getChats);
    // this.get("/account/chats/:chatId", UserChatController.getChat);
    // this.get("/account/chat", UserChatController.getChatByuserGroupId);
    // this.post("/account/chats", UserChatController.addChat);
    // this.put("/account/chats", UserChatController.updateChat);
    this.delete("/account/chats/:chatId", UserChatController.deleteChat);

}
