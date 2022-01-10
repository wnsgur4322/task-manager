import { Request, Response, NextFunction } from "express";
import { removeJWTTokenFromCookies } from "../../../data/security/token/jwt-token-methods";
import { HTTPInternalServerError500 } from "../../../utils/errors/http/httpErrors";
import { HTTPOK200, HTTPRedirect302 } from "../../../utils/http-responses/httpResponses";

const { APP_DOMAIN, HOME_PAGE_URL } = process.env;

/** logs a user out of their account and redirects them to the home page */
const logoutController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await removeJWTTokenFromCookies(res);
        new HTTPOK200("You have successfully logged out!").send(res);
    } catch (err) {
        return next(new HTTPInternalServerError500("An unexpected error occurred while the server attempted to log you out."));
    }
};

export default logoutController;