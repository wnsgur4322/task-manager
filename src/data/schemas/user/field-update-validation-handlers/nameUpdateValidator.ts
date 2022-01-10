import AlphanumericValidator from "../../../schema-fields/validators/AlphanumericValidator";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { SchemaFieldValidator } from "../../../schema-fields/validators/SchemaFieldValidator";

/** This method validates the information used to update a personal name field */
const validateUpdateName = (humanFriendlyName: string, fieldName: string = "name", minChars: number = 2, maxChars: number = 30) => {

    const nameValidatorPipeline =
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(minChars, maxChars, humanFriendlyName),
        new AlphanumericValidator(humanFriendlyName)
    );

    return async (user: any, newName: string | undefined) => {
        try {
            if (newName !== user[fieldName] && newName !== undefined) {
                const { success, errorMessage } = nameValidatorPipeline.pipe(newName);
                if (!success) throw new Error(errorMessage);
                user[fieldName] = newName;
            }
        } catch (err) {
            return err;
        }
    };
};

export { validateUpdateName };