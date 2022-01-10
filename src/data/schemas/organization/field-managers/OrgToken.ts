import mongoose from "mongoose";
import assertError from "../../../../assertError";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";
import { sendEmailWithOrganizationTokenToAdmin } from "../../../mail/organization/organizationTokenSender";
import BasicHasher from "../../../security/hashers/BasicHasher";
import { AuthTokenGenerator64 } from "../../../security/token/authTokenGenerators";
import { OrganizationAccount } from "../OrganizationAccountSchema";
import { IOrganizationToken, OrganizationToken } from "../OrganizationTokenSchema";

const { TOKEN_EXPIRATION_TIME } = process.env;

/** OrgToken manages the creating, updating, and deleting of organization tokens */
export default class OrgToken {

    private _orgTokenDoc: mongoose.Document<any, any, unknown>;
    private _doesNotExistOnTheDatabase: boolean;

    public static async create(organizationName: string | undefined, adminEmail: string, adminEmailConfirm: string) {
        try {
            if (!organizationName) throw new Error("The organization name is required.");
            const organizationAccount = await OrganizationAccount.findOne({ name: organizationName });
            if (organizationAccount) throw new Error(`You cannot modify this organization token because the organization account for ${organizationName} already exists.`);
            if (adminEmail !== adminEmailConfirm) throw new Error("The email should match the confirmed email.");
            // if the organization token doc already exists then create an OrgToken using it
            let orgTokenDoc = await OrganizationToken.findOne({ name: organizationName });
            if (orgTokenDoc) {
                (orgTokenDoc as any).email = adminEmail;
                return new OrgToken(orgTokenDoc, false);
            }
            const orgTokenDocInputs: IOrganizationToken = {
                name: organizationName,
                email: adminEmail,
                emailConfirm: adminEmailConfirm,
                adminAuthToken: "",
                adminAuthTokenExpiration: 0
            };
            orgTokenDoc = new OrganizationToken(orgTokenDocInputs);
            return new OrgToken(orgTokenDoc, true);
        } catch (err) {
            throw err;
        }
    }

    public constructor(orgTokenDoc: mongoose.Document<any, any, unknown>, doesNotExistOnTheDatabase: boolean) {
        this._orgTokenDoc = orgTokenDoc;
        this._doesNotExistOnTheDatabase = doesNotExistOnTheDatabase;
    }

    /** Creates the organization token or updates it if it already exists. In addition, the email with the token
     * is sent to the admin of the organization.
     */
    public async save() {
        try {
            const unhashedToken: string = new AuthTokenGenerator64().generate();
            (this._orgTokenDoc as any).adminAuthToken = await new BasicHasher().hash(unhashedToken);
            (this._orgTokenDoc as any).adminAuthTokenExpiration = Date.now() + parseInt(`${TOKEN_EXPIRATION_TIME}`);
            (this._orgTokenDoc as any).emailConfirm = (this._orgTokenDoc as any).email;
            await this._orgTokenDoc.save();
            const { name, email } = (this._orgTokenDoc as any);
            const sentEmail = await sendEmailWithOrganizationTokenToAdmin(name, unhashedToken, email);
            assertError(sentEmail);
            return unhashedToken;
        } catch (err) {
            throw err;
        }
    }

    /** Removes the organization token if it exists or throws an exception if it does not */
    public async remove() {
        try {
            const { name } = (this._orgTokenDoc as any);
            if (this._doesNotExistOnTheDatabase)
                throw new Error(`You cannot remove the organization token for ${name} because it does not exist.`);
            await this._orgTokenDoc.remove();
        } catch (err) {
            throw err;
        }
    }
    /** Verifies an incoming unhashed admin token to ensure it matches the token for their organization in the database. */
    public async validateUnhashedToken(unhashedToken: string) {
        try {
            const { name, adminAuthToken, adminAuthTokenExpiration } = (this._orgTokenDoc as any);
            if (this._doesNotExistOnTheDatabase)
                throw new Error(`The organization token for ${name} is invalid or does not exist.`);
            // compare the unhashed token with the hashed token
            const match = await new BasicHasher().compare(unhashedToken, adminAuthToken);
            if (!match) throw new Error(`The organization token for ${name} is invalid or does not exist.`);
            // check if the token has expired
            if (adminAuthTokenExpiration < Date.now())
                throw new Error(`The organization token for ${name} has expired. Please contact a site owner to request a new token.`);
        } catch (err) {
            throw err;
        }
    }

    public static async getAllTokens() {
        try {
            const organizationTokens = await OrganizationToken.find();
            return organizationTokens.map(organizationToken => {
                return {
                    organizationName: (organizationToken as any).name,
                    isExpired: (organizationToken as any).adminAuthTokenExpiration < Date.now() ?
                    true : false
                };
            });
        } catch (err) {
            throw new HTTPInternalServerError500(getSimpleErrorMsg(err));
        }
    }
}