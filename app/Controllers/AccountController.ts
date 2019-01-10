export default class AccountController {

    public static get(req: any, res: any, next: any) {
        res.send("it's get:/account");
        next();
    }

    public static update(req: any, res: any, next: any) {
        res.send("it's post:/account");
        next();
    }

}
