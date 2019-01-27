import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserProfileResource extends BaseResource {

    public uncover() {
        return {
            username: this.username,
            fullname: this.fullname,
            last_seen: this.last_seen,
        };
    }

}
