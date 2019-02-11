import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserChatResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            group: this.group,
            direct: this.direct,
            sender: this.sender,
            preview: this.preview,
            unread: this.unread,
        };
    }

}
