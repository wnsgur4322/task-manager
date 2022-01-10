import express from "express";
import createNewEmailListController from "../../../controller/organization/options/personalization/email-lists/createNewEmailListController";
import getAllEmailListsController from "../../../controller/organization/options/personalization/email-lists/getAllEmailListsController";
import { permissions } from "../../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../../data/security/protect-route/RouteProtector";
const emailListsRouter = express.Router();

const routeProtector =
new RouteProtector()
.permissionLevel(permissions.MODERATOR)
.getMiddleware();

emailListsRouter.post("/create-new", routeProtector, createNewEmailListController);
emailListsRouter.get("/retrieve-all", routeProtector, getAllEmailListsController);

export default emailListsRouter;