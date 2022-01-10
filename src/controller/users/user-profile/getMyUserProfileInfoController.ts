import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import { getUserProfileInfo, User } from "../../../data/schemas/user/User";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

/** Route that retrieves a user's profile information using a user id */
const getMyUserProfileInfoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const profileInfo = await getUserProfileInfo(user, user._id);
        assertError(profileInfo);
        new HTTPOK200("Retrieved the user profile data successfully!", profileInfo).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export default getMyUserProfileInfoController;