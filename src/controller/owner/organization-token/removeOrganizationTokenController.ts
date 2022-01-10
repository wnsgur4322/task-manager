import { Request, Response, NextFunction } from "express";
import OrgToken from "../../../data/schemas/organization/field-managers/OrgToken";
import { getTheHTTPError } from "../../../errorHandler";
import logger from "../../../logger";
import { HTTPNoContent204 } from "../../../utils/http-responses/httpResponses";

const removeEmail = "weDontNeedARealAddress@nowhere.com";

const removeOrganizationTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { organizationName } = req.body;
        const orgToken = await OrgToken.create(organizationName, removeEmail, removeEmail);
        await orgToken.remove();
        logger(`The organization token was removed successfully for "${organizationName}".`);
        new HTTPNoContent204("The organization token was removed!").send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default removeOrganizationTokenController;