import httpError from "http-errors";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroup, IGroupModel} from "../../Models/Group.d";
import GroupInviteResource from "../../Resources/GroupInviteResource";
import Joi from "./../../../src/Joi/Joi";

const Group = DB.getModel<IGroup, IGroupModel>("Group");

export default class GroupController {

    public static async getInvite(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            next(new GroupInviteResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async createInvite(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            group.createInvite();
            await group.save();
            next(new GroupInviteResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async deleteInvite(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            group.deleteInvite();
            await group.save();
            res.status(200).json({message: "successfully"});
        } catch (err) {
            next(err);
        }
    }

    protected static validationAddSchema = {
        name: Joi.string().required().min(2),
        description: Joi.string(),
    };

    protected static validationUpdateSchema = {
        name: Joi.string().min(2),
        description: Joi.string(),
    };
}
