import express from "express";
import deleteOrganizationAccountController from "../../controller/organization/options/deletion/deleteOrganizationAccountController";
import { getOrganizationInfoController } from "../../controller/organization/organization-info/getOrganizationInfoController";
import { createCustomRoleController } from "../../controller/organization/options/roles/createCustomRoleController";
import { deleteCustomRoleController } from "../../controller/organization/options/roles/deleteCustomRoleController";
import { permissions } from "../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../data/security/protect-route/RouteProtector";
import changeMemberLimitController from "../../controller/organization/options/personalization/changeMemberLimitController";
import changeBioController from "../../controller/organization/options/personalization/changeBioController";
import transferOrganizationOwnershipController from "../../controller/organization/options/ownership/transferOrganizationOwnershipController";
const organizationRouter: express.Router = express.Router();

const adminRouteProtector =
new RouteProtector()
.permissionLevel(permissions.ADMIN)
.getMiddleware();

organizationRouter.get("/get-account-info/:organizationNameOrId", getOrganizationInfoController);
organizationRouter.post("/create-new-role", adminRouteProtector, createCustomRoleController);
organizationRouter.delete("/remove-role", adminRouteProtector, deleteCustomRoleController);
organizationRouter.delete("/delete-organization-account", adminRouteProtector, deleteOrganizationAccountController);
organizationRouter.patch("/change-member-limit", adminRouteProtector, changeMemberLimitController);
organizationRouter.patch("/change-bio", adminRouteProtector, changeBioController);
organizationRouter.patch("/transfer-ownership", adminRouteProtector, transferOrganizationOwnershipController);

export default organizationRouter;