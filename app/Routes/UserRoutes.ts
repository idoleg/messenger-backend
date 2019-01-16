import {Express} from "express";
import MessageController from "../Controllers/User/MessageController";

export default function(express: Express) {

    this.get("/users/:userId/messages", MessageController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessageController.getOne);
    this.post("/users/:userId/messages", MessageController.send);

}
