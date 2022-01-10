
export default abstract class Mailer {

    private _recieverEmailAddress: string;

    protected constructor(recieverEmailAddress: string) {
        this._recieverEmailAddress = recieverEmailAddress;
    }

    /**
     * @param subject the subject of the email
     * @param content the content which could be raw text or html
     */
    public abstract sendEmail(subject: string, content: string) : Promise<void>;

    public get receiverEmailAddress(): string { return this._recieverEmailAddress; }
}
