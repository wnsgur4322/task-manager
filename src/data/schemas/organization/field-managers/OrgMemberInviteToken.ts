import mongoose from "mongoose";
import { HTTPBadRequest400, HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import EmailValidator from "../../../schema-fields/validators/EmailValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import BasicHasher from "../../../security/hashers/BasicHasher";
import { AuthTokenGenerator64 } from "../../../security/token/authTokenGenerators";
import { User } from "../../user/User";
import OrgField from "./OrgField";
import OrgMemberCount from "./OrgMemberCount";

const emailValidatorPipeline =
new SchemaFieldValidatorPipeline(
    new CharacterLengthValidator(2,320,"member email"),
    new EmailValidator("member email")
);

/** OrgMemberToken allows for the creation and deletion of member invite tokens using a unique email address.
 * A new token can be saved, an existing token can be updated, and an existing token can be deleted
 */
const { TOKEN_EXPIRATION_TIME } = process.env;

export default class OrgMemberInviteToken extends OrgField {

    private _memberEmail: string;
    private _unhashedToken: string | undefined;
    private _hashedToken: string | undefined;
    private _tokenExpiration: number = 0;

    /** This method validates that the member email is valid and then returns an instance
     * of OrgMemberInviteToken */
    public static async create(memberEmail: string | undefined, memberEmailConfirm: string | undefined, organizationId: string) {
        try {
            if (!memberEmail) throw new HTTPBadRequest400("The member email is required.");
            if (!memberEmailConfirm) throw new HTTPBadRequest400("The confirmed member email is required.");
            const organization = await super.getOrganization(organizationId.toString());
            const { success, errorMessage } = emailValidatorPipeline.pipe(memberEmail);
            if (!success) throw new HTTPBadRequest400(errorMessage);
            if (memberEmail !== memberEmailConfirm)
                throw new HTTPBadRequest400("The confirmed email must match the email");
            return new OrgMemberInviteToken(memberEmail, (organization as any));
        } catch (err) {
            throw err;
        }
    }

    private constructor(memberEmail: string, organization: mongoose.Document<any, any, unknown>) {
        super("memberInviteTokens", organization);
        this._memberEmail = memberEmail;
    }

    /** generates a new unhashed and hashed token pair along with its expiration time.
     * This is used before saving a token to the database */
    public async generateToken() {
        this._unhashedToken = new AuthTokenGenerator64().generate();
        const hasher = new BasicHasher();
        this._hashedToken = await hasher.hash(this._unhashedToken);
        this._tokenExpiration = Date.now() + parseInt(`${TOKEN_EXPIRATION_TIME}`);
    }
    /** The unhashedToken is needed for the member to create their account */
    public get unhashedToken() {
        return this._unhashedToken;
    }

    public async validateUnhashedToken(unhashedToken: string) {
        try {
            if (!(this._memberEmail in (this._organization as any).memberInviteTokens))
                throw new HTTPBadRequest400(`Invalid token or token for email "${this._memberEmail}" does not exist.`);
            const hashedToken = (this._organization as any).memberInviteTokens[this._memberEmail].token;
            const tokenExpiration = (this._organization as any).memberInviteTokens[this._memberEmail].expiration;
            const hasher = new BasicHasher();
            const tokenMatches = await hasher.compare(unhashedToken, hashedToken);
            if (!tokenMatches)
                throw new HTTPBadRequest400(`Invalid token or token for email "${this._memberEmail}" does not exist.`);
            if (tokenExpiration < Date.now())
                throw new HTTPBadRequest400("The token has expired. Please contact your organization admin to request a new token.");
        } catch (err) {
            throw err;
        }
    }

    /** Saves the token and expiration time under the member email address key in the memberInviteTokens property */
    public async save() {
        try {
            // throw an error if we cannot invite a new member
            const memberCount = new OrgMemberCount(this._organization);
            memberCount.throwErrorIfMemberCannotBeAdded();
            const userWithMemberEmail = await User.findOne({ email: this._memberEmail });
            if (userWithMemberEmail) throw new HTTPBadRequest400(`The user with email "${this._memberEmail}" has already been invited.`);
            if (this._hashedToken === undefined)
                throw new HTTPInternalServerError500("generateToken() must be called before calling save().");
            (this._organization as any).memberInviteTokens[this._memberEmail] = {
                token: this._hashedToken,
                expiration: this._tokenExpiration
            };
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }

    /** Removes the entry from memberInviteTokens with the member email specified */
    public async remove() {
        try {
            if (!(this._memberEmail in (this._organization as any).memberInviteTokens))
                throw new HTTPBadRequest400(`Cannot remove the member invite token entry for "${this._memberEmail}" as it does not exist.`);
            delete (this._organization as any).memberInviteTokens[this._memberEmail];
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}