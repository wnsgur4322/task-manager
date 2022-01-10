import { NextFunction, Request, Response } from "express";
import { OrgEmailList } from "../../../../../data/schemas/organization/field-managers/OrgEmailList";
import { getTheHTTPError } from "../../../../../errorHandler";
import { HTTPCreated201 } from "../../../../../utils/http-responses/httpResponses";


const createNewEmailListController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = (req as any).user.organizationId;
        const { emailListName, emailList } = req.body;
        const orgEmailList = await OrgEmailList.create(emailListName, emailList, organizationId);
        await orgEmailList.save();
        const data = await orgEmailList.getEmailListData();
        new HTTPCreated201(`The email list "${emailListName}" was created successfully!`, data).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
}

export default createNewEmailListController;