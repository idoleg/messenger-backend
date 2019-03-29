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

        const socket = new WebSocket(`ws://${address.address}:${address.port}/socket?token=${token}`, ``);
        socket.onerror = (event: any) => {
            throw new Error(`An error occured with the ${user.id} connection... ${event}`);
        };

        data.sockets.push(socket);
    }
});

describe("WS chat:typing", () => {

    describe("Person must get WS event chat:typing when some start|stop writing to him", () => {
        it("First person start typing to second person", async () => {
            data.sockets[secondPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    // TO DO should be
                } else {
                  throw new Error(`Bad data type received... ${event}`);
                }
            };
            data.sockets[firstPerson].send(`2["chat:typing",{"status":"start", "recipient":"${data.users[secondPerson].id}"}`);
        });
    });

    describe("Group must get WS event chat:typing when some group member start|stop writing", () => {
        // TO DO it("", async () => {});
    });

});
