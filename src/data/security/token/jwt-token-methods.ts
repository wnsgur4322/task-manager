import jwt from "jsonwebtoken";
import { Response } from "express";

// secret key in .env file and expiration time
let { JWT_SECRET_KEY, JWT_EXPIRATION } = process.env;
// convert the expiration time in ms from a string to a number
const EXPIRATION = parseInt(JWT_EXPIRATION ? JWT_EXPIRATION : "3600000");

const tokenName = "client-token";

const defaultCookieOptions: object = {
    expires: new Date(Date.now() + EXPIRATION)
};


/** generates the json web token provided the unique id of the mongodb document */
const generateJWTToken = async (id: string) : Promise<string | any> => {
    try {
        const token = await jwt.sign({ id }, (JWT_SECRET_KEY as jwt.Secret), { expiresIn: EXPIRATION });
        return token;
    } catch (err) {
        return err;
    }
};

/** Given the id of the mongodb document, this method sets the cookie on the header sent to the client */
const createJWTTokenCookie =
async (res: Response, id: string, cookieOptions: object = defaultCookieOptions) : Promise<string | any> => {
    try {
        const token: string = await generateJWTToken(id);
        res.cookie(tokenName, token, cookieOptions);
        return token;
    } catch (err) {
        return err;
    }
};

/** verifies that when the jwt is decoded it matches the id of the document */
const retrieveDataFromJWTToken =
async (token: string) : Promise<jwt.JwtPayload | any> => {
    try {
        const decodedData = jwt.verify(token, (JWT_SECRET_KEY as jwt.Secret));
        return decodedData;
    } catch (err) {
        return err;
    }
};
/** removes the jwt from the client's browser cookies. One application of this function is for logging out */
const removeJWTTokenFromCookies =
async (res: Response) : Promise<void | any> => {
    try {
        res.clearCookie(tokenName);
    } catch (err) {
        return err;
    }
};

export { createJWTTokenCookie, retrieveDataFromJWTToken, removeJWTTokenFromCookies };