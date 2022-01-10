import { createNewUser } from "./User";
import { permissions } from "./fields/permissionLevelField";
import mongoose from "mongoose";
import assertError from "../../../assertError";
import { getOrganizationAccountIfExists, OrganizationAccount } from "../organization/OrganizationAccountSchema";
import OrgMemberInviteToken from "../organization/field-managers/OrgMemberInviteToken";

/** Creates a new member with member level permission provided that they have a valid account creation token */
const getNewMemberAndOrganizationAccount =
async (unhashedMemberInviteToken: string, organizationName: string, firstName?: string, lastName?: string, email?: string,
    username?: string, password?: string, passwordConfirm?: string, permissionLevel: number = permissions.MEMBER)
: Promise<mongoose.Document<any, any, unknown>[] | any> => {
    try {
        const organizationAccount = await getOrganizationAccountIfExists(organizationName);
        const memberInviteToken = await OrgMemberInviteToken.create(email, email, organizationAccount._id);
        await memberInviteToken.validateUnhashedToken(unhashedMemberInviteToken);
        const newMember = await createNewUser(
            firstName,lastName,organizationName,email,username,password,passwordConfirm,permissionLevel
        );
        return {newMember, organizationAccount};
    } catch (err) {
        throw err;
    }
};

export { getNewMemberAndOrganizationAccount };