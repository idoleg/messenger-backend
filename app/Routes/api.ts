import {Express} from "express";
import AccountController from "../Controllers/AccountController";
import AuthController from "../Controllers/AuthController";
import MessagesController from "../Controllers/User/MessagesController";

export default function(express: Express) {

    this.post("/auth/login", AuthController.login);
    this.post("/auth/registration", AuthController.registration);

    this.get("/account", AccountController.get);
    this.post("/account", AccountController.update);

    this.get("/users/:userId/messages", MessagesController.get);
    this.post("/users/:userId/messages", MessagesController.send);

}
