import { OrganizationAccount } from "../OrganizationAccountSchema";
import mongoose from "mongoose";
import BasicHasher from "../../../security/hashers/BasicHasher";
import assertError from "../../../../assertError";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { User } from "../../user/User";
import UserAuthenticator from "../../user/auth/UserAuthenticator";

/** This method completely deletes an entire organization account and all its members recursively.
 * Only the owner of the organization (not to be confused with the permission OWNER) is authorized to delete this account
 * and must submit the full name of the organization, as well as their login credentials to verify that they are in fact
 * the owner.
*/
const deleteOrganizationAccount = async (
    ownerOfOrganization: mongoose.Document<any, any, unknown>,
    organizationName: string | undefined,
    ownerUsername: string | undefined,
    ownerPassword: string | undefined
) => {
    try {
        if (!organizationName)
            throw new Error("The organization name is required.");
        if ((ownerOfOrganization as any).organizationName !== organizationName)
            throw new Error("You did not enter your organization name correctly.");
        const userThatAuthenticated = await UserAuthenticator.login(ownerUsername, ownerPassword);
        await UserAuthenticator.verifyUserWhoIsLoggedInMatchesUserWhoAuthenticated(ownerOfOrganization, userThatAuthenticated);
        const organization = await OrganizationAccount.findById((ownerOfOrganization as any).organizationId);
        if (!organization) throw new Error("Your organization could not be located");
        // ensure this user is the owner
        if ((organization as any).organizationOwnerId !== ownerOfOrganization._id.toString())
            throw new Error("You cannot delete this organization because you are not the owner.");
        const membersList = Object.keys((organization as any).members);
        // remove all members
        for (let i = 0; i < membersList.length; i++) {
            const member = await User.findById((organization as any).members[membersList[i]]);
            if (!member) throw new Error("Could not locate a member.");
            const memberRemove = await member.remove();
            assertError(memberRemove);
        }
        // remove the organization
        const organizationRemove = await organization.remove();
        assertError(organizationRemove);
    } catch (err) {
        return new Error(getSimpleErrorMsg(err));
    }
};

export default deleteOrganizationAccount;