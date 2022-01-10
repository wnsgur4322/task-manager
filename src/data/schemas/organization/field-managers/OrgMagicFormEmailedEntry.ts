import MagicFormEmailedManager from "../../magic-forms/magic-form-instances/magic-form-emailed/MagicFormEmailedManager";
import OrgField from "./OrgField";
import mongoose from "mongoose";

interface IMagicFormEmailedRequestObject {
    magicFormTemplateName: string;
    roles: string[];
    emailListNamesForFormRecipients: string[];
    emailListNamesForSubmissionNotifications: string[];
    onlyOneSubmissionPerPerson: boolean;
}

/** OrgMagicFormEmailedEntry is an abstraction of a given entry on the magicFormEmailedMap on the corresponding
 * organization account document. It acts as an interface between the controller and the business logic in MagicFormEmailedManager
 */
class OrgMagicFormEmailedEntry extends OrgField {

    private _magicFormEmailedManager: MagicFormEmailedManager | undefined;

    public static async validateMagicFormTemplateName(magicFormEmailedRequestObject: IMagicFormEmailedRequestObject, organization: mongoose.Document<any, any, unknown>) {
        try {
            const { magicFormTemplateName } = magicFormEmailedRequestObject;
            if (!magicFormTemplateName) throw new Error("The magic form template name is required.");
            if (!(magicFormTemplateName in (organization as any).magicFormTemplateMap) || magicFormTemplateName === "initialized")
                throw new Error(`The magic form template named "${magicFormTemplateName}" does not exist.`);
        } catch (err) {
            throw err;
        }
    }
    public static async getValidatedRoles(magicFormEmailedRequestObject: IMagicFormEmailedRequestObject, organization: mongoose.Document<any, any, unknown>) {
        try {
            const rolesSet = new Set(magicFormEmailedRequestObject.roles);
            for (const role of rolesSet) {
                if (!(role in (organization as any).roles) || role === "initialized")
                    throw new Error(`The role named "${role}" does not exist in ${(organization as any).name}.`);
            }
            return [...rolesSet];
        } catch (err) {
            throw err;
        }
    }

    public static async getValidatedEmailListNames(emailListNames: string[], organization: mongoose.Document<any, any, unknown>) {
        try {
            const emailListNamesSet = new Set(emailListNames);
            for (const emailListName of emailListNamesSet) {
                if (!(emailListName in (organization as any).emailListsMap) || emailListName === "initialized")
                    throw new Error(`The email list named "${emailListName}" does not exist in ${(organization as any).name}.`);
            }
            return [...emailListNamesSet];
        } catch (err) {
            throw err;
        }
    }

    public static async create(magicFormEmailedRequestObject: IMagicFormEmailedRequestObject, organizationId: string) {
        try {
            const organization = await super.getOrganization(organizationId);
            await this.validateMagicFormTemplateName(magicFormEmailedRequestObject, organization);
            const roles = await this.getValidatedRoles(magicFormEmailedRequestObject, organization);
            const emailListNamesForFormRecipients = await this.getValidatedEmailListNames(magicFormEmailedRequestObject.emailListNamesForFormRecipients, organization);
            const emailListNamesForSubmissionNotifications = await this.getValidatedEmailListNames(magicFormEmailedRequestObject.emailListNamesForSubmissionNotifications, organization);
        } catch (err) {
            throw err;
        }
    }
}

export { IMagicFormEmailedRequestObject, OrgMagicFormEmailedEntry };