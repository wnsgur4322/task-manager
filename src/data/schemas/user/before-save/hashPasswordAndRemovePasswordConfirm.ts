import { getSimpleErrorMsg } from "../../../../errorHandler";
import logger from "../../../../logger";
import Hasher from "../../../security/hashers/Hasher";
/** This interface is defined so that we can use methods and fields on the schema passed to the
 * hashPasswordAndRemovePasswordConfirm method.
*/
interface SchemaWithPasswordFields {
    isModified(field: string): boolean,
    password: string,
    passwordConfirm: string | undefined
    passwordChangedAt: number
}

const { TOKEN_EXPIRATION_TIME } = process.env;

// This function will use a hasher implementation and 
const hashPasswordAndRemovePasswordConfirm =
async (hasher: Hasher, userSchema: SchemaWithPasswordFields) : Promise<void> => {
    try {
        if (userSchema.isModified("password")) {
            // hash the password using the hasher implementation provided
            userSchema.password = await hasher.hash(userSchema.password);
            userSchema.passwordChangedAt = Date.now();
            // passwordConfirm was only used for validation so we can delete it now
            userSchema.passwordConfirm = undefined;
        }
    } catch (err) {
        logger(getSimpleErrorMsg(err));
    }
}

export default hashPasswordAndRemovePasswordConfirm;