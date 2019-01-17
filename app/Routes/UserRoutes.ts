import {Express} from "express";
import MessageController from "../Controllers/User/MessageController";
import GetUserController from "../Controllers/User/UserContoller";

export default function(express: Express) {

    this.get("/users/:userId/messages", MessageController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessageController.getOne);
    this.post("/users/:userId/messages", MessageController.send);
    this.get("/users", GetUserController.getByEmail);
    this.get("/users/:userId", GetUserController.getUserById);

}
