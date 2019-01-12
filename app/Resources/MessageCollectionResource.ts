import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import MessageResource from "./MessageResource";

export default class MessageCollectionResource extends BaseCollectionResource {

    protected innerResource = MessageResource;

    public uncover(req: any, res: any) {

        return {
            offset: this.params.offset,
            data: this.uncoverItems(req, res),
        };
    }

}
