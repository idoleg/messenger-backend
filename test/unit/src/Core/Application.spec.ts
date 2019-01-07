import {expect, should} from "chai";
import sinon from "sinon";
import Application from "../../../../src/Core/Application";

should();

/* tslint:disable:no-unused-expression */
describe("Application", () => {

    describe("Unique String getter", () => {

        it("should return random string every call", async () => {
            const application = new Application();
            const uniqueStrings: string[] = [];

            for (let i = 0; i < 7; i++) {
                uniqueStrings.push(application.getUniqueString());
            }

            allMembersOfArrayAreUnique(uniqueStrings);
            // console.log(uniqueStrings);
        });

        it("should return random string every call for different instances", async () => {
            const uniqueStrings: string[] = [];

            for (let i = 0; i < 7; i++) {
                const application = new Application();
                uniqueStrings.push(application.getUniqueString());
            }

            allMembersOfArrayAreUnique(uniqueStrings);
            // console.log(uniqueStrings);
        });

    });

});

function allMembersOfArrayAreUnique(array: string[]) {
    let lastItem: string | null = null;

    for (const item of array) {
        if (lastItem) item.should.be.not.equal(lastItem);

        lastItem = item;
    }
}
