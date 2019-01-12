import BaseResource from "./BaseResource";

export default class BaseCollectionResource extends BaseResource {

    protected innerResource = BaseResource;

    public uncoverItems(req: any, res: any) {
        const items: any[] = [];
        this.data.forEach((item: any) => {
            items.push((new this.innerResource(item)).uncover(req, res));
        });

        return items;
    }

    public uncover(req: any, res: any) {
        return {
            data: this.uncoverItems(req, res),
        };
    }

}
