import { Request, Response, NextFunction } from "express";
import OrgMagicFormTemplateEntry from "../../data/schemas/organization/field-managers/OrgMagicFormTemplateEntry";
import { getTheHTTPError } from "../../errorHandler";
import { HTTPNoContent204 } from "../../utils/http-responses/httpResponses";

const deleteMagicFormTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = (req as any).user.organizationId;
        const { magicFormName, magicFormNameConfirm } = req.body;
        if (!magicFormName || !magicFormNameConfirm)
            throw new Error("The magic form template name and the confirmed name are required fields.");
        if (magicFormName !== magicFormNameConfirm)
            throw new Error("The magic form name must matched the confirmed name.");
        const magicFormTemplateEntry = await OrgMagicFormTemplateEntry.load(magicFormName, organizationId);
        await magicFormTemplateEntry.remove();
        new HTTPNoContent204("The magic form template was successfully deleted.").send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default deleteMagicFormTemplateController;