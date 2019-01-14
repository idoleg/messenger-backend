export default class BaseResource {
    [key: string]: any;

    protected data: any;
    protected params: any;

    protected req: any;
    protected res: any;

    constructor(data: any, params: any = {}) {
        this.data = data;
        this.params = params;

        return new Proxy(this, {
            get(target: any, field: string) {
                if (field in target) return target[field];

                return target.data[field];
            },
        });
    }

    public attach(req: any, res: any) {
        this.req = req;
        this.res = res;
        return this;
    }

    public nest(resource: BaseResource) {
        return resource.attach(this.req, this.res).uncover();
    }

    public uncover() {
        return this.data;
    }

}
