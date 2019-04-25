import BaseResource from "../../src/HttpServer/BaseResource";

export default class ContactResource extends BaseResource {

    public uncover() {
        return {
            profile: this.contact.profile,
            contact: this.contact._id,
            byname: this.byname,
            addedAt: this.added_at,
        };
    }

}
