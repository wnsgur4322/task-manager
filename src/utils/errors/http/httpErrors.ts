import HTTPError from "./HTTPError";

class HTTPBadRequest400 extends HTTPError {

    public constructor(message: string) { super(400, message); }
}

class HTTPForbidden403 extends HTTPError {
    public constructor(message: string) { super(403, message); }
}

class HTTPInternalServerError500 extends HTTPError {
    public constructor(message: string) { super(500, message); }
}

export {
    HTTPBadRequest400,
    HTTPForbidden403,
    HTTPInternalServerError500
};