import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import EmailValidator from "../../../schema-fields/validators/EmailValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { AuthTokenGenerator64 } from "../../../security/token/authTokenGenerators";
import { User } from "../User";

const emailValidatorPipeline =
new SchemaFieldValidatorPipeline<string>(
    new CharacterLengthValidator(5, 320, "email"),
    new EmailValidator("email")
);

/** This method validates the new email used to update the email field and if successful updates a few other fields */
const validateUpdateEmail = async (user: any, newEmail: string | undefined) => {
    try {
        if (newEmail !== user.email && newEmail !== undefined) {
            const { success, errorMessage } = emailValidatorPipeline.pipe(newEmail);
            if (!success) throw new Error(errorMessage);
            const emailIsTaken = await User.findOne({ email: newEmail });
            if (emailIsTaken) throw new Error("The email specified is taken.");
            user.email = newEmail;
            user.emailIsVerified = false;
            user.emailVerificationToken = new AuthTokenGenerator64().generate();
            user.emailVerificationTokenExpiration = 0;
        }   
    } catch (err) {
        return err;
    }
};

export { validateUpdateEmail };