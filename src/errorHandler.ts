import HTTPError from "./utils/errors/http/HTTPError";
import { HTTPBadRequest400 } from "./utils/errors/http/httpErrors";

function isError(err: any) {
    if (err instanceof Error) return true;
    return false;
}

function getSimpleErrorMsg(err: any) : string {
    if (isError(err)) return err.message;
    return `${err}`;
}

function getTheHTTPError(err: any) : HTTPError {
    // if it's an HTTPError return it otherwise convert it to one
    if (err.constructor === HTTPError) {
        return err;
    } else {
        return new HTTPBadRequest400(getSimpleErrorMsg(err));
    }
}


export { getSimpleErrorMsg, isError, getTheHTTPError };