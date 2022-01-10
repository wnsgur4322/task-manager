import Mailer from "./Mailer";
import nodeMailer from "nodemailer";
import { HTTPInternalServerError500 } from "../errors/http/httpErrors";
import { getSimpleErrorMsg } from "../../errorHandler";

const { SENDER_EMAIL, SENDER_EMAIL_PASSWORD, APP_NAME, EMAIL_SERVICE, EMAIL_AUTH_TYPE, EMAIL_PORT, EMAIL_HOST, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_ACCESS_TOKEN, EMAIL_REFRESH_TOKEN } = process.env;
/** Basic implementation that uses the nodemailer package to conduct the sending */
export default class BasicMailer extends Mailer {

    private static _senderEmailAddress = SENDER_EMAIL;
    private static _senderEmailPassword = SENDER_EMAIL_PASSWORD;

    private _transporter: nodeMailer.Transporter;

    public constructor(receiverEmailAddress: string) {
        super(receiverEmailAddress);
        this._transporter = nodeMailer.createTransport({
            service: (EMAIL_SERVICE as any),
            auth: {
                type: EMAIL_AUTH_TYPE,
                user: SENDER_EMAIL,
                clientId: EMAIL_CLIENT_ID,
                clientSecret: EMAIL_CLIENT_SECRET,
                refreshToken: EMAIL_REFRESH_TOKEN,
                accessToken: EMAIL_ACCESS_TOKEN

            }
        } as any);
    }

    public async sendEmail(subject: string, content: string) : Promise<void | any> {
        try {
            await this._transporter.sendMail({
                from: `${APP_NAME} <${BasicMailer._senderEmailAddress}>`,
                to: this.receiverEmailAddress,
                subject,
                html: content
            });
        } catch (err) {
            throw new HTTPInternalServerError500(getSimpleErrorMsg(err));  
        }
    }
}