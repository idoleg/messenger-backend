import jwt from "jsonwebtoken";
import {Agent, Config, DB} from "./Bootstrap";

describe("Auth API", () => {

    describe("POST: /auth/login", () => {

        it("Successful login", async () => {
            const name = "Tester";
            const email = Math.random() + "tester@com.ru";
            const password = "012345678";

            const user = await DB.getModel("User").registration(email, password, name);

            const res = await Agent().post("/auth/login").send({email, password});

            res.should.have.status(200);
            readJwt(res.body.token).userId.should.be.equal(user.id);

        });

        it("Login error because password is wrong", async () => {
            const name = "Tester";
            const email = Math.random() + "tester@com.ru";
            const password = "012345678";
            const anotherPassword = "abcdefgh";

            await DB.getModel("User").registration(email, password, name);

            const res = await Agent().post("/auth/login").send({email, password: anotherPassword});

            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");

        });

        it("Login error because email does not exist", async () => {
            const email = Math.random() + "tester@com.ru";
            const password = "012345678";

            const res = await Agent().post("/auth/login").send({email, password});

            res.should.have.status(404);
            res.body.message.should.be.equal("Credentials are wrong");

        });

    });

    describe("POST: /auth/registration", () => {

        it("Successful registration", async () => {
            const name = "Tester";
            const email = Math.random() + "tester@com.ru";
            const password = "012345678";

            const res = await Agent().post("/auth/registration").send({name, email, password});

            res.should.have.status(201);
            readJwt(res.body.token).userId.should.be.equal(res.body.user.id);

        });

        it("Registration error because email has already existed", async () => {
            const name = "Tester";
            const email = Math.random() + "tester@com.ru";
            const password = "012345678";

            await Agent().post("/auth/registration").send({name, email, password});

            const res = await Agent().post("/auth/registration").send({name, email, password});

            res.should.have.status(409);
            res.body.message.should.be.equal("This email has already existed");

        });

        it("Registration error because you have not sent required fields", async () => {
            const res = await Agent().post("/auth/registration").send();

            res.should.have.status(400);
            res.body.message.should.be.equal("Validation error");

        });

    });

});

function readJwt(token: string) {
    return jwt.verify(token, Config.get("auth.privateKey")) as any;
}
