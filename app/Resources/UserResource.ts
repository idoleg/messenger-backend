import BaseResource from "../../src/HttpServer/BaseResource";
import UserProfileResource from "./UserProfileResource";

export default class UserResource extends BaseResource {

    /**
     * @apiDefine UserResourceCovered
     *
     * @apiSuccess {User} user User Resource
     * @apiSuccess {String} user.id User unique id
     * @apiSuccess {String} user.email  User unique email
     * @apiSuccess {UserProfile} user.profile  User Profile Resource
     * @apiSuccess {String} user.profile.username  User unique username
     * @apiSuccess {String} user.profile.fullname  User Profile fullname
     * @apiSuccess {Number} user.profile.last_seen  User last seen
     */
    public uncover() {
        return {
            id: this._id,
            email: this.email,
            // password: this.password,
            profile: this.nest(new UserProfileResource(this.profile)),
        };
    }

}
