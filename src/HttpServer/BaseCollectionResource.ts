import BaseResource from "./BaseResource";

export default class BaseCollectionResource extends BaseResource {

    protected innerResource = BaseResource;

    public uncoverItems() {
        const items: any[] = [];
        this.data.forEach((item: any) => {
            items.push((new this.innerResource(item)).attach(this.req, this.req).uncover());
        });

        return items;
    }

    public uncover() {
        return {
            data: this.uncoverItems(),
        };
    }

}
