import { MagicFormEmailed, IMagicFormEmailed } from "./MagicFormEmailedSchema";


export default class MagicFormEmailedManager {

    private _magicFormTemplateName: string | undefined;
    private _roles: string[] | undefined;
    private emailListNamesForFormRecipients: string[] | undefined;
    private emailListNamesForSubmissionNotifications: string[] | undefined;
    private onlyOneSubmissionPerPerson: boolean | undefined;

    public static async create(magicFormEmailedRequestObject: IMagicFormEmailed, organizationId: string) {
        try {
            
        } catch (err) {
            
        }
    }
}

