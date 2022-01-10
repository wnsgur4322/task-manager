import { OrganizationAccount } from "../OrganizationAccountSchema"
import mongoose from "mongoose";
import { AuthTokenGenerator64 } from "../../../security/token/authTokenGenerators";

const { TOKEN_EXPIRATION_TIME } = process.env;

/** If the account creation token of the organization has expired then we must update it */
const refreshAccountCreationToken = async (organizationDoc: mongoose.Document<any, any, unknown>) => {
    try {
        if ((organizationDoc as any).accountCreationTokenExpiration < Date.now()) {
            (organizationDoc as any).accountCreationToken = new AuthTokenGenerator64().generate();
            (organizationDoc as any).accountCreationTokenExpiration = Date.now() + parseInt(`${TOKEN_EXPIRATION_TIME}`);
            await organizationDoc.save();
        }
    } catch (err) {
        return err;
    }
};

const getUpdatedAccountCreationToken = async (organizationId: string) : Promise<string | any> => {
    try {
        const organization = await OrganizationAccount.findById(organizationId);
        if (!organization) throw new Error("The organization could not be found.");
        await refreshAccountCreationToken(organization);
        const token: string = (organization as any).accountCreationToken;
        return token;
    } catch (err) {
        return err;      
    }
};

export default getUpdatedAccountCreationToken;