import { NextFunction, Request, Response } from "express";
import { OrgEmailList, IEmailList, EmailList } from "../../../../../data/schemas/organization/field-managers/OrgEmailList";
import { OrganizationAccount } from "../../../../../data/schemas/organization/OrganizationAccountSchema";
import { getTheHTTPError } from "../../../../../errorHandler";
import { HTTPInternalServerError500 } from "../../../../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../../../../utils/http-responses/httpResponses";


const getAllEmailListsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const organizationId = (req as any).user.organizationId;
       const organization = await OrganizationAccount.findById(organizationId);
       if (!organization) throw new Error("The organization could not be located.");
       const emailListIds: string[] = Object.keys((organization as any).emailListsMap).slice(1).map(key => (organization as any).emailListsMap[key]);
       const emailListsArr: IEmailList[] = [];
       for (const emailListId of emailListIds) {
           const emailList = await EmailList.findById(emailListId);
           if (!emailList) throw new HTTPInternalServerError500("The email list could not be located.");
           emailListsArr.push({
               emailListName: (emailList as any).emailListName,
               emailList: (emailList as any).emailList
           });
       }
       new HTTPOK200(`Successfully retrieved all email lists for ${(organization as any).name}`, emailListsArr).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
}

export default getAllEmailListsController;