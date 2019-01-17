import bcrypt from "bcryptjs";
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
            const {id} = Validator(req.params, {id: Joi.objectId()});
            const group = await Group.getGroup(id);
            next(new GroupResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async addGroup(req: any, res: any, next: any) {
        try {
            const {name, description} = Validator({name: req.body.name, description: req.body.description}, GroupController.validationAddSchema);
            const group = await Group.addGroup(req.user, name, description);
            group.addMember(req.user);
            next(new GroupResource(group));
        } catch (err) {
            next(err);
        }
    }

    public static async updateGroup(req: any, res: any, next: any) {
        try {
            const {id} = Validator(req.params, {id: Joi.objectId()});
            const {name, description} = Validator({name: req.body.name, description: req.body.description}, GroupController.validationUpdateSchema);
            const group = await Group.getGroup(id);
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
                const {id} = Validator(req.params, {id: Joi.objectId()});
                const group = await Group.getGroup(id);
                await group.deleteMember(req.user);
                res.status(200).json({});
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
