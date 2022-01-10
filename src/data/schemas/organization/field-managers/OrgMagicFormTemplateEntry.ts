import { MagicFormTemplateObject } from "../../magic-forms/magic-form-templates/MagicFormTemplateObject";
import OrgField from "./OrgField";
import mongoose from "mongoose";
import { MagicFormTemplateManager } from "../../magic-forms/magic-form-templates/magic-form-template-management/MagicFormTemplateManager";
import MagicFormTemplateObjectValidator from "../../magic-forms/magic-form-templates/validation/MagicFormTemplateObjectValidator";

/** OrgMagicFormTemplateEntry allows the API to create a new magic form document from an object sent in a request
 * or load an existing magic form from the database. The internal data of the form template can easily be modified
 * using this class.
 */
export default class OrgMagicFormTemplateEntry extends OrgField {

    private _magicFormTemplateManager: MagicFormTemplateManager;

    /** This method creates a brand new magic form manager based on the request body sent. */
    public static async create(magicFormTemplateObject: MagicFormTemplateObject, organizationId: string)
    : Promise<OrgMagicFormTemplateEntry> {
        try {
            const organization = await super.getOrganization(organizationId);
            let { magicFormName } = magicFormTemplateObject;
            await MagicFormTemplateObjectValidator.validate(magicFormTemplateObject);
            // ensure that the magic form name is not already in use by the organization
            if (magicFormName in (organization as any).magicFormTemplateMap)
                throw new Error(`You already have a magic form template named "${magicFormName}".`);
            const magicFormTemplateManager = await MagicFormTemplateManager.create(magicFormTemplateObject);
            return new OrgMagicFormTemplateEntry(magicFormTemplateManager, organization);
        } catch (err) {
            throw err;
        }
    }
    /** Load a magic form from the database using the name */
    public static async load(magicFormTemplateName: string, organizationId: string)
    : Promise<OrgMagicFormTemplateEntry> {
        try {
            const organization = await super.getOrganization(organizationId);
            // if there is no magic form that exists with this name in the organization then throw an error
            if (!(magicFormTemplateName in (organization as any).magicFormTemplateMap))
                throw new Error(`There is no such magic form template with the name "${magicFormTemplateName}".`);
            const magicFormTemplateDocId = (organization as any).magicFormTemplateMap[magicFormTemplateName];
            const magicFormTemplateManager = await MagicFormTemplateManager.load(magicFormTemplateDocId);
            return new OrgMagicFormTemplateEntry(magicFormTemplateManager, organization);
        } catch (err) {
            throw err;
        }
    }

    private constructor(
        magicFormTemplateManager: MagicFormTemplateManager,
        organization: mongoose.Document<any, any, unknown>
    ) {
        super("magicFormTemplateMap", organization);
        this._magicFormTemplateManager = magicFormTemplateManager;
    }
    /** Saves the magic form template to the database and adds the entry on the organization's magicFormTemplateMap
     * property.
     */
    public async save() {
        try {
            await this._magicFormTemplateManager.save();
            (this._organization as any).magicFormTemplateMap[this._magicFormTemplateManager.getName()] = this._magicFormTemplateManager.getId();
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }

    public async remove() {
        try {
            await this._magicFormTemplateManager.remove();
            delete (this._organization as any).magicFormTemplateMap[this._magicFormTemplateManager.getName()];
            await super.saveOrganization();
        } catch (err) {
            
        }
    }
}