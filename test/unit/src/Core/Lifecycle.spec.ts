import {expect, should} from "chai";
import sinon from "sinon";
import Lifecycle, {Status} from "../../../../src/Core/Lifecycle";

should();

/* tslint:disable:no-unused-expression */
describe("Application Lifecycle", () => {

    it("should return correct statuses in each state", async () => {
        const lifecycle = new Lifecycle(false);

        lifecycle.getStatus().should.be.equal(Status.NOT_INIT);

        await lifecycle.init();
        lifecycle.getStatus().should.be.equal(Status.WORKING);

        await lifecycle.destroy();
        lifecycle.getStatus().should.be.equal(Status.DESTROYED);

    });

    describe("Handler setter (on)", () => {

        it("should not call handlers right after they adding", () => {
            const lifecycle = new Lifecycle(false);

            const callback = sinon.spy();

            lifecycle.on("beforeInit", callback);
            callback.notCalled.should.be.true;
        });

        it("should allow adding handler by alias", async () => {
            const lifecycle = new Lifecycle(false);

            const callback = sinon.spy();

            lifecycle.on("beforeStart", callback);
            callback.notCalled.should.be.true;
            await lifecycle.init();
            callback.called.should.be.true;
        });

        it("should allow to pass object as an event handler", async () => {
            const lifecycle = new Lifecycle(false);

            const object = {
                beforeInit: sinon.spy(),
                otherMethod: sinon.spy(),
            };

            lifecycle.on(object);
            object.beforeInit.notCalled.should.be.true;
            object.otherMethod.notCalled.should.be.true;

            await lifecycle.init();
            object.beforeInit.called.should.be.true;
            object.otherMethod.notCalled.should.be.true;
        });

        it("should ignore if passed only string to first argument", async () => {
            const lifecycle = new Lifecycle(false);

            lifecycle.on("beforeStart");
        });

    });

    describe("Lifecycle emitter", () => {

        it("should call handlers on Lifecycle-events", async () => {
            const lifecycle = new Lifecycle(false);

            const beforeInitCallback = sinon.spy();
            const initCallback = sinon.spy();
            const afterInitCallback = sinon.spy();
            const beforeDestroyCallback = sinon.spy();
            const destroyedCallback = sinon.spy();

            lifecycle.on("beforeInit", beforeInitCallback);
            lifecycle.on("init", initCallback);
            lifecycle.on("afterInit", afterInitCallback);
            lifecycle.on("beforeDestroy", beforeDestroyCallback);
            lifecycle.on("destroyed", destroyedCallback);

            await lifecycle.init();
            beforeInitCallback.called.should.be.true;
            initCallback.calledAfter(beforeInitCallback).should.be.true;
            afterInitCallback.calledAfter(initCallback).should.be.true;

            beforeDestroyCallback.notCalled.should.be.true;
            await lifecycle.destroy();
            beforeDestroyCallback.called.should.be.true;
            destroyedCallback.calledAfter(beforeDestroyCallback).should.be.true;

            initCallback.calledOnce.should.be.true;
        });

        it("should call methods of passed object which have named as Lifecycle-events ", async () => {
            const lifecycle = new Lifecycle(false);

            const object = {
                beforeInit: sinon.spy(),
                init: sinon.spy(),
                afterInit: sinon.spy(),
                beforeDestroy: sinon.spy(),
                destroyed: sinon.spy(),
            };

            lifecycle.on(object);

            await lifecycle.init();
            object.beforeInit.called.should.be.true;
            object.init.calledAfter(object.beforeInit).should.be.true;
            object.afterInit.calledAfter(object.init).should.be.true;

            object.beforeDestroy.notCalled.should.be.true;
            await lifecycle.destroy();
            object.beforeDestroy.called.should.be.true;
            object.destroyed.calledAfter(object.beforeDestroy).should.be.true;
        });

        it("should catch exceptions", async () => {
            const lifecycle = new Lifecycle(false);

            const beforeInitCallback = sinon.stub().throws();

            lifecycle.on("beforeInit", beforeInitCallback);

            await lifecycle.init();

            lifecycle.getStatus().should.be.equal(Status.ERROR);
        });

    });

});
