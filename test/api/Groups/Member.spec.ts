import {fakeGroupMembers, fakeGroups, fakeUsers} from "../../../dist/app/faker";
import {Agent} from "../Bootstrap";

const data: any = {};
let groupId: string;
let authTokenOfMemberAndCreator: string;
let authTokenOfMemberButNotCreator: string;
let authTokenOfUserButNotMember: string;

before(async () => {
    data.members = await fakeUsers(20);
    data.notMembers = await fakeUsers(5);
    data.creator = data.members[0];
    data.memberButNotCreator = data.members[1];
    data.userButNotMember = data.notMembers[1];
    data.groups = await fakeGroups(1, data.creator);
    data.group = data.groups[0];

    data.members.map((item: any) => {
        data.group.addMember(item);
    });
    data.countOfMembers = data.members.length;

    groupId = data.group._id.toString();
    authTokenOfMemberAndCreator = data.creator.createToken();
    authTokenOfMemberButNotCreator = data.memberButNotCreator.createToken();
    authTokenOfUserButNotMember = data.userButNotMember.createToken();
});
describe("Group member API", () => {

    describe("GET: /groups/:groupId/members", () => {

        it("Successful getting members of group", async () => {
            const res = await Agent().get(`/groups/${groupId}/members`)
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(200);
            res.body.group_id.should.be.equal(groupId);
            res.body.offset.should.be.equal(0);
            res.body.data.should.have.lengthOf(data.countOfMembers);
        });

        it("Successful getting members of group  - use offset", async () => {
            const offset = 10;

            const res = await Agent().get(`/groups/${groupId}/members`)
                .query({offset})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(200);
            res.body.group_id.should.be.equal(groupId);
            res.body.offset.should.be.equal(offset);
            res.body.data.should.have.lengthOf(data.countOfMembers - offset);
        });

        it("Error of getting group members - group is not exist", async () => {
            const res = await Agent().get("/groups/groupNotExist/members")
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of getting group members - group is exist, but auth user is not member", async () => {
            const res = await Agent().get(`/groups/${groupId}/members`)
                .set("Authorization", "Bearer " + authTokenOfUserButNotMember);

            res.should.have.status(404);
            res.body.message.should.be.equal("This group not found or not allowed for you");
        });

    });

    describe("POST: /groups/:groupId/members", () => {

        it("Successful adding user to group", async () => {
            const user = data.notMembers.pop()._id;

            const res = await Agent().post(`/groups/${groupId}/members`)
                .send({user})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(200);
        });

        it("Successful adding member to group although member has already been added", async () => {
            const user = data.members[2]._id;

            const res = await Agent().post(`/groups/${groupId}/members`)
                .send({user})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(200);
        });

        it("Error of adding member to group - group is not exist", async () => {
            const user = data.members[2]._id;

            const res = await Agent().post("/groups/groupNotExist/members")
                .send({user})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of adding member to group - user is not exist", async () => {
            const user = "userIsNotExist";

            const res = await Agent().post(`/groups/${groupId}/members`)
                .send({user})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of adding member to group - not group member cannot do it", async () => {
            const user = data.members[2]._id;

            const res = await Agent().post(`/groups/${groupId}/members`)
                .send({user})
                .set("Authorization", "Bearer " + authTokenOfUserButNotMember);

            res.should.have.status(404);
            res.body.message.should.be.equal("This group not found or not allowed for you");
        });

        it("Error of adding member to group - user id does not get in body", async () => {
            const res = await Agent().post(`/groups/${groupId}/members`)
                .set("Authorization", "Bearer " + authTokenOfUserButNotMember);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

    });

    describe("PUT: /groups/:groupId/members/:userId", () => {

        it("Successful change role for member from group", async () => {
            const userId = data.memberButNotCreator._id.toString();

            const res = await Agent().put(`/groups/${groupId}/members/${userId}`)
                .send({role: "moderator"})
                .set("Authorization", "Bearer " + authTokenOfMemberAndCreator);
            res.should.have.status(200);
            res.body.should.have.property("user");
            res.body.should.have.property("role");
        });

        it("Error changing role - only group's creator can do it", async () => {
            const userId = data.memberButNotCreator._id.toString();

            const res = await Agent().put(`/groups/${groupId}/members/${userId}`)
                .send({role: "moderator"})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

        it("Error changing role - user is not member", async () => {
            const userId = data.userButNotMember._id.toString();

            const res = await Agent().put(`/groups/${groupId}/members/${userId}`)
                .send({role: "moderator"})
                .set("Authorization", "Bearer " + authTokenOfMemberAndCreator);

            res.should.have.status(404);
            res.body.message.should.be.equal("This group not found or not allowed for you");
        });

        it("Error changing role - wrong role", async () => {
            const userId = data.members[2]._id.toString();

            const res = await Agent().put(`/groups/groupNotExist/members/${userId}`)
                .send({role: "wrongRole"})
                .set("Authorization", "Bearer " + authTokenOfMemberAndCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error changing role - group is not id", async () => {
            const userId = data.members[2]._id.toString();

            const res = await Agent().put(`/groups/groupNotExist/members/${userId}`)
                .send({role: "moderator"})
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("DELETE: /groups/:groupId/members/:userId", () => {

        it("Successful deleting member from group", async () => {
            const userId = data.members.pop()._id;

            const res = await Agent().delete(`/groups/${groupId}/members/${userId}`)
                .set("Authorization", "Bearer " + authTokenOfMemberAndCreator);

            res.should.have.status(200);
            res.body.message.should.be.equal("successfully");
        });

        it("Successful deleting user from group although user is not member", async () => {
            const userId = data.userButNotMember._id;

            const res = await Agent().delete(`/groups/${groupId}/members/${userId}`)
                .set("Authorization", "Bearer " + authTokenOfMemberAndCreator);

            res.should.have.status(200);
            res.body.message.should.be.equal("successfully");
        });

        it("Error of deleting user from group - only group's creator can do it", async () => {
            const userId = data.userButNotMember._id;

            const res = await Agent().delete(`/groups/${groupId}/members/${userId}`)
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

        it("Error of deleting user from group - user is not member", async () => {
            const userId = data.userButNotMember._id;

            const res = await Agent().delete(`/groups/${groupId}/members/${userId}`)
                .set("Authorization", "Bearer " + authTokenOfUserButNotMember);

            res.should.have.status(403);
            res.body.message.should.be.equal("You cannot do it");
        });

        it("Error of deleting user from group - group is not exist", async () => {
            const userId = data.members[2]._id;

            const res = await Agent().delete(`/groups/groupNotExist/members/${userId}`)
                .set("Authorization", "Bearer " + authTokenOfMemberButNotCreator);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

});
