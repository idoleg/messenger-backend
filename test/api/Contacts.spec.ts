import faker from "faker";
import { fakeContacts, fakeUsers } from "../../dist/app/faker";
import { Agent } from "./Bootstrap";

const AMOUNT_OF_USERS = 5;

const data: any = {};
let authTokenOfAccount: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.mainUser = data.users.pop();
    data.anotherUser = data.users.pop();

    data.mainUserContact = await fakeContacts(1, [ data.users.pop() ], data.mainUser) ;
    data.anotherUserContact = await fakeContacts(1, [ data.users.pop() ], data.anotherUser) ;

    data.userForManipulations = data.users.pop();

    authTokenOfAccount = data.mainUser.createToken();
});

describe("Contacts API", () => {
    describe("Get contacts GET /account/contacts", () => {

        it("Successful getting contacts", async () => {
            const res = await Agent().get(`/account/contacts`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("user_id");
            res.body.should.have.property("offset");
            res.body.should.have.property("data");
        });

    });

    describe("Get contact by id GET /account/contacts/%id", () => {

        it("Successful getting contact", async () => {
            const res = await Agent().get(`/account/contacts/${data.mainUserContact._id}`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("contact");
            res.body.should.have.property("byname");
            res.body.should.have.property("addedAt");
        });

        it("Error of getting contact - contact with such id is not exist", async () => {
            const res = await Agent().get(`/account/contacts/${data.anotherUserContact._id}`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(404);
            res.body.message.should.be.equal("Contact with such id was not found");
        });
    });

    describe("Post new contact POST /account/contacts", async () => {
        it("Successful posting contact", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ id: data.userForManipulations._id, byname: faker.lorem.text() });

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("contact");
            res.body.should.have.property("byname");
            res.body.should.have.property("addedAt");
        });

        it("Successful posting same contact", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ id: data.userForManipulations._id, byname: faker.lorem.text() });

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("contact");
            res.body.should.have.property("byname");
            res.body.should.have.property("addedAt");
        });

        it("Error of posting account - property byname is required", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ id: data.userForManipulations._id });

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of posting account - property id is required", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ byname: faker.lorem.text() });

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("Put contact byname PUT /account/contacts/%id", () => {
       it("Successful setting byname to contact", async () => {
           const newName = faker.lorem.text();
           const res = await Agent().put(`/account/contacts/${data.mainUserContact._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`)
               .send({ byname: newName });

           res.should.have.status(200);
           res.body.should.have.property("id");
           res.body.should.have.property("contact");
           res.body.should.have.property("byname");
           res.body.should.have.property("addedAt");

           res.body.byname.should.be.equal(newName);
       });

       it("Error with setting byname to contact - contact with such id is not exist", async () => {
           const res = await Agent().put(`/account/contacts/${data.anotherUserContact._id}`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ byname: faker.lorem.text() });

           res.should.have.status(404);
           res.body.message.should.be.equal("Contact with such id was not found");
       });

       it("Error with setting byname to contact - property byname is required", async () => {
           const res = await Agent().put(`/account/contacts/${data.mainUserContact._id}`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(400);
           res.body.message.should.be.equal("Validation error");
       });
    });

    describe("Delete contact DELETE /account/contacts/%id", () => {
       it("Successful deleting contact", async () => {
           const res = await Agent().delete(`/account/contacts/${data.mainUserContact._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.should.be.equal("successfully");
       });

       it("Successful result of deleting wrong contact", async () => {
           const res = await Agent().delete(`/account/contacts/${data.anotherUserContact._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.should.be.equal("successfully");
       });
    });
});
