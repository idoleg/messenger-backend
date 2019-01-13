import bcrypt from "bcryptjs";
import httpError from "http-errors";
import Joi from "joi";
import jwt from "jsonwebtoken";
import Validator from "../../src/HttpServer/Validator";
import { DB, Config } from "../index";

const User = DB.getModel("User");

export default class Auth {

  public static async login(req: any, res: any, next: any) {
    try {
      const email = req.body.email;
      const password = req.body.password;
      const user = await User.findOne({ email });
      if (!user) {
        throw new httpError.NotFound("Credentials are wrong");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new httpError.NotFound("Credentials are wrong");
      }
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        Config.get("auth.privateKey"),
        { expiresIn: Config.get("auth.expiresTime") },
      );
      res.status(200).json({ token, userId: user._id.toString() });
    } catch (err) {
      next(err);
    }
  }

  public static async registration(req: any, res: any, next: any) {
    try {
      const { email, name, password } = Validator(req.body, Auth.validationSchema);
      let user = await User.findOne({ email });
      if (user) {
        throw new httpError.Conflict("This email has already existed");
      }
      const hashedPw = await bcrypt.hash(password, 12);
      user = new User({
        email,
        password: hashedPw,
        profile: { name },
      });
      const result = await user.save();
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        Config.get("auth.privateKey"),
        { expiresIn: Config.get("auth.expiresTime") },
      );
      res.status(201).json({ token, userId: result._id });
    } catch (err) {
      next(err);
    }
  }

  protected static validationSchema = {
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(32),
    password: Joi.string().required().min(8).max(32),
  };
}
