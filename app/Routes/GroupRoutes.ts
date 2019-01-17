import {Express} from "express";
import GroupController from "../Controllers/Group/GroupController";
import MemberController from "../Controllers/Group/MemberController";

export default function(express: Express) {

    this.get("/groups/:id", GroupController.getGroup);
    this.post("/groups", GroupController.addGroup);
    this.put("/groups/:id", GroupController.updateGroup);
    express.use("/groups/:id", GroupController.leaveGroup);

    this.get("/groups/:groupId/members", MemberController.getMembers);
    this.post("/groups/:groupId/members", MemberController.addMember);
    this.delete("/groups/:groupId/members/:userId", MemberController.deleteMember);

}
