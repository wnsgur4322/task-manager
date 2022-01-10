import assertError from "../../../../assertError";
import { OrganizationToken } from "../OrganizationTokenSchema";

interface OrganizationAccountWithName {
    name: string;
    isModified(fieldName: string): boolean;
}

/** Before we save the organization account we must delete the organization token the admin used
 * since it is no longer necessary. */
const deleteOrganizationToken =
async (organizationAccount: OrganizationAccountWithName) => {
    try {
        if (organizationAccount.isModified("name")) {
            const organizationTokenDocument = await OrganizationToken.deleteOne({ name: organizationAccount.name });
            assertError(organizationTokenDocument);
        }
    } catch (err) {
        return err;
    }
};

export { deleteOrganizationToken };