import httpError from "http-errors";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroup, IGroupModel} from "../../Models/Group.d";
import {IGroupMember, IGroupMemberModel} from "../../Models/GroupMember.d";
import {IUser, IUserModel} from "../../Models/User.d";
import {IUserChat, IUserChatModel} from "../../Models/UserChat.d";
import GroupMemberCollectionResource from "../../Resources/GroupMemberCollectionResource";
import GroupMemberResource from "../../Resources/GroupMemberResource";
import Joi from "./../../../src/Joi/Joi";

const Group = DB.getModel<IGroup, IGroupModel>("Group");
const GroupMember = DB.getModel<IGroupMember, IGroupMemberModel>("GroupMember");
const User = DB.getModel<IUser, IUserModel>("User");
const UserChat = DB.getModel<IUserChat, IUserChatModel>("UserChat");

export default class MemberController {

    public static async get(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {offset} = Validator(req.query, {offset: Joi.number()});

            if (!await GroupMember.isMember(groupId, req.user)) {
                throw new httpError.NotFound("This group not found or not allowed for you");
            }
            const members = await GroupMember.getMembersFor(groupId, offset);

            next(new GroupMemberCollectionResource(members, {group_id: groupId, offset}));
        } catch (err) {
            next(err);
        }
    }

    public static async add(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {user} = Validator(req.body, {user: Joi.objectId().required()});

            if (!await User.isExist(user)) {
                throw new httpError.UnprocessableEntity("This user does not exist");
            }
            if (!await GroupMember.isMember(groupId, req.user)) {
                throw new httpError.NotFound("This group not found or not allowed for you");
            }

            const member = await GroupMember.addMemberTo(groupId, user);
            UserChat.addChat(user, true, groupId, user, "I am here");

            next(new GroupMemberResource(member));

        } catch (err) {
            next(err);
        }
    }

    public static async changeRole(req: any, res: any, next: any) {
        try {
            const {groupId, userId} = Validator(req.params, {
                groupId: Joi.objectId(),
                userId: Joi.objectId().required(),
            });
            const {role} = Validator(req.body, {
                role: Joi.string().required().regex(/speaker|moderator|administrator/),
            });
            const group = await Group.findById(groupId);

            if (!group) {
                throw new httpError.NotFound("This group not found or not allowed for you");
            }
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }
            if (!await GroupMember.isMember(groupId, userId)) {
                throw new httpError.NotFound("This group not found or not allowed for you");
            }
            const member = await group.changeRoleForMember(userId, role);

            next(new GroupMemberResource(member));
        } catch (err) {
            next(err);
        }
    }

    public static async delete(req: any, res: any, next: any) {
        try {
            const {groupId, userId} = Validator(req.params, {groupId: Joi.objectId(), userId: Joi.objectId().required()});
            const group = await Group.findById(groupId);

            if (!group) {
                throw new httpError.NotFound("This group not found or not allowed for you");
            }
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }

            group.deleteMember(userId);

            res.json({message: "successfully"});

        } catch (err) {
            next(err);
        }
    }

}
