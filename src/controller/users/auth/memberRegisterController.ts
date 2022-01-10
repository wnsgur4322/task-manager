import { Request, Response, NextFunction } from "express";
import { HTTPCreated201 } from "../../../utils/http-responses/httpResponses";
import { getTheHTTPError } from "../../../errorHandler";
import logger from "../../../logger";
import { createJWTTokenCookie } from "../../../data/security/token/jwt-token-methods";
import { getNewMemberAndOrganizationAccount } from "../../../data/schemas/user/Member";
import OrgMember from "../../../data/schemas/organization/field-managers/OrgMember";
import OrgMemberInviteToken from "../../../data/schemas/organization/field-managers/OrgMemberInviteToken";

/** This function handles the register route for a new member invited by the admin */
const memberRegisterController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // retrieve all fields from the body of the request
        const { firstName, lastName, email, organizationName, organizationToken, username, password, passwordConfirm } = req.body;
        // attempt to create the admin user document
        const memberAndOrg = await getNewMemberAndOrganizationAccount(
            organizationToken, organizationName, firstName, lastName, email, username, password, passwordConfirm
        );
        const { newMember, organizationAccount } = memberAndOrg;
        newMember.organizationId = organizationAccount.name;
        // attempt to save the member
        await newMember.save();
        // remove the member invite token since they have been authenticated
        const memberInviteToken = await OrgMemberInviteToken.create(email, email, newMember.organizationId);
        await memberInviteToken.remove();
        // add the member to the organization account
        const orgMember = await OrgMember.create(newMember._id, (newMember as any).organizationId);
        await orgMember.save();
        logger(`User with username "${username}" signed up.`);
        // return the jwt to the admin
        await createJWTTokenCookie(res, newMember._id);
        new HTTPCreated201("You account was created successfully!", { id: newMember._id }).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};

export { memberRegisterController };