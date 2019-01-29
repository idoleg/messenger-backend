import {Express} from "express";
import MessageController from "../Controllers/User/MessageController";
import UserController from "../Controllers/User/UserContoller";

export default function(express: Express) {

    this.get("/users/:userId/messages", MessageController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessageController.getOne);
    this.post("/users/:userId/messages", MessageController.send);

    this.get("/users", UserController.getByEmail);
    this.get("/users/:userId", UserController.getById);

}
