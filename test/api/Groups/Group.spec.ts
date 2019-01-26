import { fakeUsers, fakeGroups } from "../../../dist/app/faker";
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
    data.groups = await fakeGroups(AMOUNT_OF_GROUPS,[data.creator]);
    data.group = data.groups.pop();

    groupId = data.group._id.toString();

    authTokenOfCreator = data.creator.createToken();
    authTokenOfUser = data.user.createToken();
});

describe("Groups API", () => {
    describe("Get group information GET /groups/:groupId", () => {
        it("No token", async () => {
            const res = await Agent().get(`/groups/${groupId}`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().get(`/groups/${groupId}`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Successful getting group profile", async () => {
            const res = await Agent().get(`/groups/${groupId}`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });
    });

    describe("Create group POST /groups", () => {
        it("No token", async () => {
            const res = await Agent().post(`/groups`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().post(`/groups`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("No name group", async () => {
            const res = await Agent().post(`/groups`)
                .send({
                    description: "created group"
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Successful creating", async () => {
            const res = await Agent().post(`/groups`)
                .send({
                    name: "created group"
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

    });

    describe("Change group information PUT /groups/:groupId", () => {
        it("No token", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Not creator", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
                .send({
                    description: "not in group"
                })
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

        it("Successful updating group", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
                .send({
                    description: "updated description"
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

    });

    describe("Leave the group UNLINK /groups/:groupId", () => {
        it("No token", async () => {
            const res = await Agent().unlink(`/groups/${groupId}`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().unlink(`/groups/${groupId}`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Success remove", async () => {
            const res = await Agent().unlink(`/groups/${groupId}`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);
            res.should.have.status(200);
            res.body.message.should.be.equal("successfully");
        });
    });

    describe("Enter the group LINK /groups", () => {
        it("No token", async () => {
            const res = await Agent().link(`/groups`)
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Error token", async () => {
            const res = await Agent().link(`/groups`)
                .set("Authorization", `wrongToken`);
            res.should.have.status(401);
            res.body.message.should.be.equal("No valid token");
        });

        it("Wrong invitation code", async () => {
            const res = await Agent().link(`/groups?invitation_code=someWrongCode`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");
        });

        it("Successfull enter the group", async () => {
            const res = await Agent().link(`/groups?invitation_code=inviteGoodPeople`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);
            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });
    });
});
