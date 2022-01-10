import { createNewUser } from "../User";
import { permissions } from "../fields/permissionLevelField";
import mongoose from "mongoose";
import assertError from "../../../../assertError";
import OrgToken from "../../organization/field-managers/OrgToken";

const createNewAdmin =
async (organizationToken: string, organizationName: string, firstName?: string, lastName?: string,
    email?: string, username?: string, password?: string, passwordConfirm?: string,
    permissionLevel: number = permissions.ADMIN)
: Promise<mongoose.Document<any, any, unknown> | any> => {
    try {
        if (!organizationToken) throw new Error("The organization token is required.");
        if (!organizationName) throw new Error("The organization name is required.")
        const orgToken = await OrgToken.create(organizationName, (email as string), (email as string));
        await orgToken.validateUnhashedToken(organizationToken);
        const newAdmin = await createNewUser(
            firstName,lastName,organizationName,email,username,password,passwordConfirm,permissionLevel
        );
        return newAdmin;
    } catch (err) {
        return err;
    }
};

export { createNewAdmin };