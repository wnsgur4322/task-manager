import { Request, Response, NextFunction } from "express";
import assertError from "../../../assertError";
import OrgMember from "../../../data/schemas/organization/field-managers/OrgMember";
import { OrganizationAccount } from "../../../data/schemas/organization/OrganizationAccountSchema";
import { User } from "../../../data/schemas/user/User";
import { getSimpleErrorMsg, getTheHTTPError } from "../../../errorHandler";
import logger from "../../../logger";
import { HTTPBadRequest400 } from "../../../utils/errors/http/httpErrors";
import { HTTPNoContent204 } from "../../../utils/http-responses/httpResponses";

/** This controller allows an admin to delete a user from their organization */
const deleteUserAccountController = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const admin = (req as any).user;
        const adminOrganization = await OrganizationAccount.findById(admin.organizationId);
        if (!adminOrganization) throw new HTTPBadRequest400("The organization with the id specified does not exist.");
        // retrieve the username of the user to delete
        const { username } = req.body;
        if (!username) throw new HTTPBadRequest400("The username is required to confirm the deletion of the user.");
        const user = await User.findOne({ username });
        if (!user || !(username in (adminOrganization as any).members))
            throw new HTTPBadRequest400(`No such user with the username "${username}" exists in the ${admin.organizationName} organization account.`);
        // an admin cannot delete them self
        if (user._id.toString() === admin._id.toString())
            throw new HTTPBadRequest400("You cannot delete yourself.");
        // an admin cannot delete another admin or higher unless that admin is the organization owner
        if ((user as any).permissionLevel >= admin.permissionLevel && admin._id.toString() !== (adminOrganization as any).organizationOwnerId)
            throw new HTTPBadRequest400("You can only delete users with a lower permission than you.");
        // now we delete the member from the organization and then delete the user itself
        const orgMember = await OrgMember.create(user._id, adminOrganization._id);
        await orgMember.remove();
        const removeUser = await user.remove();
        assertError(removeUser);
        logger(`The user ${username} has been deleted.`);
        new HTTPNoContent204(`The user with username ${username} has successfully been deleted`).send(res);
    } catch (err) {
        return next(getTheHTTPError(err));
    }
}

export { deleteUserAccountController };