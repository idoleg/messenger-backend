import BaseResource from "../../src/HttpServer/BaseResource";

export default class GroupMessageResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            sender: this.sender,
            group: this.group,
            text: this.text,
            sent_at: this.sent_at,
            type: 'group'
        };
    }

}
