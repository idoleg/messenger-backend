import {Express} from "express";
import MessagesController from "../Controllers/User/MessagesController";

export default function(express: Express) {

    this.get("/users/:userId/messages", MessagesController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessagesController.getOne);
    this.post("/users/:userId/messages", MessagesController.send);

}
