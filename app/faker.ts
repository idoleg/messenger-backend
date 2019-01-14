import faker from "faker";
import {App, DB} from "./index";

const MULTIPLIER = +process.argv[2] || 1;

App.lifecycle.on("afterInit", async () => {
    const users = await fakeUsers(MULTIPLIER * 10);
    const groups = await fakeGroups(MULTIPLIER * 5, users);
    await fakeUserMessages(MULTIPLIER * 50, users);
    await fakeGroupMembers(MULTIPLIER * 20, groups, users);
    await fakeGroupMessages(MULTIPLIER * 100, groups, users);

    await App.stop();
});

export async function fakeUsers(count: number) {
    return await iterable(count, () => {
        return DB.getModel<any, any>("User").registration(Math.random() + faker.internet.email(), "012345678", faker.name.firstName());
    });
}

export async function fakeUserMessages(count: number, users: any[]) {
    return await iterable(count, () => {
        return DB.getModel<any, any>("UserMessage").create({
            sender: getRandomItem(users)._id,
            recipient: getRandomItem(users)._id,
            text: faker.lorem.text(),
            read: true,
        });
    });
}

export async function fakeGroups(count: number, users: any[]) {
    return await iterable(count, () => {
        return DB.getModel<any, any>("Group").create({
            creator: getRandomItem(users)._id,
            name: faker.company.companyName(),
            description: faker.lorem.sentence(),
        });
    });
}

export async function fakeGroupMembers(count: number, groups: any[], users: any[]) {
    return await iterable(count, () => {
        return DB.getModel<any, any>("GroupMember").create({
            group: getRandomItem(groups)._id,
            member: getRandomItem(users)._id,
        });
    });
}

export async function fakeGroupMessages(count: number, groups: any[], users: any[]) {
    return await iterable(count, () => {
        return DB.getModel<any, any>("GroupMessage").create({
            sender: getRandomItem(users)._id,
            group: getRandomItem(groups)._id,
            text: faker.lorem.text(),
        });
    });
}

async function iterable(count: number, callback: Function) {
    const promises = [];

    for (let i = 0; i < count; i++) {
        promises.push(callback());
    }

    return await Promise.all(promises);
}

function getRandomItem(array: any[]) {
    const rand = Math.floor(Math.random() * array.length);
    return array[rand];
}
