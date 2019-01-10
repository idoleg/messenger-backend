import {Express} from "express";
import AccountController from "../Controllers/AccountController";
import AuthController from "../Controllers/AuthController";

export default function(express: Express) {

    this.post("/auth/login", AuthController.login);
    this.post("/auth/registration", AuthController.registration);

    this.get("/account", AccountController.get);
    this.post("/account", AccountController.update);

}
