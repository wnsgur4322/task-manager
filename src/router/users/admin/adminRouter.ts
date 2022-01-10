import express from "express";
import adminSendMemberInviteController from "../../../controller/users/admin/adminSendMemberInviteController";
import { deleteUserAccountController } from "../../../controller/users/admin/deleteUserAccountController";
import revokeMemberInviteController from "../../../controller/users/admin/revokeMemberInviteController";
import { permissions } from "../../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../../data/security/protect-route/RouteProtector";
const adminRouter: express.Router = express.Router();

const moderatorRouteProtector =
new RouteProtector()
.permissionLevel(permissions.MODERATOR)
.getMiddleware();

const adminRouteProtector =
new RouteProtector()
.permissionLevel(permissions.MODERATOR)
.getMiddleware();


adminRouter.post("/send-member-invite", moderatorRouteProtector, adminSendMemberInviteController);
adminRouter.delete("/revoke-member-invite", moderatorRouteProtector, revokeMemberInviteController);
adminRouter.delete("/delete-user-account", adminRouteProtector, deleteUserAccountController);

export default adminRouter;