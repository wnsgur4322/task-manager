import { NextFunction, Request, Response } from "express";
import UserAuthenticator from "../../../data/schemas/user/auth/UserAuthenticator";
import { User } from "../../../data/schemas/user/User";
import BasicHasher from "../../../data/security/hashers/BasicHasher";
import { createJWTTokenCookie } from "../../../data/security/token/jwt-token-methods";
import { getTheHTTPError } from "../../../errorHandler";
import { HTTPOK200 } from "../../../utils/http-responses/httpResponses";

/** universal controller for the login of all users */
const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const user = await UserAuthenticator.login(username, password);
        // once we know the credentials are correct create the jwt
        await createJWTTokenCookie(res, user._id);
        new HTTPOK200("Logged in successfully!", user._id).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default loginController;