import { NextFunction, Request, Response } from "express";
import { HTTPRedirect302 } from "../../../utils/http-responses/httpResponses";
import mongoose from "mongoose";
import { removeJWTTokenFromCookies, retrieveDataFromJWTToken } from "../token/jwt-token-methods";
import { User } from "../../schemas/user/User";
import { JwtPayload } from "jsonwebtoken";
import { permissions } from "../../schemas/user/fields/permissionLevelField";
import assertError from "../../../assertError";
import { HTTPForbidden403, HTTPInternalServerError500 } from "../../../utils/errors/http/httpErrors";

const { LOGIN_PAGE_URL, FORBIDDEN_403_PAGE_URL, EMAIL_VERIFICATION_PAGE_URL } = process.env;

interface OptionalProtectorMethods {
    enforcePermissionLevel: boolean,
    validateEmailIsVerified: boolean
}

/** A custom builder class that allows for many different route protection configurations.
 * The getMiddleware method should be called once all protection settings are in place. In essence,
 * this class is used to block a user from accessing routes when they are either not authenticated or they 
 * don't have access rights. If any of the protection methods fail, they are redirected to the login page.
 */
class RouteProtector {

    private _optionalMethods: OptionalProtectorMethods = { enforcePermissionLevel: false, validateEmailIsVerified: false };
    private _minPermissionLevel: number = permissions.MEMBER;

    public constructor() {}

    private redirectTo403ForbiddenPage(res: Response) {
        new HTTPRedirect302(FORBIDDEN_403_PAGE_URL || "/").send(res);
    }

    private async clearTokenAndRedirectToLoginPage(res: Response) {
        await removeJWTTokenFromCookies(res);
        new HTTPRedirect302(LOGIN_PAGE_URL || "/").send(res);
    }

    private redirectToEmailVerificationPage(res: Response) {
        new HTTPRedirect302(EMAIL_VERIFICATION_PAGE_URL || "/").send(res);
    }

    private raise403Error(next: NextFunction) {
        return next(new HTTPForbidden403("You do not have permission to access this route!"));
    }

    private async getJWT(req: Request, res: Response) : Promise<string | any> {
        try {
            const { authorization } = req.headers;
            let token: string | undefined;
            if (authorization && authorization.startsWith("Bearer ")) token = authorization.split(" ")[1];
            if (token === undefined) {
                return ""; // await this.clearTokenAndRedirectToLoginPage(res);
            }
            return token;
        } catch (err) {
            return err;
        }
    }

    private async getUserAndDecodedJWT(token: string, res: Response) : Promise<object | any> {
        try {
            const decodedData: JwtPayload = await retrieveDataFromJWTToken(token);
            // ensure the token has not expired
            if (Date.now() > ((decodedData as any).exp * 1000)) {
                return null; // await this.clearTokenAndRedirectToLoginPage(res);
            }
            const user = await User.findById(decodedData.id);
            if (!user) {
                return null; // await this.clearTokenAndRedirectToLoginPage(res);
            }
            return { user, decodedData };
        } catch (err) {
            return err;
        }
    }

    private async enforcePermissionLevel(
        actualPermissionLevel: number,
        res: Response    
    ) {
        try {
            if (actualPermissionLevel < this._minPermissionLevel) return null; // this.redirectTo403ForbiddenPage(res);
            return true;
        } catch (err) {
            return err;
        }
    }

    private async validateEmailIsVerified(emailVerified: boolean, res: Response) : Promise<boolean | any> {
        try {
            if (!emailVerified) return null; // this.redirectToEmailVerificationPage(res);
            return true;
        } catch (err) {
            return err;
        }
    }

    private async ensurePasswordHasNotBeenChanged(passwordChangedAt: number, decodedData: JwtPayload, res: Response) {
        try {
            if (passwordChangedAt > ((decodedData.iat as number) * 1000)) return null; // await this.clearTokenAndRedirectToLoginPage(res);
            return true;
        } catch (err) {
            return err;
        }
    }


    // public methods for customization
    public emailVerified() : RouteProtector {
        this._optionalMethods.validateEmailIsVerified = true;
        return this;
    }

    public permissionLevel(minPermissionLevel: number = permissions.MEMBER) : RouteProtector {
        this._optionalMethods.enforcePermissionLevel = true;
        this._minPermissionLevel = minPermissionLevel;
        return this;
    }

    public getMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                // attempt to grab the token from the authorization header
                const token = await this.getJWT(req, res);
                // validation for token
                if (!token) return this.raise403Error(next);
                assertError(token);
                // get the user and the decoded data
                const userAndDecodedData = await this.getUserAndDecodedJWT(token, res);
                // ensure we got the user and decoded data ok
                if (!userAndDecodedData) return this.raise403Error(next);
                assertError(userAndDecodedData);
                // once we know we have both we can destructure them
                const {user, decodedData} = userAndDecodedData;
                // ensure the password has not been changed since the token was issued
                const passwordHasNotBeenChanged = await this.ensurePasswordHasNotBeenChanged(user.passwordChangedAt, decodedData, res);
                if (!passwordHasNotBeenChanged) return this.raise403Error(next);
                assertError(passwordHasNotBeenChanged);
                // only run this if we want to ensure they have verified their email
                if (this._optionalMethods.validateEmailIsVerified) {
                    const emailIsVerified = await this.validateEmailIsVerified(user.emailVerified, res);
                    if (!emailIsVerified) return this.raise403Error(next);
                    assertError(emailIsVerified);
                }
                // only run this if we want to enforce a specific threshold for permission level
                if (this._optionalMethods.enforcePermissionLevel) {
                    const permissionLevelIsSufficient = await this.enforcePermissionLevel(user.permissionLevel, res);
                    if (!permissionLevelIsSufficient) return this.raise403Error(next);
                    assertError(permissionLevelIsSufficient);
                }
                // once we have fully authenticated the user, set the user property of req for future middleware
                (req as any).user = user;
                return next();
            } catch (err) {
                // if any error occurs it is an internal server error
                return next(new HTTPInternalServerError500(`The server encountered an unexpected error ${err}`));
            }
        };
    }
}

export default RouteProtector;