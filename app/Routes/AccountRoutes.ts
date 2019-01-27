import {Express} from "express";
import AccountController from "../Controllers/AccountController";
import BlacklistController from "../Controllers/BlacklistController";
import ContactController from "../Controllers/ContactController";

export default function(express: Express) {

    this.get("/account", AccountController.get);
    this.put("/account", AccountController.update);

    this.get("/account/contacts", ContactController.get);
    this.get("/account/contacts/:id", ContactController.getById);
    this.put("/account/contacts/:id", ContactController.updateContact);
    this.delete("/account/contacts/:id", ContactController.deleteContact);
    this.post("/account/contacts/", ContactController.AddAccount);

    this.get("/account/blacklist/", BlacklistController.getBlacklist);
    this.post("/account/blacklist/", BlacklistController.addToBlacklist);
    this.delete("/account/blacklist/:id", BlacklistController.deleteFromBlacklist);
}
