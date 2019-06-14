import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import ContactResource from "./ContactResource";

export default class ContactCollectionResource extends BaseCollectionResource {

    protected innerResource = ContactResource;

    public uncover() {

        return {
            user: this.params.user,
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
