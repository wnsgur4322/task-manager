import { Request, Response, NextFunction } from "express";
import HTTPError from "../../utils/errors/http/HTTPError";

/** All errors are propogated to this middleware and returned to the client */
const errorRouter = (err: HTTPError, req: Request, res: Response, next: NextFunction) => {
    const content = err.getContent();
    res.status(content.status).json(content);
}

export default errorRouter;