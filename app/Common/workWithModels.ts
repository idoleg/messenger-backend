export const getRightId = (id: any) => {
    let tempId;
    if (typeof id === "string") {
        tempId = Types.ObjectId(id);
    } else {
        tempId = id._id;
    }

    return tempId;
};
