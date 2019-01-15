import {Express} from "express";
import MemberController from "../Controllers/Group/MemberController";

export default function(express: Express) {

    this.get("/groups/:groupId/members", MemberController.getMembers);
    this.post("/groups/:groupId/members", MemberController.addMember);
    this.delete("/groups/:groupId/members/:userId", MemberController.deleteMember);

}
