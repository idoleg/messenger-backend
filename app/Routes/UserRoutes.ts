import {Express} from "express";
import MessageController from "../Controllers/User/MessageController";
import UserController from "../Controllers/User/UserController";

export default function(express: Express) {

    this.get("/user/:userId/messages", MessageController.getCollection);
    this.get("/user/:userId/messages/:messageId", MessageController.getOne);
    this.post("/user/:userId/messages", MessageController.send);

    this.get("/users", UserController.getByEmail);
    this.get("/users/:userId", UserController.getById);

}
