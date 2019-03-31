import httpError from "http-errors";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroup, IGroupModel} from "../../Models/Group.d";
import GroupResource from "../../Resources/GroupResource";
import Joi from "./../../../src/Joi/Joi";

const Group = DB.getModel<IGroup, IGroupModel>("Group");

export default class GroupController {

    public static async get(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            if (!group) {
                throw new httpError.NotFound("Group doesnt exist!");
            }
            const invitation_code = req.query.invitation_code;

            if (!await group.isMember(req.user) && (!invitation_code || invitation_code !== group.invitation_code)) {
                throw new httpError.Forbidden("You cannot do it");
            }

            next(new GroupResource(group));

        } catch (err) {
            next(err);
        }
    }

    public static async add(req: any, res: any, next: any) {
        try {
            const {name, description} = Validator(req.body, GroupController.validationAddSchema);
            const group = await Group.addGroup(req.user, name, description);

            group.addMember(req.user);

            next(new GroupResource(group));

        } catch (err) {
            next(err);
        }
    }

    public static async update(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {name, description} = Validator(req.body, GroupController.validationUpdateSchema);
            const group = await Group.getGroup(groupId);
            if (!group) {
                throw new httpError.NotFound("Group doesnt exist!");
            }
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }

            group.updateGroup(name, description);
            await group.save();

            next(new GroupResource(group));

        } catch (err) {
            next(err);
        }
    }

    public static async enter(req: any, res: any, next: any) {
        try {
            if (req.method === "LINK") {
                const {invitation_code} = Validator(req.query, GroupController.validationEnterSchema);
                const group = await Group.getGroupByInvitationCode(invitation_code);

                if (!group) {
                    throw new httpError.NotFound("Credentials are wrong");
                }

                await group.addMember(req.user);

                next(new GroupResource(group));

            } else {
                next();
            }
        } catch (err) {
            next(err);
        }
    }

    public static async leave(req: any, res: any, next: any) {
        try {
            if (req.method === "UNLINK") {
                const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
                const group = await Group.getGroup(groupId);

                await group.deleteMember(req.user);

                res.status(200).json({message: "successfully"});

            } else {
                next();
            }
        } catch (err) {
            next(err);
        }
    }

    protected static validationAddSchema = {
        name: Joi.string().required().min(2),
        description: Joi.string(),
    };

    protected static validationEnterSchema = {
        invitation_code: Joi.string().required(),
    };

    protected static validationUpdateSchema = {
        name: Joi.string().min(2),
        description: Joi.string(),
    };
}
