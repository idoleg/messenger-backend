import BaseResource from "../../src/HttpServer/BaseResource";

export default class UserChatResource extends BaseResource {

    public uncover() {
        let chatName = "";
        let groupId = null;
        let directId = null;
        if (this.group) {
            chatName = this.group.name;
            groupId = this.group._id;
        }
        if (this.direct) {
            chatName = this.direct.profile.username;
            directId = this.direct._id;
        }

        return {
            id: this._id,
            group: groupId,
            direct: directId,
            sender: this.sender,
            preview: this.preview,
            name: chatName,
            unread: this.unread,
        };
    }

}
