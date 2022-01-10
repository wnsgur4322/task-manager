import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import NoSpacesValidator from "../../../schema-fields/validators/NoSpacesValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

const fieldName: string = "username";

const usernameField: object =
new SchemaFieldBuilder<string>(fieldName)
.type(String)
.required()
.validatorPipeline(
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(2,30),
        new NoSpacesValidator(fieldName),
        new NoControlCharactersValidator(fieldName)
    )
)
.generateSchemaFieldObject();

export default usernameField;