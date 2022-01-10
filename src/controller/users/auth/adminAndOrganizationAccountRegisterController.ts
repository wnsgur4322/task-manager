import { Request, Response, NextFunction } from "express";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPCreated201, HTTPRedirect302 } from "../../../utils/http-responses/httpResponses";
import { getSimpleErrorMsg } from "../../../errorHandler";
import logger from "../../../logger";
import { createNewAdmin } from "../../../data/schemas/user/admin/Admin";
import { createNewOrganizationAccount } from "../../../data/schemas/organization/OrganizationAccountSchema";
import assertError from "../../../assertError";
import { createJWTTokenCookie } from "../../../data/security/token/jwt-token-methods";

const { APP_DOMAIN, ACCOUNT_PAGE_URL } = process.env;

/** @function This function handles the register route for the admin of an organization */
const adminAndOrganizationAccountRegisterController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // retrieve all fields from the body of the request
        const { firstName, lastName, email, organizationName, organizationToken, username, password, passwordConfirm } = req.body;
        // attempt to create the admin user document
        const newAdmin = await createNewAdmin(
            organizationToken, organizationName, firstName, lastName, email, username, password, passwordConfirm
        );
        assertError(newAdmin);
        // attempt to save the admin
        await newAdmin.save();
        (newAdmin as any).organizationId = "set to id of organization";
        // create the admin's new organization account
        const newOrganizationAccount = await createNewOrganizationAccount(organizationName, newAdmin);
        assertError(newOrganizationAccount);
        // attempt to save the organization account
        await newOrganizationAccount.save({ validateBeforeSave: false });
        // attempt to save the admin again
        await newAdmin.save({ validateBeforeSave: false});
        logger(`The organization account for "${organizationName}" was created successfully.`);
        logger(`User with username "${username}" signed up.`);
        // return the jwt to the admin
        await createJWTTokenCookie(res, newAdmin._id);
        // redirect the user to their account page
        //new HTTPRedirect302(`${APP_DOMAIN}${ACCOUNT_PAGE_URL}`).send(res);
        new HTTPCreated201("You account was created successfully!").send(res);
    } catch (err) {
        const httpErr = new HTTPBadRequest400(getSimpleErrorMsg(err));
        return next(httpErr);
    }
};

export { adminAndOrganizationAccountRegisterController };