import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import EmailValidator from "../../../schema-fields/validators/EmailValidator";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

const fieldName: string = "email address";

const nonUniqueEmailField: object =
new SchemaFieldBuilder<string>(fieldName)
.type(String)
.required()
.validatorPipeline(
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(5, 320, fieldName),
        new EmailValidator(fieldName)
    )
)
.generateSchemaFieldObject();

export default nonUniqueEmailField;