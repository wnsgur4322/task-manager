import { Request, Response, NextFunction } from "express";
import assertError from "../../../../assertError";
import OrgRole from "../../../../data/schemas/organization/field-managers/OrgRole";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { HTTPCreated201 } from "../../../../utils/http-responses/httpResponses";

/** Controller that manages the creation of a new role for the organization of the admin */
const createCustomRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const { roleName } = req.body;
        const newRole = await OrgRole.create(roleName, user.organizationId);
        assertError(newRole);
        const newRoleSave = await (newRole as OrgRole).save();
        assertError(newRoleSave);
        new HTTPCreated201(`The role "${roleName}" was created sucessfully!`, { roleName }).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { createCustomRoleController };