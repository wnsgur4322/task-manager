import { adminAndOrganizationAccountRegisterController } from "../../../controller/users/auth/adminAndOrganizationAccountRegisterController";
import express from "express";
import loginController from "../../../controller/users/auth/loginController";
import logoutController from "../../../controller/users/auth/logoutController";
import { memberRegisterController } from "../../../controller/users/auth/memberRegisterController";

const authRouter: express.Router = express.Router();

authRouter.post("/create-admin-and-organization-account", adminAndOrganizationAccountRegisterController);
authRouter.post("/create-member-account", memberRegisterController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController);

export default authRouter;