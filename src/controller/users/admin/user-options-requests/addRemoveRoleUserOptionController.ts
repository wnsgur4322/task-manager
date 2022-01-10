import { Request, Response, NextFunction } from "express";
import assertError from "../../../../assertError";
import RoleUserOption from "../../../../data/schemas/user/admin/user-options/RoleUserOption";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { HTTPCreated201, HTTPOK200 } from "../../../../utils/http-responses/httpResponses";

/** Creates and returns the RoleUserOption instance */
const createRole = async (req: Request) => {
    try {
        const { userId } = req.params;
        const admin = (req as any).user;
        const userRole = await RoleUserOption.create(userId, admin, req.body);
        assertError(userRole);
        return (userRole as RoleUserOption);
    } catch (err) {
        return new Error(getSimpleErrorMsg(err));
    }
};


const addNewUserRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = await createRole(req);
        assertError(userRole);
        const userRoleSave = await (userRole as RoleUserOption).save();
        assertError(userRoleSave);
        new HTTPCreated201("The role was successfully added!").send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

const removeExistingUserRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRole = await createRole(req);
        assertError(userRole);
        const userRoleRemove = await (userRole as RoleUserOption).remove();
        assertError(userRoleRemove);
        new HTTPOK200("The role was successfully removed!").send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { addNewUserRoleController, removeExistingUserRoleController };