import Application from "../Application";
import EventRouter from "./EventRouter";

export default class BaseController {

    protected $router: EventRouter;
    protected $app: Application;

    constructor(router: EventRouter, app: Application ) {

        this.$router = router;
        this.$app = app;

    }
}
