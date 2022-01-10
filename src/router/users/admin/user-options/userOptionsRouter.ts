import express from "express";
import { addNewUserRoleController, removeExistingUserRoleController } from "../../../../controller/users/admin/user-options-requests/addRemoveRoleUserOptionController";
import changePermissionLevelUserOptionController from "../../../../controller/users/admin/user-options-requests/changePermissionLevelUserOptionController";
import { permissions } from "../../../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../../../data/security/protect-route/RouteProtector";
const userOptionsRouter: express.Router = express.Router();

const routeProtector =
new RouteProtector()
.permissionLevel(permissions.ADMIN)
.getMiddleware();

userOptionsRouter.post("/add-new-role/:userId", routeProtector, addNewUserRoleController);
userOptionsRouter.delete("/remove-existing-role/:userId", routeProtector, removeExistingUserRoleController);
userOptionsRouter.patch("/update-permission-level/:userId", routeProtector, changePermissionLevelUserOptionController);

export default userOptionsRouter;