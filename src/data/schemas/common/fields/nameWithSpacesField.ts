import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

const fieldName: string = "organization name";

const nameWithSpacesField: object =
new SchemaFieldBuilder<string>(fieldName)
.type(String)
.required()
.unique()
.validatorPipeline(
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(1, 300, fieldName),
        new NoControlCharactersValidator(fieldName)
    )
)
.generateSchemaFieldObject();

export default nameWithSpacesField;