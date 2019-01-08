import {Mongoose, Schema} from "mongoose";

const GroupSchema = new Schema({
    creator: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, default: null},
    invitingCode: {type: String, default: null},
});

export default (mongoose: Mongoose) => {
    return mongoose.model("Group", GroupSchema);
};
