import { authenticationTokenExpiration, authenticationTokenField } from "../common/fields/authenticationTokenField";
import commonFields from "../common/fields/commonFields";
import mongoose from "mongoose";
import Hasher from "../../security/hashers/Hasher";
import BasicHasher from "../../security/hashers/BasicHasher";
import { AuthTokenGenerator64 } from "../../security/token/authTokenGenerators";
import logger from "../../../logger";
import { getSimpleErrorMsg } from "../../../errorHandler";
import { NextFunction } from "express";
import hashTokenAndUpdateExpiration from "../common/before-save/hashTokenAndUpdateExpiration";

interface IOrganizationToken {
    name: any,
    email: any,
    emailConfirm: any,
    adminAuthToken: any,
    adminAuthTokenExpiration: any
}

// before an admin can create an organization account they must have a user with permission level
// owner create an authentication token for them to use for registration
const schemaObject: IOrganizationToken = {
    name: commonFields.nameWithSpacesField,
    email: commonFields.nonUniqueEmailField,
    emailConfirm: commonFields.emailConfirmField,
    adminAuthToken: authenticationTokenField("admin authentication"),
    adminAuthTokenExpiration: authenticationTokenExpiration("admin authentication")
};

const OrganizationTokenSchema: mongoose.Schema = new mongoose.Schema(schemaObject);

OrganizationTokenSchema.pre(/save/g, async function (this: IOrganizationToken) {
    try {
        // remove the email confirm field
        this.emailConfirm = undefined;
    } catch (err) {
        logger(getSimpleErrorMsg(err));
    }
});

const OrganizationToken: mongoose.Model<unknown> = mongoose.model("OrganizationToken", OrganizationTokenSchema);

/** This method validates that an incoming organization token with its corresponding organization name
 * is valid. When an admin signs up their organization account, they will need to have a valid token to do so
*/
const validateOrganizationToken = async (adminAuthToken: string, organizationName: string, hasher: Hasher = new BasicHasher())
: Promise<void | any> => {
    try {
        const organizationDoc = await OrganizationToken.findOne({ name: organizationName });
        // if no document was found raise an error
        if (!organizationDoc) throw new Error(`${organizationName} does not have an active token. Please contact the site owner to request a new token.`);
        
    } catch (err) {
        return err;
    }
};

/** creates a new organization token for an admin to use to sign up */
/**
 * 
 * @param organizationName the name of the organization
 * @param email the email of the admin of the organization
 * @param confirmEmail the confirmed admin email
 */
const createNewOrganizationToken =
async (organizationName: string, email: string, emailConfirm: string) : Promise<mongoose.Document<any, any, unknown>| any> => {
    try {
        const organizationTokenInputs: IOrganizationToken = {
            name: organizationName,
            email,
            emailConfirm,
            adminAuthToken: new AuthTokenGenerator64().generate(),
            adminAuthTokenExpiration: 0
        };
        const newOrganizationToken = new OrganizationToken(organizationTokenInputs);
        return newOrganizationToken;
    } catch (err) {
        return err;
    }
};

/** updates an existing organization token (i.e., if it expired the token must be regenerated) */
const updateExistingOrganizationToken =
async (organizationName: string, email: string, emailConfirm: string)
: Promise<mongoose.Document<any, any, unknown> | any> => {
    try {
        if (organizationName === undefined) throw new Error("The organization name is required.");
        const adminAuthToken = new AuthTokenGenerator64().generate();
        const adminAuthTokenExpiration = 0
        const organizationToken = await OrganizationToken.findOne({ name: organizationName });
        if (!organizationToken)
            throw new Error(`No organization token for ${organizationName} was found. Please create a new organization token for ${organizationName}`);
        // update the fields and save
        (organizationToken as any).email = email;
        (organizationToken as any).emailConfirm = emailConfirm;
        (organizationToken as any).adminAuthToken = adminAuthToken;
        (organizationToken as any).adminAuthTokenExpiration = adminAuthTokenExpiration;
        return organizationToken;
    } catch (err) {
        return err;
    }
};

export { OrganizationToken, IOrganizationToken, validateOrganizationToken, createNewOrganizationToken, updateExistingOrganizationToken };