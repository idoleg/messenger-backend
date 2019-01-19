import httpError from "http-errors";
import Validator from "../../../src/HttpServer/Validator";
import {DB} from "../../index";
import {IGroup, IGroupModel} from "../../Models/Group.d";
import GroupResource from "../../Resources/GroupResource";
import Joi from "./../../../src/Joi/Joi";

const Group = DB.getModel<IGroup, IGroupModel>("Group");

export default class GroupController {

    public static async getGroup(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const group = await Group.getGroup(groupId);
            next(new GroupResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async addGroup(req: any, res: any, next: any) {
        try {
            const {name, description} = Validator(req.body, GroupController.validationAddSchema);
            const group = await Group.addGroup(req.user, name, description);
            group.addMember(req.user);
            next(new GroupResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async updateGroup(req: any, res: any, next: any) {
        try {
            const {groupId} = Validator(req.params, {groupId: Joi.objectId()});
            const {name, description} = Validator(req.body, GroupController.validationUpdateSchema);
            const group = await Group.getGroup(groupId);
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

    public static async leaveGroup(req: any, res: any, next: any) {
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

    protected static validationUpdateSchema = {
        name: Joi.string().min(2),
        description: Joi.string(),
    };
}
