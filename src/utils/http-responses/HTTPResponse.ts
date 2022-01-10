import { Response } from "express";

interface HTTPResponseContent {
    status: number,
    message: string,
    data: object
}
/** @class HTTPResponse defines shared functionality for all derivations, and it is meant to make response code more
 * readable in express middleware.
 */
export default abstract class HTTPResponse {

    private _statusCode: number;
    private _message: string;
    private _data: object;

    protected constructor(statusCode: number, message: string, data: object) {
        this._statusCode = statusCode;
        this._message = message;
        this._data = data;
    }

    public send(res: Response) : void {
        const content: HTTPResponseContent = {
            status: this._statusCode,
            message: this._message,
            data: this._data
        };
        res.status(this._statusCode).json(content);
    }
}