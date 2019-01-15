import {Types} from "mongoose";

export default {
    name: "objectId",
    // base: Joi.string(),
    language: {
        invalid: "needs to be a valid ObjectId",
        required: "required a valid ObjectId",
    },
    // pre(value: any, state: any, options: any) {
    //     if (!this._flags) this._flags = {};
    // },
    coerce(value: any, state: any, options: any) {
        if (!Types.ObjectId.isValid(value)) {
            return this.createError("objectId.invalid", {value}, state, options);
        }

        if (this._required && null == value) {
            return this.createError("objectId.required", {value}, state, options);
        }

        return value;
    },
    rules: [
        {
            name: "required",
            setup(params: any) {
                params._required = true;
            },
        },
    ],
};
