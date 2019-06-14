import Joi from "joi";
import JoiMongodbObjectValidator from "./JoiMongodbObjectRule";

const customJoi = Joi.extend(JoiMongodbObjectValidator);

export default customJoi;
