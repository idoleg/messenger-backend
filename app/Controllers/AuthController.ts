export default class AuthController {

    public static login(req: any, res: any, next: any) {
        res.send("it's post:/auth/login");
        next();
    }

    public static registration(req: any, res: any, next: any) {
        res.send("it's post:/auth/registration");
        next();
    }

}
