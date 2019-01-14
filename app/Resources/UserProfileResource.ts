import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserProfileResource extends BaseResource {

    public uncover() {
        return {
            name: this.name,
            last_name: this.last_name,
            last_seen: this.last_seen,
        };
    }

}
