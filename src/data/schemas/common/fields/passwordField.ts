import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import NoSpacesValidator from "../../../schema-fields/validators/NoSpacesValidator";
import PasswordValidator from "../../../schema-fields/validators/PasswordValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import BasicStrengthChecker from "../../../security/password-strength-checkers/BasicStrengthChecker";

const fieldName: string = "password";

const passwordField: object =
new SchemaFieldBuilder<string>(fieldName)
.type(String)
.required()
.validatorPipeline(
    new SchemaFieldValidatorPipeline(
        new CharacterLengthValidator(8,30, fieldName),
        new NoControlCharactersValidator(fieldName),
        new NoSpacesValidator(fieldName),
        new PasswordValidator(new BasicStrengthChecker(), fieldName)
    )
)
.generateSchemaFieldObject();

export default passwordField;
