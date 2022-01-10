
/** This class uses the roles and email lists to extract the emails to send the form to as well as the 
 * emails to notify when forms are submitted.
 */
export default class MagicFormEmailsExtracter {

    private _roles: string[];
    private _emailListNamesForFormRecipients: string[];
    private _emailListNamesForSubmissionNotifications: string[];

    public constructor(
        roles: string[],
        emailListNamesForFormRecipients: string[],
        emailListNamesForSubmissionNotifications: string[]
    ) {
        this._roles = roles;
        this._emailListNamesForFormRecipients = emailListNamesForFormRecipients;
        this._emailListNamesForSubmissionNotifications = emailListNamesForSubmissionNotifications;
    }

    public async getEmailsToSendFormAndEmailsToBeNotified() {
        try {
            
        } catch (err) {
            
        }
    }
}