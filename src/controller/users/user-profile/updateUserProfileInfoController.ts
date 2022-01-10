import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import { getUserProfileInfo } from "../../../data/schemas/user/User";
import { updateUsersPersonalProfileInfo } from "../../../data/schemas/user/field-update-validation-handlers/usernameUpdateValidator";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

/** Allows a user to update some of their profile information */
const updateUserProfileInfoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const updateUser = await updateUsersPersonalProfileInfo(user, req.body);
        assertError(updateUser);
        // retrieve the user's updated information
        const updatedInfo = await getUserProfileInfo(user, user._id);
        assertError(updatedInfo);
        new HTTPOK200("Your user profile info was successfully updated!", updatedInfo).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { updateUserProfileInfoController };