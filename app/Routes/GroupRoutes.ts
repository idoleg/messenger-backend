import {Express} from "express";
import GroupController from "../Controllers/Group/GroupController";
import GroupInviteController from "../Controllers/Group/GroupInviteController";
import MemberController from "../Controllers/Group/MemberController";
import GroupMessageController from "../Controllers/Group/MessageController";

export default function(express: Express) {

    this.get("/groups/:groupId", GroupController.getGroup);
    this.post("/groups", GroupController.addGroup);
    this.put("/groups/:groupId", GroupController.updateGroup);
    express.use("/groups/:groupId", GroupController.enterLeaveGroup); // for UNLINK
    express.use("/groups", GroupController.enterLeaveGroup); // for LINK

    this.get("/groups/:groupId/invites", GroupInviteController.getInvite);
    this.post("/groups/:groupId/invites", GroupInviteController.createInvite);
    this.delete("/groups/:groupId/invites", GroupInviteController.deleteInvite);

    this.get("/groups/:groupId/members", MemberController.getMembers);
    this.post("/groups/:groupId/members", MemberController.addMember);
    this.put("/groups/:groupId/members/:userId", MemberController.changeRoleForMember);
    this.delete("/groups/:groupId/members/:userId", MemberController.deleteMember);

    this.get("/groups/:groupId/messages", GroupMessageController.getCollection);
    this.get("/groups/:groupId/messages/:messageId", GroupMessageController.getOne);
    this.post("/groups/:groupId/messages", GroupMessageController.send);
}
