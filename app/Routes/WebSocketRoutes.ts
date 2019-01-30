import {Socket} from "../index";

export default function () {
    // ws://localhost/
    Socket.on("test", (payload: any, client: any, result: any) => { // {"id":2,"name":"test"}
        result(true, {message: "how are you?"});
    });

}
