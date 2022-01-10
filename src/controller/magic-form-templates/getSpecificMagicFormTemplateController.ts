import { Request, Response, NextFunction } from "express";
import { MagicFormTemplate } from "../../data/schemas/magic-forms/magic-form-templates/MagicFormTemplateSchema";
import { getTheHTTPError } from "../../errorHandler";
import { HTTPOK200 } from "../../utils/http-responses/httpResponses";

const getSpecificMagicFormTemplateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { formId } = req.params;
        if (!formId) throw new Error("The form template id is required.");
        const magicFormTemplate = await MagicFormTemplate.findById(formId);
        if (!magicFormTemplate) throw new Error("The form template id is invalid.");
        new HTTPOK200(`The magic form template was retrieved successfully.`, (magicFormTemplate as any)._doc).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default getSpecificMagicFormTemplateController;