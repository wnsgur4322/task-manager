import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import OrgMemberInviteToken from "../../../data/schemas/organization/field-managers/OrgMemberInviteToken";
import getUpdatedAccountCreationToken from "../../../data/schemas/organization/methods/getUpdatedAccountCreationToken";
import sendMemberInvite from "../../../data/schemas/user/admin/sendMemberInvite";
import { getSimpleErrorMsg, getTheHTTPError, isError } from "../../../errorHandler";
import { HTTPBadRequest400, HTTPInternalServerError500 } from "../../../utils/errors/http/httpErrors";
import { HTTPCreated201 } from "../../../utils/http-responses/httpResponses";

/** Allows an admin to send an member email invite to someone in their organization */
const adminSendMemberInviteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inviteEmail, inviteEmailConfirm } = req.body;
        const user = (req as any).user;
        const memberInviteToken = await OrgMemberInviteToken.create(inviteEmail, inviteEmailConfirm, user.organizationId);
        await memberInviteToken.generateToken();
        const unhashedToken = memberInviteToken.unhashedToken;
        await memberInviteToken.save();
        const sendEmailMessage = await sendMemberInvite(user, inviteEmail, (unhashedToken as string));
        new HTTPCreated201(sendEmailMessage).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
};
export default adminSendMemberInviteController;