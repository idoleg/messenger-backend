import {Express} from "express";
import AccountController from "../Controllers/Account/AccountController";
import BlacklistController from "../Controllers/Account/BlacklistController";
import ContactController from "../Controllers/Account/ContactController";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.put("/account", AccountController.update);

    this.get("/account/contacts", ContactController.get);
    this.get("/account/contacts/:id", ContactController.getById);
    this.put("/account/contacts/:id", ContactController.update);
    this.delete("/account/contacts/:id", ContactController.delete);
    this.post("/account/contacts/", ContactController.add);

    this.get("/account/blacklist/", BlacklistController.get);
    this.post("/account/blacklist/", BlacklistController.add);
    this.delete("/account/blacklist/:id", BlacklistController.delete);
}
