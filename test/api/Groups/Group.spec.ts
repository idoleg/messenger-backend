import { fakeGroupMembers, fakeGroups, fakeUsers } from "../../../dist/app/faker";
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
    await data.groups.forEach((element: any) => {
        fakeGroupMembers(1, element, data.creator);
    });
    data.group = data.groups.pop();

    groupId = data.group._id.toString();

    authTokenOfCreator = data.creator.createToken();
    authTokenOfUser = data.user.createToken();
});

describe("Groups API", () => {
    describe("GET /groups/:groupId", () => {
        it("Successful getting group profile for a member", async () => {
            const res = await Agent().get(`/groups/${groupId}`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

        it("Successful getting group profile with invitation code", async () => {
            const res = await Agent().get(`/groups/${groupId}?invitation_code=inviteGoodPeople`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

        it("Not a member, no invitation code", async () => {
            const res = await Agent().get(`/groups/${groupId}`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);

            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });
    });

    describe("POST /groups", () => {
        it("Successful creating", async () => {
            const res = await Agent().post(`/groups`)
                .send({
                    name: "created group",
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

        it("No name for group", async () => {
            const res = await Agent().post(`/groups`)
                .send({
                    description: "created group",
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("PUT /groups/:groupId", () => {
        it("Successful updating group", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
                .send({
                    description: "updated description",
                })
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("creator");
            res.body.should.have.property("name");
            res.body.should.have.property("description");
            res.body.should.have.property("invitation_code");
        });

        it("Not creator", async () => {
            const res = await Agent().put(`/groups/${groupId}`)
                .send({
                    description: "not in group",
                })
                .set("Authorization", `Bearer ${authTokenOfUser}`);

            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });
    });

    describe("UNLINK /groups/:groupId", () => {
        it("Success remove", async () => {
            const res = await Agent().unlink(`/groups/${groupId}`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.message.should.be.equal("successfully");
        });
    });

    describe("LINK /groups", () => {
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

        it("Wrong invitation code", async () => {
            const res = await Agent().link(`/groups?invitation_code=someWrongCode`)
                .set("Authorization", `Bearer ${authTokenOfUser}`);

            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");
        });
    });
});
