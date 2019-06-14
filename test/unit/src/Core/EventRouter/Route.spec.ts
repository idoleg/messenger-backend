import {expect, should} from "chai";
import sinon from "sinon";
import Route, {TypeOfPayload} from "../../../../../src/Core/EventRouter/Route";
import RouteGroup from "../../../../../src/Core/EventRouter/RouteGroup";

should();

/* tslint:disable:no-unused-expression */
describe("Event Routing - Route", () => {

    it("should identify right type of payload. We can pass just function", () => {
        const callback = sinon.spy();
        const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

        const route = new Route(routeGroupMock, "myHandler", "myTestRoute", callback);

        route.type.should.be.equal(TypeOfPayload.CALLBACK);
    });

    it("should identify right type of payload. We can pass string \"ClassName@methodName\" and it will be recognized as JS-class", () => {
        const callback = sinon.spy();
        const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

        const route = new Route(routeGroupMock, "myHandler", "myTestRoute", "ClassName@methodName");

        route.type.should.be.equal(TypeOfPayload.CONTROLLER);
    });

    it("should identify right type of payload. We can pass just function without a route name", () => {
        const callback = sinon.spy();
        const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

        const route = new Route(routeGroupMock, "myHandler", callback);

        route.type.should.be.equal(TypeOfPayload.CALLBACK);
    });

    it("should identify right type of payload. We can pass string \"ClassName@methodName\" without a route name", () => {
        const callback = sinon.spy();
        const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

        const route = new Route(routeGroupMock, "myHandler", "ClassName@methodName");

        route.type.should.be.equal(TypeOfPayload.CONTROLLER);
    });

    it("should return name based on prefix of his event group", () => {
        const prefix = "prefix:";
        const callback = sinon.spy();
        const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

        const route = new Route(routeGroupMock, "myHandler", "ClassName@methodName");
        routeGroupMock.getPrefix.returns("");

        const nameWithoutPrefix = route.getName();
        routeGroupMock.getPrefix.returns(prefix);
        route.getName().should.be.equal(prefix + nameWithoutPrefix);
    });

    describe("Route applying", () => {

        it("should call its handler with it route payload", () => {
            const callback = sinon.spy();
            const handler = sinon.spy();
            const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

            const route = new Route(routeGroupMock, "myHandler", "myTestRoute", callback);

            route.apply(handler);

            handler.calledWithExactly(route.getName(), callback, "myHandler").should.be.true;
        });

        it("should apply route payload to its handler only once", () => {
            const callback = sinon.spy();
            const handler = sinon.spy();
            const routeGroupMock = sinon.createStubInstance<RouteGroup>(RouteGroup) as any;

            const route = new Route(routeGroupMock, "myHandler", "myTestRoute", callback);

            route.apply(handler);
            route.apply(handler);

            handler.calledOnce.should.be.true;
        });

    });
});
