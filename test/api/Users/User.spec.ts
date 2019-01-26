import { fakeUsers } from "../../../dist/app/faker";
import { Agent } from "../Bootstrap";

const AMOUNT_OF_USERS = 4;

const data: any = {};
let firstPersonId: string;
let firstPersonEmail: string;
let authTokenOfSecondPerson: string;
let authTokenOfFirstPerson: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.firstPerson = data.users.pop();
    data.secondPerson = data.users.pop();

    firstPersonId = data.firstPerson._id.toString();
    firstPersonEmail = data.firstPerson.email;

    authTokenOfFirstPerson = data.firstPerson.createToken();
    authTokenOfSecondPerson = data.secondPerson.createToken();
});

describe("User get API", () => {
    describe("GET /users/:userId", () => {
        it("Successful getting user profile", async () => {
            const res = await Agent().get(`/users/${firstPersonId}`)
                .set("Authorization", `Bearer ${authTokenOfFirstPerson}`);

            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });

        it("Successful getting user profile by token of another one", async () => {
            const res = await Agent().get(`/users/${firstPersonId}`)
                .set("Authorization", `Bearer ${authTokenOfSecondPerson}`);
            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });

        it("Error of getting user - user is not exist", async () => {
            const res = await Agent().get("/users/userIsNotExist")
                .set("Authorization", `Bearer ${authTokenOfFirstPerson}`);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("GET /users?email=", () => {
        it("Successful getting user account", async () => {
            const res = await Agent().get(`/users?email=${firstPersonEmail}`)
                .set("Authorization", `Bearer ${authTokenOfFirstPerson}`);
            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });

        it("Successful getting user profile by token of another one", async () => {
            const res = await Agent().get(`/users?email=${firstPersonEmail}`)
                .set("Authorization", `Bearer ${authTokenOfSecondPerson}`);
            res.should.have.status(200);
            res.body.should.have.property("name");
            res.body.should.have.property("last_name");
            res.body.should.have.property("last_seen");
        });

        it("Error of getting user - user is not exist", async () => {
            const res = await Agent().get("/users?email=userIsNotExist")
                .set("Authorization", `Bearer ${authTokenOfFirstPerson}`);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });
});
