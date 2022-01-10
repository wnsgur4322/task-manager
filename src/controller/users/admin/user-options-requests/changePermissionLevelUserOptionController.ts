import { Request, Response, NextFunction } from "express";
import assertError from "../../../../assertError";
import PermissionLevelUserOption from "../../../../data/schemas/user/admin/user-options/PermissionLevelUserOption";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../../utils/http-responses/httpResponses";

/** Route that allows an admin to change a user's permission level */
const changePermissionLevelUserOptionController =
async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const admin = (req as any).user;
        const permissionLevelOption = await PermissionLevelUserOption.create(userId, admin, req.body);
        assertError(permissionLevelOption);
        const savePermissionLevel = await (permissionLevelOption as PermissionLevelUserOption).save();
        assertError(savePermissionLevel);
        new HTTPOK200("The permission level was successfully updated!", { permissionLevel: req.body["permissionLevel"]}).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export default changePermissionLevelUserOptionController;