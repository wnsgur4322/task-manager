import { Request, Response, NextFunction } from "express";
import OrgMemberLimit from "../../../../data/schemas/organization/field-managers/OrgMemberLimit";
import { getTheHTTPError } from "../../../../errorHandler";
import { HTTPOK200 } from "../../../../utils/http-responses/httpResponses";

const changeMemberLimitController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const admin = (req as any).user;
        const { memberLimit } = req.body;
        const orgMemberLimit = await OrgMemberLimit.create(admin.organizationId, memberLimit);
        await orgMemberLimit.save();
        new HTTPOK200("The member limit was successfully updated!").send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
}

export default changeMemberLimitController;