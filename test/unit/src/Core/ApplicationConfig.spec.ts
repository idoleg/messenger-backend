import {expect, should} from "chai";
import sinon from "sinon";
import ApplicationConfig from "../../../../src/Core/ApplicationConfig";

should();

/* tslint:disable:no-unused-expression */
describe("Application Config", () => {

    it("should set and get params in dot notation", () => {
        const config = new ApplicationConfig();

        const value = "this is a visual way";
        config.set("set.param.in.dot.notation", value);

        config.get("set.param.in.dot.notation").should.be.equal(value);
        config.get("set.param").should.be.an("object").which.has.property("in");

    });

    it("should get undefined for not existing paths if default value not passed", () => {
        const config = new ApplicationConfig();

        expect(config.get("this.path.not.exist")).to.be.undefined;
    });

    it("should get default value for not existing paths", () => {
        const config = new ApplicationConfig();

        config.get("this.path.not.exist", "default value").should.be.equal("default value");
    });

    it("should load params from file and save they to object by file name", async () => {
        const config = new ApplicationConfig();

        await config.loadFromFile(__dirname + "/_testedconfig.js");
        config.get("_testedconfig.secret").should.be.equal("test value");
    });

    it("should delete params", async () => {
        const config = new ApplicationConfig();

        config.set("test", "secret.value");
        config.get("test").should.be.equal( "secret.value");

        config.delete("test");
        expect(config.get("test")).to.be.undefined;
    });

    it("should return existence of param", async () => {
        const config = new ApplicationConfig();

        config.has("test").should.be.false;
        config.set("test", true);
        config.has("test").should.be.true;

    });
});
