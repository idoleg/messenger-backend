import BaseResource from "../../src/HttpServer/BaseResource";
import UserProfileResource from "./UserProfileResource";

export default class GroupMemberResource extends BaseResource {

    public uncover() {
        return {
            // id: this._id,
            user: this.member,
            role: this.role,
        };
    }

}
