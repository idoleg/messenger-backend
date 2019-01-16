import {fakeUserConversation, fakeUsers} from "../../../dist/app/faker";
import {Agent} from "../Bootstrap";

const data: any = {};
let secondPersonId: string;
let authTokenOfFirstPerson: string;
let authTokenOfSecondPerson: string;
let authTokenOfAnOtherUser: string;

before(async () => {
    data.users = await fakeUsers(4);
    data.firstPerson = data.users.pop();
    data.secondPerson = data.users.pop();
    data.anoutherPerson = data.users.pop();
    data.messages = await fakeUserConversation(100, [data.firstPerson, data.secondPerson]);
    data.outherMessages = await fakeUserConversation(2, [data.anoutherPerson, data.secondPerson]);

    secondPersonId = data.secondPerson._id.toString();

    authTokenOfFirstPerson = data.firstPerson.createToken();
    authTokenOfSecondPerson = data.secondPerson.createToken();
    authTokenOfAnOtherUser = data.anoutherPerson.createToken();
});
describe("User message API", () => {

    describe("GET: /users/:userId/messages", () => {

        it("Successful getting conversation between users", async () => {
            const res = await Agent().get(`/users/${secondPersonId}/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.offset.should.be.equal(0);
            res.body.data.should.have.lengthOf(50);
        });

        it("Successful getting conversation between users - it's empty", async () => {
            const res = await Agent().get(`/users/${data.anoutherPerson._id}/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.offset.should.be.equal(0);
            res.body.data.should.have.lengthOf(0);
        });

        it("Successful getting conversation between users - use offset", async () => {
            const res = await Agent().get(`/users/${secondPersonId}/messages`)
                .query({offset: 70})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.offset.should.be.equal(70);
            res.body.data.should.have.lengthOf(30);
        });

        it("Error of getting conversation between user - user is not exist", async () => {
            const res = await Agent().get(`/users/userIsNotExist/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

    });

    describe("GET: /users/:userId/messages/:messageId", () => {

        it("Successful getting one message by id", async () => {
            const messageId = data.messages[1]._id.toString();

            const res = await Agent().get(`/users/${secondPersonId}/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.should.have.property("sender");
            res.body.should.have.property("recipient");
            res.body.should.have.property("text");
            res.body.should.have.property("sent_at");

        });

        it("Error of getting message by id - user is not exist", async () => {
            const messageId = data.messages[1]._id.toString();

            const res = await Agent().get(`/users/userIsNotExist/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of getting message by id - get wrong id of message", async () => {
            const res = await Agent().get(`/users/${secondPersonId}/messages/messageNotExist`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of getting message by id - message does not belong conversation of these users", async () => {
            const messageId = data.outherMessages[0]._id;

            const res = await Agent().get(`/users/${secondPersonId}/messages/${messageId}`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(404);
            res.body.message.should.be.equal("Not Found");
        });

    });

    describe("POST: /users/:userId/messages", () => {

        it("Successful sending message to user", async () => {
            const messageText = "This is awesome message";

            const res = await Agent().post(`/users/${secondPersonId}/messages`)
                .send({text: messageText})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("sender");
            res.body.should.have.property("recipient");
            res.body.should.have.property("text");
            res.body.text.should.be.equal(messageText);
            res.body.should.have.property("sent_at");
        });

        it("Error of sending message to user - user is not exist", async () => {
            const messageText = "This is awesome message";

            const res = await Agent().post(`/users/userIsNotExist/messages`)
                .send({text: messageText})
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of sending message to user - text does not get in body", async () => {
            const res = await Agent().post(`/users/${secondPersonId}/messages`)
                .set("Authorization", "Bearer " + authTokenOfFirstPerson);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

});
