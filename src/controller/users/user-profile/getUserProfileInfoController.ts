import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import { getUserProfileInfo, User } from "../../../data/schemas/user/User";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

/** Route that retrieves a user's profile information using a user id */
const getUserProfileInfoController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const viewingUser = (req as any).user;
        const { id } = req.params;
        if (!id) throw new Error("The user profile id is required!");
        const profileUser = await User.findById(id);
        if (!profileUser) throw new Error("No such user exists with the id provided.");
        const profileInfo = await getUserProfileInfo(viewingUser, profileUser._id);
        assertError(profileInfo);
        new HTTPOK200("Retrieved the user profile data successfully!", profileInfo).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

/** get user id with username */
const getUseridByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const viewingUser = (req as any).user;
        const { username } = req.params;
        if (!username) throw new Error("The user profile id is required!");
        const profileUser = await User.findOne({username});
        if (!profileUser) throw new Error("No such user exists with the id provided.");
        const profileInfo = await getUserProfileInfo(viewingUser, profileUser._id);
        assertError(profileInfo);
        new HTTPOK200("Retrieved the user profile data successfully!", profileInfo).send(res);
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export { getUserProfileInfoController, getUseridByUsername };