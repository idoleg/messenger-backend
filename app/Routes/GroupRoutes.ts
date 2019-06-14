import {Express} from "express";
import GroupController from "../Controllers/Group/GroupController";
import GroupInviteController from "../Controllers/Group/GroupInviteController";
import MemberController from "../Controllers/Group/MemberController";
import GroupMessageController from "../Controllers/Group/MessageController";

export default function(express: Express) {

    this.get("/groups/:groupId", GroupController.get);
    this.post("/groups", GroupController.add);
    this.put("/groups/:groupId", GroupController.update);
    express.use("/groups/:groupId", GroupController.leave); // for UNLINK
    express.use("/groups", GroupController.enter); // for LINK

    this.get("/groups/:groupId/invites", GroupInviteController.get);
    this.post("/groups/:groupId/invites", GroupInviteController.create);
    this.delete("/groups/:groupId/invites", GroupInviteController.delete);

    this.get("/groups/:groupId/members", MemberController.get);
    this.post("/groups/:groupId/members", MemberController.add);
    this.put("/groups/:groupId/members/:userId", MemberController.changeRole);
    this.delete("/groups/:groupId/members/:userId", MemberController.delete);

    this.get("/groups/:groupId/messages", GroupMessageController.getCollection);
    this.get("/groups/:groupId/messages/:messageId", GroupMessageController.getOne);
    this.post("/groups/:groupId/messages", GroupMessageController.send);
}
