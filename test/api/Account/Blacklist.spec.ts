import { fakeBlacklist, fakeContacts, fakeUsers} from "../../../dist/app/faker";
import { Agent } from "../Bootstrap";

const AMOUNT_OF_USERS = 5;

const data: any = {};
let authTokenOfAccount: string;

before(async () => {
    data.users = await fakeUsers(AMOUNT_OF_USERS);
    data.mainUser = data.users.pop();
    data.anotherUser = data.users.pop();

    data.mainUserBannedAccount = await fakeBlacklist(1, [ data.users.pop() ], data.mainUser) ;
    data.anotherUserBannedAccount = await fakeBlacklist(1, [ data.users.pop() ], data.anotherUser) ;

    data.userForManipulations = data.users.pop();

    authTokenOfAccount = data.mainUser.createToken();
});

describe("Blacklist API", () => {
    describe("Get blacklist GET /account/blacklist", () => {

        it("Successful getting contacts", async () => {
            const res = await Agent().get(`/account/blacklist`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(200);
            res.body.should.have.property("user");
            res.body.should.have.property("offset");
            res.body.should.have.property("data");
        });

    });

    describe("Post new user to blacklist POST /account/blacklist", async () => {
        it("Successful posting contact", async () => {
            const res = await Agent().post(`/account/blacklist/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ id: data.userForManipulations._id });

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("addedAt");
        });

        it("Successful posting same account", async () => {
            const res = await Agent().post(`/account/blacklist/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`)
                .send({ id: data.userForManipulations._id });

            res.should.have.status(200);
            res.body.should.have.property("id");
            res.body.should.have.property("addedAt");
        });

        it("Error of posting account - property id is required", async () => {
            const res = await Agent().post(`/account/contacts/`)
                .set("Authorization", `Bearer ${authTokenOfAccount}`);

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");
        });
    });

    describe("Delete account from blacklist DELETE /account/blacklist/%id", () => {
       it("Successful deleting contact", async () => {
           const res = await Agent().delete(`/account/blacklist/${data.mainUserBannedAccount._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.should.be.equal("successfully");
       });

       it("Successful result of deleting wrong contact", async () => {
           const res = await Agent().delete(`/account/blacklist/${data.anotherUserBannedAccount._id}`)
               .set("Authorization", `Bearer ${authTokenOfAccount}`);

           res.should.have.status(200);
           res.body.should.be.equal("successfully");
       });
    });
});
