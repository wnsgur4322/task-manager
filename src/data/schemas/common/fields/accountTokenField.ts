import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import AlphanumericValidator from "../../../schema-fields/validators/AlphanumericValidator";
import ExactCharacterLengthValidator from "../../../schema-fields/validators/ExactCharacterLengthValidator";

const fieldName: string = "account creation token";

const adminTokenField: object =
new SchemaFieldBuilder<string>(fieldName)
.type(String)
.required()
.unique()
.validatorPipeline(
    new SchemaFieldValidatorPipeline<string>(
        new AlphanumericValidator(fieldName),
        new ExactCharacterLengthValidator(64, fieldName)
    )
)
.generateSchemaFieldObject();

export default adminTokenField;