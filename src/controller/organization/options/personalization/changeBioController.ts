import { Request, Response, NextFunction } from "express";
import OrgBio from "../../../../data/schemas/organization/field-managers/OrgBio";
import { getTheHTTPError } from "../../../../errorHandler";
import { HTTPOK200 } from "../../../../utils/http-responses/httpResponses";

/** Allows an admin to change the bio of their organization to their liking */
const changeBioController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = (req as any).user;
        const { bio } = req.body;
        const orgBio = await OrgBio.create(admin.organizationId, bio);
        await orgBio.save();
        new HTTPOK200("The bio was successfully updated!").send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export default changeBioController;