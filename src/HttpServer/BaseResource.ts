export default class BaseResource {
    [key: string]: any;

    protected data: any;
    protected params: any;

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

    public uncover(req: any, res: any) {
        return this.data;
    }

}
