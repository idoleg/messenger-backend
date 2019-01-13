import {Express} from "express";
import AccountController from "../Controllers/AccountController";
// import CheckAuth from "../Middleware/CheckAuth";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.post("/account", AccountController.update);

}
