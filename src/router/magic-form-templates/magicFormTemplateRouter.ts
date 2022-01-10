import express from "express";
import createMagicFormTemplateController from "../../controller/magic-form-templates/createMagicFormTemplateController";
import deleteMagicFormTemplateController from "../../controller/magic-form-templates/deleteMagicFormTemplateController";
import getAllMagicFormTemplatesController from "../../controller/magic-form-templates/getAllMagicFormTemplatesController";
import getSpecificMagicFormTemplateController from "../../controller/magic-form-templates/getSpecificMagicFormTemplateController";
import { permissions } from "../../data/schemas/user/fields/permissionLevelField";
import RouteProtector from "../../data/security/protect-route/RouteProtector";
const magicFormTemplateRouter = express.Router();

const routeProtector =
new RouteProtector()
.permissionLevel(permissions.MODERATOR)
.getMiddleware();

magicFormTemplateRouter.post("/create", routeProtector, createMagicFormTemplateController);
magicFormTemplateRouter.get("/retrieve-all", routeProtector, getAllMagicFormTemplatesController);
magicFormTemplateRouter.delete("/delete-one", routeProtector, deleteMagicFormTemplateController);
magicFormTemplateRouter.get("/get-form-template/:formId", getSpecificMagicFormTemplateController);

export default magicFormTemplateRouter;
