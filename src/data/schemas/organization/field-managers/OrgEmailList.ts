import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import EmailValidator from "../../../schema-fields/validators/EmailValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import OrgField from "./OrgField";
import mongoose from "mongoose";
import { HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";

interface IEmailList {
    emailListName: string;
    emailList: string[];
}

const EmailListSchema = new mongoose.Schema({
    emailListName: { type: String, required: true },
    emailList: { type: Array, required: true }
});

const EmailList: mongoose.Model<unknown> = mongoose.model("EmailList", EmailListSchema);

/** OrgEmailList acts as an interface for CRUD operations performed on an email list */
class OrgEmailList extends OrgField {

    private static _emailValidatorPipeline =
    new SchemaFieldValidatorPipeline(
        new CharacterLengthValidator(5, 320, "email address"),
        new EmailValidator("email address")
    );
    private static _emailListNameValidatorPipeline =
    new SchemaFieldValidatorPipeline(
        new CharacterLengthValidator(1, 300, "email list name"),
        new NoControlCharactersValidator("email list name")
    );

    private _emailListDocument: mongoose.Document<any, any, unknown>;
    private _emailListName: string;
    private _savedToDB: boolean;

    private static validateEmailListName(emailListName: string | undefined) {
        if (emailListName === undefined) throw new Error("The email list name is required.");
        if (emailListName === "initialized") throw new Error("The name \"initialized\" is reserved.");
        const emailListNameValidation = this._emailListNameValidatorPipeline.pipe(emailListName);
        if (!emailListNameValidation.success) throw new Error(emailListNameValidation.errorMessage);
    }

    private static getEmailListSet(emailList: string[], organization: mongoose.Document<any, any, unknown>) {
        if (!(emailList instanceof Array)) throw new Error("The email list must be sent as an Array.");
        // get rid of duplicates
        const emailListSet = new Set<string>(emailList);
        if (emailListSet.size > (organization as any).memberLimit)
            throw new Error(`The number of emails in the email list must not exceed the member limit of ${(organization as any).memberLimit}`);
        // iterate through each email and validate it
        for (const email of [...emailListSet]) {
            const { success, errorMessage } = this._emailValidatorPipeline.pipe(email);
            if (!success) {
                const message = errorMessage.slice(0, 17) + ` "${email}"` + errorMessage.slice(17);
                throw new Error(message);
            }
        }
        return emailListSet;
    }

    public static async create(emailListName: string, emailList: string[], organizationId: string) {
        try {
            const organization = await super.getOrganization(organizationId);
            this.validateEmailListName(emailListName);
            // ensure that the email list name is not already taken for this organization
            if (emailListName in (organization as any).emailListsMap)
                throw new Error(`The name "${emailListName}" is already used by an existing email list.`);
            const emailListSet = this.getEmailListSet(emailList, organization);
            return new OrgEmailList(emailListName, [...emailListSet], organization);
        } catch (err) {
            throw err;
        }
    }

    public static async load(emailListName: string, organizationId: string) {
        try {
            const organization = await super.getOrganization(organizationId);
            this.validateEmailListName(emailListName);
            // ensure that the email list name actually exists in the organization
            if (!(emailListName in (organization as any).emailListsMap))
                throw new Error(`There is no such email list by the name "${emailListName}".`);
            const emailListDocumentId = (organization as any).emailListsMap[emailListName];
            const emailListDocument = await EmailList.findById(emailListDocumentId);
            if (!emailListDocument) throw new HTTPInternalServerError500("The email list could not be located.");
            return new OrgEmailList((emailListDocument as any).emailListName, (emailListDocument as any).emailList, organization, emailListDocument);
        } catch (err) {
            throw err;
        }
    }

    /** Overwrites an existing email list with new/modified data */
    public async overwrite(newEmailList: string[]) {
        try {
            if (!this._savedToDB)
                throw new Error("overwrite() can only be called for a email list that already exists in the database.");
            (this._emailListDocument as any).emailListSet = OrgEmailList.getEmailListSet(newEmailList, this._organization);
            await this.save();
        } catch (err) {
            throw err;
        }   
    }

    public async getEmailListData() : Promise<IEmailList> {
        try {
            const { emailListName, emailList } = (this._emailListDocument as any);
            return {
                emailListName,
                emailList
            };
        } catch (err) {
            throw err;
        }
    }
    /** saves a email list to the organization account it is associated with */
    public async save() {
        try {
            await this._emailListDocument.save();
            (this._organization as any).emailListsMap[this._emailListName] = this._emailListDocument._id;
            await super.saveOrganization();
            this._savedToDB = true;
        } catch (err) {
            throw err;
        }
    }

    private constructor(
        emailListName: string,
        emailList: string[],
        organization: mongoose.Document<any, any, unknown>,
        emailListDocument: mongoose.Document<any, any, unknown> | null = null
    ) {
        super("emailListsMap", organization);
        this._emailListName = emailListName;
        if (emailListDocument) {
            this._emailListDocument = emailListDocument;
            this._savedToDB = true;
        } else {
            this._emailListDocument = new EmailList({ emailListName, emailList });
            this._savedToDB = false;
        }
    }
}

export { OrgEmailList, IEmailList, EmailList };