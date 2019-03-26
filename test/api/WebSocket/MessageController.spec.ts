import { w3cwebsocket as WebSocket } from "websocket";
import {fakeGroupMembers, fakeGroups, fakeUserConversation, fakeUsers} from "../../../dist/app/faker";
import {Server, TestSocket} from "../Bootstrap";

const AMOUNT_OF_GROUPS = 1;
const AMOUNT_OF_USERS = 4;

const data: any = {};

const firstPerson = 1;
const secondPerson = 2;
const anoutherPerson = 3;

let groupId: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.messages = await fakeUserConversation(100, [data.users[firstPerson], data.users[secondPerson]]);
    data.outherMessages = await fakeUserConversation(2, [data.users[anoutherPerson], data.users[secondPerson]]);

    data.groups = await fakeGroups(AMOUNT_OF_GROUPS, [data.users[firstPerson]]);
    await data.groups.forEach((element: any) => {
        fakeGroupMembers(AMOUNT_OF_USERS, element, data.users[firstPerson]);
    });

    data.group = data.groups.pop();
    groupId = data.group._id.toString();

    data.tokens = [];
    data.wsUsers = [];
    data.sockets = [];

    const address = TestSocket.httpServer.address();

    for (const user of data.users) {
        const wsUser = TestSocket.user(user.id);
        wsUser.model = user;
        data.wsUsers.push(wsUser);

        const token = user.createToken();
        data.tokens.push(token);

        const socket = new WebSocket(`ws://${address.address}:8888/socket?token=${token}`, ``);

        data.sockets.push(socket);
    }
});

describe("WS chat:typing", () => {

    describe("Person must get WS event chat:typing when some start|stop writing to him", () => {
        // TO DO it("", async () => {});
    });

    describe("Group must get WS event chat:typing when some group member start|stop writing", () => {
        // TO DO it("", async () => {});
    });

});
