import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import MessageResource from "./MessageResource";

export default class MessageCollectionResource extends BaseCollectionResource {

    protected innerResource = MessageResource;

    public uncover() {

        return {
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
