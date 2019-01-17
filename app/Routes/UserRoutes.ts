import {Express} from "express";
import MessageController from "../Controllers/User/MessageController";
import MessagesController from "../Controllers/User/MessagesController";
import GetUserController from "../Controllers/User/GetUserContoller";

export default function(express: Express) {

    this.get("/users/:userId/messages", MessageController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessageController.getOne);
    this.post("/users/:userId/messages", MessageController.send);
    this.get("/users/:email", GetUserController.getUserByEmail);
    this.get("/users/:id", GetUserController.getUserById);
    this.post("/users/:userId/messages", MessagesController.send);

}
