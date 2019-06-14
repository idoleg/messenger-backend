import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import MessageResource from "./GroupMessageResource";

export default class GroupMessageCollectionResource extends BaseCollectionResource {

    protected innerResource = MessageResource;

    public uncover() {

        return {
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
