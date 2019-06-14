import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import BlacklistResource from "./BlacklistResource";

export default class BlacklistCollectionResource extends BaseCollectionResource {

    protected innerResource = BlacklistResource;

    public uncover() {

        return {
            user: this.params.user,
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
