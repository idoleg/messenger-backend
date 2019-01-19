import {Express} from "express";
import GroupController from "../Controllers/Group/GroupController";
import GroupInviteController from "../Controllers/Group/GroupInviteController";
import MemberController from "../Controllers/Group/MemberController";

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
    this.delete("/groups/:groupId/members/:userId", MemberController.deleteMember);

}
