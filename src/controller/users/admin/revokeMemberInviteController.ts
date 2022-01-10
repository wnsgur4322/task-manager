import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import OrgMemberInviteToken from "../../../data/schemas/organization/field-managers/OrgMemberInviteToken";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPNoContent204 } from "../../../utils/http-responses/httpResponses";

/** This route is used by moderators and admins in the case that a member invite was accidentally sent to the wrong email address */
const revokeMemberInviteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { inviteEmail, inviteEmailConfirm } = req.body;
        const admin = (req as any).user;
        const memberInviteToken = await OrgMemberInviteToken.create(inviteEmail, inviteEmailConfirm, admin.organizationId);
        assertError(memberInviteToken);
        const removeMemberInviteToken = await (memberInviteToken as OrgMemberInviteToken).remove();
        assertError(removeMemberInviteToken);
        new HTTPNoContent204("The member invite token was successfully removed.").send(res);    
    } catch (err) {
        return next(new HTTPBadRequest400(getSimpleErrorMsg(err)));
    }
};

export default revokeMemberInviteController;