import httpError from "http-errors";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroup, IGroupModel} from "../../Models/Group.d";
import GroupInviteResource from "../../Resources/GroupInviteResource";
import Joi from "./../../../src/Joi/Joi";

const Group = DB.getModel<IGroup, IGroupModel>("Group");

export default class GroupController {

    public static async get(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }
            next(new GroupInviteResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async create(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }
            await group.createInvite();
            await group.save();
            next(new GroupInviteResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async delete(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            if (!await group.isCreator(req.user)) {
                throw new httpError.Forbidden("You cannot do it");
            }
            group.deleteInvite();
            await group.save();
            res.status(200).json({message: "successfully"});
        } catch (err) {
            next(err);
        }
    }
}
