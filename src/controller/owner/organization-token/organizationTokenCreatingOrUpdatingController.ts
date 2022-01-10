import { Response, Request, NextFunction } from "express";
import { getTheHTTPError } from "../../../errorHandler";
import { HTTPCreated201 } from "../../../utils/http-responses/httpResponses";
import logger from "../../../logger";
import OrgToken from "../../../data/schemas/organization/field-managers/OrgToken";

/** This controller allows a user with OWNER permissions to create and send an organization token to an admin */
const createOrUpdateOrganizationToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationName, adminEmail, adminEmailConfirm } = req.body;

        const orgToken = await OrgToken.create(organizationName, adminEmail, adminEmailConfirm);
        const unhashedToken = await orgToken.save();
        logger(`The organization token was created successfully for "${organizationName}".`);
        new HTTPCreated201(`The organization token for ${organizationName} was created and sent to ${adminEmail} successfully!`, { token: unhashedToken }).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default createOrUpdateOrganizationToken;