import { Request, Response, NextFunction } from "express";
import OrgToken from "../../../data/schemas/organization/field-managers/OrgToken";
import { getTheHTTPError } from "../../../errorHandler";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

const getCurrentOrganizationTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationTokens = await OrgToken.getAllTokens();
        new HTTPOK200("All organization tokens were successfully retrieved.", organizationTokens).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default getCurrentOrganizationTokens;