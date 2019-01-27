import BaseResource from "../../src/HttpServer/BaseResource";

export default class BlacklistResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            banned: this.contact,
            addedAt: this.added_at,
        };
    }

}
