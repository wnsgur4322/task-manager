import { Request, Response, NextFunction } from "express";
import { MagicFormTemplateManager } from "../../data/schemas/magic-forms/magic-form-templates/magic-form-template-management/MagicFormTemplateManager";
import { MagicFormTemplateObject } from "../../data/schemas/magic-forms/magic-form-templates/MagicFormTemplateObject";
import { MagicFormTemplate } from "../../data/schemas/magic-forms/magic-form-templates/MagicFormTemplateSchema";
import { OrganizationAccount } from "../../data/schemas/organization/OrganizationAccountSchema";
import { getTheHTTPError } from "../../errorHandler";
import { HTTPInternalServerError500 } from "../../utils/errors/http/httpErrors";
import { HTTPOK200 } from "../../utils/http-responses/httpResponses";

const getAllMagicFormTemplatesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationName = (req as any).user.organizationName;
        const organization = await OrganizationAccount.findById((req as any).user.organizationId);
        if (!organization) throw new Error(`The organization account for "${organizationName}" could not be located.`);
        const magicFormTemplates: MagicFormTemplateObject[] = [];
        for (const name in (organization as any).magicFormTemplateMap) {
            if (name === "initialized") continue;
            const magicFormId = (organization as any).magicFormTemplateMap[name];
            const magicFormTemplateManager = await MagicFormTemplateManager.load(magicFormId);
            const magicFormTemplateObject = magicFormTemplateManager.getMagicFormTemplateObject();
            magicFormTemplates.push(magicFormTemplateObject);
        }
        new HTTPOK200(`The magic form templates were retrieved successfully for "${organizationName}".`, magicFormTemplates).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default getAllMagicFormTemplatesController;