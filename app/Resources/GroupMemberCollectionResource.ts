import BaseCollectionResource from "../../src/HttpServer/BaseCollectionResource";
import GroupMemberResource from "./GroupMemberResource";

export default class GroupMemberCollectionResource extends BaseCollectionResource {

    protected innerResource = GroupMemberResource;

    public uncover() {

        return {
            group_id: this.params.group_id,
            offset: this.params.offset || 0,
            data: this.uncoverItems(),
        };
    }

}
