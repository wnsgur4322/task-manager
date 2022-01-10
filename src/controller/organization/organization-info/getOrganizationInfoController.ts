import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import { OrganizationAccount, retrieveOrganizationAccountInfo } from "../../../data/schemas/organization/OrganizationAccountSchema";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

const isOrganizationId = (organizationNameOrId: string) => {
    return organizationNameOrId.search(/([0-9]|[a-f]){24}/g) !== -1;
}

const getOrganizationInfoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const { organizationNameOrId } = req.params;
        let organizationId: string;
        if (isOrganizationId(organizationNameOrId)) {
            organizationId = organizationNameOrId;
        } else {
            const organizationAccount = await OrganizationAccount.findOne({ name: organizationNameOrId });
            if (!organizationAccount) throw new Error("The organization name provided does not exist.");
            organizationId = organizationAccount._id;
        }
        const organizationInfo = await retrieveOrganizationAccountInfo(organizationId, user);
        assertError(organizationInfo);
        new HTTPOK200("Successfully retrieved the organization account data!", organizationInfo).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { getOrganizationInfoController };