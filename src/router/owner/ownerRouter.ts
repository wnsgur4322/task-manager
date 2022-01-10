import express from "express";
import getCurrentOrganizationTokens from "../../controller/owner/organization-token/getCurrentOrganizationTokensController";
import createOrUpdateOrganizationToken from "../../controller/owner/organization-token/organizationTokenCreatingOrUpdatingController";
import removeOrganizationTokenController from "../../controller/owner/organization-token/removeOrganizationTokenController";

const ownerRouter: express.Router = express.Router();

ownerRouter.post("/create-organization-token", createOrUpdateOrganizationToken);
ownerRouter.put("/update-organization-token", createOrUpdateOrganizationToken);
ownerRouter.delete("/remove-organization-token", removeOrganizationTokenController);
ownerRouter.get("/get-organization-tokens", getCurrentOrganizationTokens);

export default ownerRouter;