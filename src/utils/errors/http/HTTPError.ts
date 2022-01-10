interface HTTPErrorContent {
    status: number,
    message: string
}

/** @class HTTPError defines the shared functionality of all HTTPError derivations.
 * Its purpose is to encapsulate the error info of an HTTP error to be returned to the client.
*/
export default abstract class HTTPError extends Error {

    private _statusCode: number;

    protected constructor(statusCode: number, message: string) {
        super(message);
        this._statusCode = statusCode;
    }

    public getContent() : HTTPErrorContent {
        return {
            status: this._statusCode,
            message: this.message
        };
    }
}