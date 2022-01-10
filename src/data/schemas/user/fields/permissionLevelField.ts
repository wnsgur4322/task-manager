// enum of permissions ranging from limited permissions to maximal permissions
enum permissions {
    MEMBER,
    MODERATOR,
    ADMIN,
    OWNER
}

const permissionLevelField: object = {
    type: Number,
    required: [true, "The permission level is required."]
};

export { permissions, permissionLevelField };