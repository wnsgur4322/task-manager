import { getSimpleErrorMsg } from "../../../../errorHandler";
import logger from "../../../../logger";
import Hasher from "../../../security/hashers/Hasher"

const { TOKEN_EXPIRATION_TIME } = process.env;

/** hashes a particular token and updates the expiration time accordingly */
const hashTokenAndUpdateExpiration = async (fieldName: string, schema: any, hasher: Hasher) : Promise<void> => {
    try {
        if (schema.isModified(fieldName)) {
            schema[fieldName] = await hasher.hash(schema[fieldName]);
            const expirationField = `${fieldName}Expiration`;
            schema[expirationField] = Date.now() + parseInt(`${TOKEN_EXPIRATION_TIME}`);
        }
    } catch (err) {
        logger(getSimpleErrorMsg(err));
    }
}

export default hashTokenAndUpdateExpiration;