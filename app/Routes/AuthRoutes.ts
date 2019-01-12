import {Express} from "express";
import AuthController from "../Controllers/AuthController";

export default function(express: Express) {

    this.post("/auth/login", AuthController.login);
    this.post("/auth/registration", AuthController.registration);

}
