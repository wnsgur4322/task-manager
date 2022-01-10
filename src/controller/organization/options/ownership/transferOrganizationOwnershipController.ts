import { NextFunction, Request, Response } from "express";
import OrgOwnershipTransfer from "../../../../data/schemas/organization/field-managers/OrgOwnershipTransfer";
import UserAuthenticator from "../../../../data/schemas/user/auth/UserAuthenticator";
import { getTheHTTPError } from "../../../../errorHandler";
import { HTTPOK200 } from "../../../../utils/http-responses/httpResponses";

const transferOrganizationOwnershipController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { currentOwnerUsername, currentOwnerPassword, newOwnerUsername } = req.body;
        const admin = (req as any).user;
        const userThatAuthenticated = await UserAuthenticator.login(currentOwnerUsername, currentOwnerPassword);
        await UserAuthenticator.verifyUserWhoIsLoggedInMatchesUserWhoAuthenticated(admin,userThatAuthenticated);
        const orgOwnershipTransfer = await OrgOwnershipTransfer.create(admin.organizationId, admin, newOwnerUsername);
        await orgOwnershipTransfer.transferOwnership();
        new HTTPOK200(`The ownership for ${admin.organizationName} was successfully transferred to ${newOwnerUsername}`).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default transferOrganizationOwnershipController;