import assertError from "../../../../assertError";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import NoSpacesValidator from "../../../schema-fields/validators/NoSpacesValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import OrgMember from "../../organization/field-managers/OrgMember";
import { User, UpdatedUserInfo, IUser } from "../User";
import { validateUpdateEmail } from "./../field-update-validation-handlers/emailUpdateValidator";
import { validateUpdateName } from "./../field-update-validation-handlers/nameUpdateValidator";

const fieldName = "username";

const usernameValidatorPipeline =
new SchemaFieldValidatorPipeline<string>(
    new CharacterLengthValidator(2,30,fieldName),
    new NoSpacesValidator(fieldName),
    new NoControlCharactersValidator(fieldName)
);

const validateUpdateUsername = async (user: any, newUsername: string | undefined) => {
    try {
        if (newUsername !== user.username && newUsername !== undefined) {
            const { success, errorMessage } = usernameValidatorPipeline.pipe(newUsername);
            if (!success) throw new Error(errorMessage);
            const usernameIsTaken = await User.findOne({ username: newUsername });
            if (usernameIsTaken) throw new Error("The username specified is taken.");

            // update member entry on organization
            const orgMember = await OrgMember.create((user as any)._id, user.organizationId);
            assertError(orgMember);
            const updateOrgMember = await (orgMember as OrgMember).refreshMemberUsername(newUsername);
            assertError(updateOrgMember);

            user.username = newUsername;
        }
    } catch (err) {
        return err;
    }
};

/** This method alllows a user to update some of their profile information all at once. All fields are validated
 * updating.
 */
 const updateUsersPersonalProfileInfo =
 async (user: IUser, updatedInfo: UpdatedUserInfo) : Promise<void | any> => {
     try {
         const firstNameValidation = await validateUpdateName("first name", "firstName")(user, updatedInfo.firstName);
         assertError(firstNameValidation);
         const lastNameValidation = await validateUpdateName("last name", "lastName")(user, updatedInfo.lastName);
         assertError(lastNameValidation);
         const emailValidation = await validateUpdateEmail(user, updatedInfo.email);
         assertError(emailValidation);
         const usernameValidation = await validateUpdateUsername(user, updatedInfo.username);
         assertError(usernameValidation);
 
         const userUpdate = await (user as any).save({ validateBeforeSave: false });
         assertError(userUpdate);
     } catch (err) {
         return err;
     }
 };

export { validateUpdateUsername, updateUsersPersonalProfileInfo };