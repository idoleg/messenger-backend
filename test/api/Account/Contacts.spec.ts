import { doesNotReject } from "assert";
import faker from "faker";
import { fakeContacts, fakeUsers } from "../../../dist/app/faker";
import { Agent } from "../Bootstrap";

const AMOUNT_OF_USERS = 5;

const data: any = {};
let authTokenOfAccount: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.mainUser = data.users.pop();
    data.anotherUser = data.users.pop();

    data.mainUserContact = (await fakeContacts(1, [ data.users.pop() ], data.mainUser))[0] ;
    data.anotherUserContact = (await fakeContacts(1, [ data.users.pop() ], data.anotherUser))[0] ;

    data.userForManipulations = data.users.pop();

    authTokenOfAccount = data.mainUser.createToken();
});

describe("Contacts API", () => {
    describe("GET /account/contacts", () => {

        it("Successful getting contacts", async () => {
            const res = await Agent().get(`/account/contacts`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("user");
            res.body.offset.should.be.equal(0);
            res.body.should.have.property("data");
        });

    });

    describe("GET /account/contacts - use offset", () => {

        it("Successful getting contacts", async () => {
            const res = await Agent().get(`/account/contacts`)
                .query({offset: 1})
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.offset.should.be.equal(1);
            res.body.data.should.have.lengthOf(0);
            res.body.should.have.property("data");
        });

    });

    describe("GET /account/contacts/%id", () => {

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

    describe("POST /account/contacts", async () => {
        const byname = faker.lorem.text();
        it("Successful posting contact", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ user: data.userForManipulations._id, byname });

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("contact");
            res.body.should.have.property("byname").equal(byname);
            res.body.should.have.property("addedAt");
        });

        it("Successful posting same contact - property byname is not sent", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ user: data.userForManipulations._id});

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("contact");
            res.body.should.have.property("byname").equal(null);
            res.body.should.have.property("addedAt");
        });

        it("Error of posting account - property user is required", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ byname });

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });

        it("Error of posting account - the user does not exist", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ user: "userNotExist" });
            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("PUT /account/contacts/%id", () => {
       it("Successful setting byname to contact", async () => {
           const newName = faker.lorem.text();
           const res = await Agent().put(`/account/contacts/${data.userForManipulations._id}`)
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

    describe("DELETE /account/contacts/%id", () => {
       it("Successful deleting contact", async () => {
           const res = await Agent().delete(`/account/contacts/${data.mainUserContact._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.message.should.be.equal("successfully");
       });

       it("Successful result of deleting wrong contact", async () => {
           const res = await Agent().delete(`/account/contacts/${data.anotherUserContact._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.message.should.be.equal("successfully");
       });
    });
});
