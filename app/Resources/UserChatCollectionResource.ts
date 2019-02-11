import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import UserChatResource from "./UserChatResource";

export default class UserChatCollectionResource extends BaseCollectionResource {

    protected innerResource = UserChatResource;

    public uncover() {

        return {
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
