import { Request, Response, NextFunction } from "express";
import assertError from "../../../../assertError";
import OrgRole from "../../../../data/schemas/organization/field-managers/OrgRole";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { HTTPCreated201, HTTPNoContent204 } from "../../../../utils/http-responses/httpResponses";

/** Controller that manages the creation of a new role for the organization of the admin */
const deleteCustomRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const { roleName } = req.body;
        const newRole = await OrgRole.create(roleName, user.organizationId);
        assertError(newRole);
        const newRoleRemove = await (newRole as OrgRole).remove();
        assertError(newRoleRemove);
        new HTTPNoContent204(`The role "${roleName}" was removed sucessfully!`).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { deleteCustomRoleController };