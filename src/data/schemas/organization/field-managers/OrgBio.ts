import OrgField from "./OrgField";
import mongoose from "mongoose";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";

/** OrgBio manages the updating for an organization's account bio */
export default class OrgBio extends OrgField {
    private _bio: string;
    /** static field validator pipeline used to validate the bio field*/
    private static _bioValidator =
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(0,2000,"bio"),
        new NoControlCharactersValidator("bio")
    );

    public static async create(organizationId: string, bio: string | undefined) {
        try {
            const organization = await super.getOrganization(organizationId);
            if (!bio) bio = "";
            const { success, errorMessage } = OrgBio._bioValidator.pipe(bio);
            if (!success) throw new Error(errorMessage);
            return new OrgBio(organization, bio);
        } catch (err) {
            throw err;
        }
    }

    public constructor(organization: mongoose.Document<any, any, unknown>, bio: string) {
        super("bio", organization);
        this._bio = bio;
    }

    public async save() {
        try {
            (this._organization as any).bio = this._bio;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}