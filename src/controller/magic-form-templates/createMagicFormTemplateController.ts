import { Request, Response, NextFunction } from "express";
import OrgMagicFormTemplateEntry from "../../data/schemas/organization/field-managers/OrgMagicFormTemplateEntry";
import { getTheHTTPError } from "../../errorHandler";
import { HTTPCreated201 } from "../../utils/http-responses/httpResponses";

const createMagicFormTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const magicFormTemplateObject = req.body;
        const organizationId = (req as any).user.organizationId;
        const magicFormTemplateEntry = await OrgMagicFormTemplateEntry.create(magicFormTemplateObject, organizationId);
        await magicFormTemplateEntry.save();
        new HTTPCreated201(`The magic form titled "${magicFormTemplateObject.magicFormName}" was created successfully!`).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default createMagicFormTemplateController;