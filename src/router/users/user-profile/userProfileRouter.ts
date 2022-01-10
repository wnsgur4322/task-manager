import express from "express";
import getMyUserProfileInfoController from "../../../controller/users/user-profile/getMyUserProfileInfoController";
import { getUserProfileInfoController, getUseridByUsername } from "../../../controller/users/user-profile/getUserProfileInfoController";
import { updateUserProfileInfoController } from "../../../controller/users/user-profile/updateUserProfileInfoController";
import { permissions } from "../../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../../data/security/protect-route/RouteProtector";
const userProfileRouter = express.Router();

const routeProtector =
new RouteProtector()
.permissionLevel(permissions.MEMBER)
.getMiddleware();

userProfileRouter.get("/get-info/:id", routeProtector, getUserProfileInfoController);
userProfileRouter.get("/get-info-username/:username", routeProtector, getUseridByUsername);
userProfileRouter.patch("/update-my-info", routeProtector, updateUserProfileInfoController);
userProfileRouter.get("/my-info", routeProtector, getMyUserProfileInfoController);

export default userProfileRouter;