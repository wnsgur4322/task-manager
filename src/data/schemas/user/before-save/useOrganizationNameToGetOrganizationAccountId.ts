import mongoose from "mongoose";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import logger from "../../../../logger";
import { OrganizationAccount } from "../../organization/OrganizationAccountSchema";

interface SchemaWithOrganizationName {
    isModified(field: string): boolean,
    organizationName: string,
    organizationId: string
}

/** This method converts the organizationName field on a User document from the name of the organization to its unique id */
const useOrganizationNameToGetOrganizationAccountId =
async (userSchema: SchemaWithOrganizationName) : Promise<void> => {
    try {
        // upon creation of a user the organization id will be modified
        // so that on the next save it will be updated to the organization id
        if (userSchema.isModified("organizationId")) {
            const organization = await OrganizationAccount.findOne({ name: userSchema.organizationName });
            userSchema.organizationId = organization?._id;
        }
    } catch (err) {
        logger(getSimpleErrorMsg(err));
    }
};

export default useOrganizationNameToGetOrganizationAccountId;