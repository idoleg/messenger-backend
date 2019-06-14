import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserProfileResource extends BaseResource {

    public uncover() {
        if (this.id) {
            return {
                id: this.id,
                username: this.username,
                fullname: this.fullname,
                last_seen: this.last_seen,
            };
        } else {
            return {
                username: this.username,
                fullname: this.fullname,
                last_seen: this.last_seen,
            };
        }
    }

}
