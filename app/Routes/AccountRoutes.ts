import {Express} from "express";
import AccountController from "../Controllers/AccountController";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.put("/account", AccountController.update);

}
