import { Socket } from "../index";
import MessageWSController from "../Controllers/WebSocket/MessageController";

export default function () {
    // ws://localhost/
    Socket.on("test", (payload: any, client: any, result: any) => {
        result(true, { message: "how are you?" });
    });

    Socket.on("messages:send", MessageWSController.receive);

}
