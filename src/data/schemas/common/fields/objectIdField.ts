import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import AlphanumericValidator from "../../../schema-fields/validators/AlphanumericValidator";
import ExactCharacterLengthValidator from "../../../schema-fields/validators/ExactCharacterLengthValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

const fieldName = "object id";

const objectIdField: object = 
new SchemaFieldBuilder(fieldName)
.type(String)
.required()
.validatorPipeline(
    new SchemaFieldValidatorPipeline(
        new AlphanumericValidator(fieldName),
        new ExactCharacterLengthValidator(24, fieldName)
    )
)
.generateSchemaFieldObject();

export default objectIdField;