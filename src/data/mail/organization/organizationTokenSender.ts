import Mailer from "../../../utils/mail/Mailer";
import BasicMailer from "../../../utils/mail/BasicMailer";
import assertError from "../../../assertError";

const { APP_NAME, APP_DOMAIN } = process.env;

/** generates a custom welcome email with the link to set up their organizations account */
const generateWelcomeEmailToAdmin = (organizationName: string, adminEmail: string, organizationToken: string) => {
    let timeOfDay: string;
    const hours: number = new Date().getHours();
    if (hours >= 0 && hours < 12) timeOfDay = "morning";
    else if (hours >= 12 && hours < 18) timeOfDay = "afternoon";
    else timeOfDay = "evening";
    const url = `${APP_DOMAIN}/signup-admin/${organizationName}/${adminEmail}/${organizationToken}`;
    const anchor = `<a href="${url}">here</a>`;
    return `Good ${timeOfDay},<br><br>&emsp;You have been invited to create your ${organizationName} account for ${APP_NAME}.
    The authorization token associated with ${organizationName} is valid for the next 24 hours. You may go ${anchor} 
    to sign up. The organization token to submit in the form is below:<br><br>${organizationToken}<br><br>
    Welcome Aboard!<br><br>&emsp;The ${APP_NAME} Team`;
}

/** sends the invitation to create an account to the admin email address */
const sendEmailWithOrganizationTokenToAdmin =
async (organizationName: string, organizationToken: string, adminEmailAddress: string) : Promise<void | any> => {
    try {
        const mailer: Mailer = new BasicMailer(adminEmailAddress);
        assertError(await mailer.sendEmail(`Welcome to ${APP_NAME}!`, generateWelcomeEmailToAdmin(organizationName, adminEmailAddress, organizationToken)));
    } catch (err) {
        return err;
    }
}

export { sendEmailWithOrganizationTokenToAdmin };