import { fakeDirectChats, fakeGroups, fakeUsers } from "../../dist/app/faker";
import { fakeGroupChats } from "../../dist/app/faker";
import { Agent } from "./Bootstrap";

const AMOUNT_OF_GROUPS = 3;
const AMOUNT_OF_USERS = 5;
const AMOUNT_OF_CHATS = 2;

const data: any = {};
let authTokenOfCreator: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.creator = data.users.pop();
    data.user = data.users.pop();
    data.groups = await fakeGroups(AMOUNT_OF_GROUPS, [data.creator]);
    data.group = data.groups.pop();
    data.directChats = await fakeDirectChats(AMOUNT_OF_CHATS, data.users, data.creator);
    data.groupChats = await fakeGroupChats(AMOUNT_OF_CHATS, data.groups, data.users, data.creator);
    data.chat = data.directChats[0];

    authTokenOfCreator = data.creator.createToken();
});

describe("Chat API", () => {

    describe("GET: /account/chats", () => {

        it("Successfull", async () => {
            const res = await Agent().get(`/account/chats`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("offset");
            res.body.should.have.property("data");
            res.body.offset.should.be.equal(0);
            res.body.data.should.have.lengthOf(4);
        });

        it("Successfull with offset", async () => {
            const res = await Agent().get(`/account/chats?offset=2`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("offset");
            res.body.should.have.property("data");
            res.body.offset.should.be.equal(2);
            res.body.data.should.have.lengthOf(2);
        });

    });

    describe("DELETE: /account/chats/:chatId", () => {

        it("Successfull", async () => {
            const res = await Agent().delete(`/account/chats/${data.chat._id}`)
                .set("Authorization", `Bearer ${authTokenOfCreator}`);

            res.should.have.status(200);
            res.body.should.have.property("message");
            res.body.message.should.be.equal("successfully");
        });

    });

});
