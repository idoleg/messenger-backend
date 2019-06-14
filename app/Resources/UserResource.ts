import BaseResource from "../../src/HttpServer/BaseResource";
import UserProfileResource from "./UserProfileResource";

export default class UserResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            email: this.email,
            profile: this.nest(new UserProfileResource(this.profile)),
        };
    }

}
