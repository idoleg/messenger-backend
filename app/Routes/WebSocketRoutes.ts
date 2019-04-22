import MessageWSController from "../Controllers/WebSocket/MessageController";
import { Socket } from "../index";

export default function() {
    // ws://localhost/
    Socket.on("test", (payload: any, client: any, result: any) => {
        result(true, { message: "how are you?" });
    });

    Socket.on("messages:send", MessageWSController.receive);
    Socket.on("messages:read", MessageWSController.read);
    Socket.on("chat:typing", MessageWSController.typing);

}
