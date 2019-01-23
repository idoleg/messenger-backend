import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserContactResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            contact: this.contact,
            byname: this.byname,
            addedAt: this.added_at,
        };
    }

}
