import {fakeUsers} from "../../dist/app/faker";
import {Agent} from "./Bootstrap";

const data: any = {};
let authToken: string;

before(async () => {
    data.users = await fakeUsers(1);
    data.user = data.users.pop();

    authToken = data.user.createToken();
});

describe("find by token Middleware", () => {

    it("No token", async () => {
        const res = await Agent().get(`/anyRoute`);
        res.should.have.status(401);
        res.body.message.should.be.equal("No valid token");
    });

    it("Error token", async () => {
        const res = await Agent().get(`/anyRoute`)
            .set("Authorization", `wrongToken`);
        res.should.have.status(401);
        res.body.message.should.be.equal("No valid token");
    });

    it("Right token, error header", async () => {
        const res = await Agent().get(`/anyRoute`)
            .set("Authorization", `${authToken}`);
        res.should.have.status(401);
        res.body.message.should.be.equal("No valid token");
    });

});
