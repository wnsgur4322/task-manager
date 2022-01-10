import { Response } from "express";
import HTTPResponse from "./HTTPResponse";

class HTTPOK200 extends HTTPResponse {

    public constructor(message: string, data: object = {}) { super(200, message, data); }
}

class HTTPCreated201 extends HTTPResponse {

    public constructor(message: string, data: object = {}) { super(201, message, data); }
}

class HTTPNoContent204 extends HTTPResponse {

    public constructor(message: string, data: object = {}) { super(204, message, data); }
}

class HTTPRedirect302 extends HTTPResponse {

    private _redirectURL: string;

    public constructor(redirectURL: string) {
        super(302, "", {});
        this._redirectURL = redirectURL;
    }

    public send(res: Response) : void {
        res.redirect(this._redirectURL);
    } 
}

export {
    HTTPOK200,
    HTTPCreated201,
    HTTPRedirect302,
    HTTPNoContent204
};