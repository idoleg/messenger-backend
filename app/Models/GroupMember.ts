import {Mongoose, Schema} from "mongoose";

const GroupMemberSchema = new Schema({
    group: {type: String, required: true},
    member: {type: String, required: true},
});

export default (mongoose: Mongoose) => {
    return mongoose.model("GroupMember", GroupMemberSchema, "groups.members");
};
