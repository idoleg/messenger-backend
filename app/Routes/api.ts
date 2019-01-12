import {Express} from "express";
import AccountController from "../Controllers/AccountController";
import MessagesController from "../Controllers/User/MessagesController";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.post("/account", AccountController.update);

    this.get("/users/:userId/messages", MessagesController.getCollection);
    this.get("/users/:userId/messages/:messageId", MessagesController.getOne);
    this.post("/users/:userId/messages", MessagesController.send);

}
