import { fakeUsers } from "../../../dist/app/faker";
import { Agent } from "../Bootstrap";

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
            const res = await Agent().get(`/account`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().get(`/account`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Successful getting account profile", async () => {
            const res = await Agent().get(`/account`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("email");
            res.body.should.have.property("profile");
            res.body.profile.should.have.property("username");
            res.body.profile.should.have.property("fullname");
            res.body.profile.should.have.property("last_seen");
        });
    });

    describe("Change account PUT /account", () => {
        it("No token", async () => {
            const res = await Agent().put(`/account`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().put(`/account`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Wrong old password (Credentials are wrong)", async () => {
            const res = await Agent().put(`/account`)
                .send({
                    oldPassword: "wrongPassword",
                    newPassword: "some password",
                })
                .set("Authorization", `Bearer ${authTokenOfAccount}`);
            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");
        });

        it("Wrong new password (Validation error)", async () => {
            const res = await Agent().put(`/account`)
                .send({
                    oldPassword: "012345678",
                    newPassword: "12345",
                })
                .set("Authorization", `Bearer ${authTokenOfAccount}`);
            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Successful update accoount", async () => {
            const res = await Agent().put(`/account`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);
            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("email");
            res.body.should.have.property("profile");
            res.body.profile.should.have.property("username");
            res.body.profile.should.have.property("fullname");
            res.body.profile.should.have.property("last_seen");
        });
    });
});
