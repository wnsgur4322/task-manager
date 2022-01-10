import mongoose from "mongoose";
import assertError from "../../../../assertError";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPBadRequest400, HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";
import AlphanumericValidator from "../../../schema-fields/validators/AlphanumericValidator";
import ExactCharacterLengthValidator from "../../../schema-fields/validators/ExactCharacterLengthValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { OrganizationAccount } from "../OrganizationAccountSchema";

/** Defines shared behavior for all OrgField derivations */
export default abstract class OrgField {

    /** This pipeline validates the organization id specified */
    private static _organizationIdValidatorPipeline =
    new SchemaFieldValidatorPipeline(
        new AlphanumericValidator("organization id"),
        new ExactCharacterLengthValidator(24, "organization id")
    );

    protected _organization: mongoose.Document<any, any, unknown>;
    private _orgFieldName: string;

    protected constructor(orgFieldName: string, organization: mongoose.Document<any, any, unknown>) {
        this._orgFieldName = orgFieldName;
        this._organization = organization;
    }

    protected static async getOrganization(organizationId: string) : Promise<mongoose.Document<any, any, unknown>> {
        try {
            const { success, errorMessage } = this._organizationIdValidatorPipeline.pipe(organizationId);
            if (!success) throw new Error(errorMessage);
            const organization = await OrganizationAccount.findById(organizationId);
            if (!organization) throw new HTTPBadRequest400("The organization id is not valid.");
            return organization;
        } catch (err) {
            throw err;
        }
    }

    protected async saveOrganization() {
        try {
            this._organization.markModified(this._orgFieldName);
            const organizationSave = await this._organization.save();
            assertError(organizationSave);
        } catch (err) {
            throw new HTTPInternalServerError500(getSimpleErrorMsg(err));
        }
    }
}