import httpError from "http-errors";
import Joi, {SchemaLike} from "joi";

export default function Validator(data: any, schema: SchemaLike) {
    const validationResult = Joi.validate(data, schema, {abortEarly: false});

    if (validationResult.error) {
        throw new httpError.BadRequest({message: "Validation error", data: validationResult.error.details} as any);
    }

    return validationResult.value;
}
