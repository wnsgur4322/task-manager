import assertError from "../../../../assertError";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import { HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";
import BasicMailer from "../../../../utils/mail/BasicMailer";

const { APP_NAME, APP_DOMAIN } = process.env;

const generateMemberInviteMessage = (adminDoc: any, memberEmail: string, memberInviteToken: string) => {

    const organizationName = adminDoc.organizationName;
    const url = `${APP_DOMAIN}/signup-member/${organizationName}/${memberEmail}/${memberInviteToken}`;
    const anchor = `<a href="${url}">here</a>`;
    return `<h1>Hey there!</h1><br><br>&emsp;${adminDoc.firstName} from ${adminDoc.organizationName} has invited you to become a member of
    their organization account on ${APP_NAME}. To register as a member, click ${anchor}. The invite
    link will expire in 24 hours, so be sure to contact ${adminDoc.firstName} if you need a new invite!
    <br>Welcome Aboard!<br>
    <br>&emsp;The ${APP_NAME} Team`;
};

/** This method is used by a moderator and above to send an member email invite
 * @returns a message informing the user that sent the invite that the email was successfully sent
*/
const sendMemberInvite =
async (user: any, memberEmail: string, memberInviteToken: string)
: Promise<string | any> => {
    try {
        const mailer = new BasicMailer(memberEmail);
        await mailer.sendEmail(
            `${user.firstName} ${user.lastName} has invited you to join ${APP_NAME}!`,
            generateMemberInviteMessage(user, memberEmail, memberInviteToken)
        );
        return `The member invite was successfully sent to ${memberEmail}!`;
    } catch (err) {
        throw err;
    }
};

export default sendMemberInvite;