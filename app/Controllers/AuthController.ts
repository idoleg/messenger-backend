import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Validator from "../../src/HttpServer/Validator";
import {Config, DB} from "../index";
import {IUser, IUserModel} from "../Models/User.d";
import UserResource from "../Resources/UserResource";

const User = DB.getModel<IUser, IUserModel>("User");

export default class AuthController {

    /**
     * @api {post} /auth/login Getting token in exchange for data credentials
     * @apiName Login
     * @apiGroup Auth
     * @apiPermission none
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email User unique E-mail
     * @apiParam {String} password User password
     *
     * @apiParamExample {json} A JSON example:
     *      {
     *          "email": "test@test.ru",
     *          "password": "012345678"
     *      }
     *
     * @apiUse AuthSuccess
     * @apiUse UserResourceCovered
     *
     * @apiError NotFound Credentials are wrong.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "message": "Credentials are wrong"
     *     }
     */
    public static async login(req: any, res: any, next: any) {
        try {
            const {email, password} = Validator(req.body, AuthController.loginValidationSchema);
            const user = await User.findOne({email});

            if (!user) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new httpError.NotFound("Credentials are wrong");
            }
            const token = user.createToken();

            res.status(200).json({token, user: (new UserResource(user)).attach(req, res).uncover()});
        } catch (err) {
            next(err);
        }
    }

    /**
     * @api {post} /auth/registration Create new user account
     * @apiName Registration
     * @apiGroup Auth
     * @apiPermission none
     * @apiVersion 1.0.0
     *
     * @apiParam {String} email User unique E-mail
     * @apiParam {String} name User any name. Min length is 8 symbols. Max length is 32 symbols.
     * @apiParam {String} password User password. Min length is 8 symbols. Max length is 32 symbols.
     *
     * @apiParamExample {json} A JSON example:
     *      {
     *          "email": "test@test.ru",
     *          "name": "Ivan Nikolaev",
     *          "password": "012345678"
     *      }
     *
     * @apiUse AuthSuccess
     * @apiUse UserResourceCovered
     *
     * @apiError Conflict This email has already existed.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 409 Conflict
     *     {
     *       "message": "This email has already existed"
     *     }
     */
    public static async registration(req: any, res: any, next: any) {
        try {
            const {email, name, password} = Validator(req.body, AuthController.registrationValidationSchema);

            if (await User.findOne({email})) {
                throw new httpError.Conflict("This email has already existed");
            }
            const user = await User.registration(email, password, name);
            const token = user.createToken();

            res.status(201).json({token, user: (new UserResource(user)).attach(req, res).uncover()});
        } catch (err) {
            next(err);
        }
    }

    protected static loginValidationSchema = {
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    };

    protected static registrationValidationSchema = {
        email: Joi.string().required().email(),
        name: Joi.string().required().min(2).max(32),
        password: Joi.string().required().min(8).max(32),
    };

    /**
     * @apiDefine AuthSuccess
     *
     * @apiSuccess {String} token User auth token
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "token": "eyJhbGciI6IkpXVCJ9.eyJ1c2VySV4cCI6MTU1MTM1MjA1Mn0.rnQ4Kb03tL4e2DY",
     *          "user": {
     *              "id": "5c3cd7be0e590c3124b68b7a",
     *              "email": "test@test.ru",
     *              "profile": {
     *                  "username": "",
     *                  "fullname": "Ivan Nikolaev",
     *                  "last_seen": null
     *              }
     *          }
     *      }
     */
}
