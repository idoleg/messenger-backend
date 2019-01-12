import BaseResource from "../../src/HttpServer/BaseResource";

export default class MessageResource extends BaseResource {

    public uncover() {
        return {
            id: this._id,
            sender: this.sender,
            recipient: this.recipient,
            text: this.text,
            sent_at: this.sent_at,
        };
    }

}
