import { Request, Response, NextFunction } from "express";
import assertError from "../../../../assertError";
import deleteOrganizationAccount from "../../../../data/schemas/organization/methods/deleteOrganizationAccount";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { HTTPNoContent204 } from "../../../../utils/http-responses/httpResponses";

const deleteOrganizationAccountController =
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ownerOfOrganization = (req as any).user;
        const { organizationName, ownerUsername, ownerPassword } = req.body;
        const deleteOrganization =
        await deleteOrganizationAccount(
            ownerOfOrganization,
            organizationName,
            ownerUsername,
            ownerPassword 
        );
        assertError(deleteOrganization);
        new HTTPNoContent204(`The organization account for ${organizationName} was deleted successfully.`).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export default deleteOrganizationAccountController;