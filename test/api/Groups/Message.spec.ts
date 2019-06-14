import {fakeGroupMessages, fakeGroups, fakeUsers} from "../../../dist/app/faker";
import {Agent} from "../Bootstrap";

const data: any = {};
let groupId: string;
let anotherGroupId: string;
let authTokenOfFirstPerson: string;
let authTokenOfSecondPerson: string;
let authTokenOfAnOtherUser: string;

before(async () => {
    data.users = await fakeUsers(4);
    data.firstPerson = data.users.pop();
    data.secondPerson = data.users.pop();
    data.anoutherPerson = data.users.pop();
    data.groups = await fakeGroups(2, data.firstPerson);
    data.group = data.groups[0];
    data.anotherGroup = data.groups[1];
    data.messages = await fakeGroupMessages(100, [data.group], [data.firstPerson, data.secondPerson]);
    data.outherMessages = await fakeGroupMessages(2, [data.anotherGroup], [data.anoutherPerson, data.secondPerson]);

    groupId = data.group._id.toString();
    anotherGroupId = data.anotherGroup._id.toString();

    authTokenOfFirstPerson = data.firstPerson.createToken();
    authTokenOfSecondPerson = data.secondPerson.createToken();
    authTokenOfAnOtherUser = data.anoutherPerson.createToken();
});
describe("Group message API", () => {

    describe("GET: /groups/:groupId/messages", () => {

        it("Successful getting messages", async () => {
            const res = await Agent().get(`/groups/${groupId}/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.offset.should.be.equal(0);
            res.body.data.should.have.lengthOf(50);
        });

        // it("Successful getting conversation between users - it's empty", async () => {
        //     const res = await Agent().get(`/groups/${data.anoutherPerson._id}/messages`)
        //         .set("Authorization", "Bearer " + authTokenOfFirstPerson);

        //     res.should.have.status(200);
        //     res.body.offset.should.be.equal(0);
        //     res.body.data.should.have.lengthOf(0);
        // });

        it("Successful getting messages - use offset", async () => {
            const res = await Agent().get(`/groups/${groupId}/messages`)
                .query({offset: 70})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.offset.should.be.equal(70);
            res.body.data.should.have.lengthOf(30);
        });

        it("Error of getting messages - group is not exist", async () => {
            const res = await Agent().get(`/groups/groupIsNotExist/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

    });

    describe("GET: /groups/:groupId/messages/:messageId", () => {

        it("Successful getting one message by id", async () => {
            const messageId = data.messages[1]._id.toString();

            const res = await Agent().get(`/groups/${groupId}/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.should.have.property("sender");
            res.body.should.have.property("group");
            res.body.should.have.property("text");
            res.body.should.have.property("sent_at");

        });

        it("Error of getting message by id - group is not exist", async () => {
            const messageId = data.messages[1]._id.toString();

            const res = await Agent().get(`/groups/groupIsNotExist/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of getting message by id - get wrong id of message", async () => {
            const res = await Agent().get(`/groups/${groupId}/messages/messageNotExist`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of getting message by id - message does not belong this group", async () => {
            const messageId = data.outherMessages[0]._id;

            const res = await Agent().get(`/groups/${groupId}/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(404);
            res.body.message.should.be.equal("Not Found");
        });

    });

    describe("POST: /groups/:groupId/messages", () => {

        it("Successful sending message", async () => {
            const messageText = "This is awesome message";

            const res = await Agent().post(`/groups/${groupId}/messages`)
                .send({text: messageText})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("sender");
            res.body.should.have.property("group");
            res.body.should.have.property("text");
            res.body.text.should.be.equal(messageText);
            res.body.should.have.property("sent_at");
        });

        it("Error of sending message - group is not exist", async () => {
            const messageText = "This is awesome message";

            const res = await Agent().post(`/groups/groupIsNotExist/messages`)
                .send({text: messageText})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of sending message - text does not get in body", async () => {
            const res = await Agent().post(`/groups/${groupId}/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

});
