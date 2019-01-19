import { fakeUsers } from "../../dist/app/faker";
import { Agent } from "./Bootstrap";

const AMOUNT_OF_USERS = 1;

const data: any = {};
let authTokenOfAccount: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.account = data.users.pop();

    authTokenOfAccount = data.account.createToken();
});

describe("Account API", () => {
    describe("Get account GET /account", () => {
        it("No token", async () => {
            const res = await Agent().get(`/account`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().get(`/account`)
                .set("Authorization", `Bearer wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Successful getting account profile", async () => {
            const res = await Agent().get(`/account`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });
    });

    describe("Change account PUT /account", () => {
        it("No token", async () => {
            const res = await Agent().put(`/account`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().put(`/account`)
                .set("Authorization", `Bearer wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Wrong password (Credentials are wrong)", async () => {
            const res = await Agent().put(`/account`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);
            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");
        });

        it("Successful update accoount", async () => {
            const res = await Agent().put(`/account`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);
            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });
    });
});
