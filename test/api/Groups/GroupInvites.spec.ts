import { fakeGroups, fakeUsers } from "../../../dist/app/faker";
import { Agent } from "../Bootstrap";

const AMOUNT_OF_GROUPS = 1;
const AMOUNT_OF_USERS = 2;

const data: any = {};
let groupId: string;
let authTokenOfCreator: string;
let authTokenOfUser: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.creator = data.users.pop();
    data.user = data.users.pop();
    data.groups = await fakeGroups(AMOUNT_OF_GROUPS, [data.creator]);
    data.group = data.groups.pop();

    groupId = data.group._id.toString();

    authTokenOfCreator = data.creator.createToken();
    authTokenOfUser = data.user.createToken();
});

describe("Group invites API", () => {
    describe("Get invitation code GET /groups/%id/invites", () => {
        it("Successful getting group profile", async () => {
            const res = await Agent().get(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("active");
            res.body.should.have.property("invitation_code");
        });

        it("No token", async () => {
            const res = await Agent().get(`/groups/${groupId}/invites`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().get(`/groups/${groupId}/invites`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Not creator", async () => {
            const res = await Agent().get(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });
    });

    describe("Create invitation code POST /groups/%id/invites", () => {
        it("Successful creating", async () => {
            const res = await Agent().post(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(200);
            res.body.should.have.property("active");
            res.body.should.have.property("invitation_code");
        });

        it("No token", async () => {
            const res = await Agent().post(`/groups/${groupId}/invites`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().post(`/groups/${groupId}/invites`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Not creator", async () => {
            const res = await Agent().post(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

    });

    describe("Delete invitation code DELETE /groups/%id/invites", () => {
        it("Successful updating group", async () => {
            const res = await Agent().delete(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(200);
            res.body.message.should.be.equal("successfully");
        });

        it("No token", async () => {
            const res = await Agent().delete(`/groups/${groupId}/invites`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().delete(`/groups/${groupId}/invites`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Not creator", async () => {
            const res = await Agent().delete(`/groups/${groupId}/invites`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

    });
});
