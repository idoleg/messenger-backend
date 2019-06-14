import BaseResource from "../../src/HttpServer/BaseResource";

export default class GroupResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            creator: this.creator,
            name: this.name,
            description: this.description,
            invitation_code: this.invitation_code,
        };
    }

}
