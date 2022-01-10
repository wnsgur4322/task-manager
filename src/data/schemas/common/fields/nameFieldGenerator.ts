import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import AlphanumericValidator from "../../../schema-fields/validators/AlphanumericValidator";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

/** generates a name field object to pass into a mongoose schema but allows for a custom field name
 * (i.e. "first name", "last name", "middle name", etc...)
 */
const nameFieldGenerator = (fieldName: string, minChars: number = 2, maxChars: number = 30) : object => {
    return new SchemaFieldBuilder<string>(fieldName)
    .type(String)
    .required()
    .validatorPipeline(
        new SchemaFieldValidatorPipeline<string>(
            new CharacterLengthValidator(minChars, maxChars, fieldName),
            new AlphanumericValidator(fieldName)
        )
    )
    .generateSchemaFieldObject();
}

export default nameFieldGenerator;