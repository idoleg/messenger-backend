import { w3cwebsocket as WebSocket } from "websocket";
import {fakeGroupMembers, fakeGroups, fakeUserConversation, fakeUsers} from "../../../dist/app/faker";
import {Agent, TestSocket} from "../Bootstrap";

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
        fakeGroupMembers(AMOUNT_OF_USERS, element, data.users);
    });

    data.group = data.groups.pop();
    groupId = data.group._id.toString();

    data.tokens = [];
    data.sockets = [];

    const address = TestSocket.httpServer.address();

    for (const user of data.users) {
        const token = user.createToken();
        data.tokens.push(token);

        const socket = new WebSocket(`ws://${address.address}:${address.port}/socket?token=${token}`, ``);

        data.sockets.push(socket);
    }
});

describe("WS chat:typing", () => {

    describe("Person must get WS event chat:typing when some start|stop writing to him", async () => {
        it("First person start typing to second person", async () => {
            data.sockets[firstPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    const haveTrue = event.data.search("true");
                    haveTrue.should.be.equal(3);

                    const startPayload = event.data.search("{");
                    const payload = JSON.parse(event.data.substring(startPayload, event.data.length - 1));
                    payload.message.status.should.be.equal("start");
                    payload.message.recipient.should.be.equal(data.users[secondPerson].id);
                } else {
                    throw new Error(`Bad data type received... ${event}`);
                }
            };

            data.sockets[secondPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    event.data.should.be.equal(`[null,{"status":"start","sender":"${data.users[firstPerson].id}"}]`);
                } else {
                  throw new Error(`Bad data type received... ${event}`);
                }
            };
            data.sockets[firstPerson].send(`2["chat:typing",{"status":"start", "recipient":"${data.users[secondPerson].id}"}]`);
        });
        it("First person stop typing to second person", async () => {
            data.sockets[firstPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    const haveTrue = event.data.search("true");
                    haveTrue.should.be.equal(3);

                    const startPayload = event.data.search("{");
                    const payload = JSON.parse(event.data.substring(startPayload, event.data.length - 1));
                    payload.message.status.should.be.equal("stop");
                    payload.message.recipient.should.be.equal(data.users[secondPerson].id);
                } else {
                    throw new Error(`Bad data type received... ${event}`);
                }
            };

            data.sockets[secondPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    event.data.should.be.equal(`[null,{"status":"stop","sender":"${data.users[firstPerson].id}"}]`);
                } else {
                  throw new Error(`Bad data type received... ${event}`);
                }
            };
            data.sockets[firstPerson].send(`4["chat:typing",{"status":"stop", "recipient":"${data.users[secondPerson].id}"}]`);
        });
    });

    describe("Group must get WS event chat:typing when some group member start|stop writing", async () => {
        it("Some person start typing to group. Other must get messages", async () => {
            for (const socket of data.sockets) {
                socket.onmessage = (event: any) => {
                    if (typeof event.data === "string") {
                        const startPayload = event.data.search("{");
                        const payload = JSON.parse(event.data.substring(startPayload, event.data.length - 1));

                        payload.status.should.be.equal("start");
                        payload.group.should.be.equal(groupId);
                        payload.sender.should.be.equal(data.users[firstPerson].id);
                    } else {
                      throw new Error(`Bad data type received... ${event}`);
                    }
                };
            }
            data.sockets[firstPerson].onmessage = (event: any) => {
                if (typeof event.data === "string") {
                    const haveTrue = event.data.search("true");
                    haveTrue.should.be.equal(3);

                    const startPayload = event.data.search("{");
                    const payload = JSON.parse(event.data.substring(startPayload, event.data.length - 1));
                    payload.message.status.should.be.equal("start");
                    payload.message.group.should.be.equal(groupId);
                } else {
                  throw new Error(`Bad data type received... ${event}`);
                }
            };
            data.sockets[firstPerson].send(`2["chat:typing",{"status":"start", "group":"${groupId}"}]`);
        });
    });

});
