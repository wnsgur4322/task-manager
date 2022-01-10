import SchemaFieldBuilder from "../../../schema-fields/SchemaFieldBuilder";
import CharacterLengthValidator from "../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../schema-fields/validators/NoControlCharactersValidator";
import SchemaFieldValidatorPipeline from "../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";

const fieldName = "description";

const descriptionField = (characterLimit: number, descriptionFieldName: string = fieldName) : object => {
    return new SchemaFieldBuilder(descriptionFieldName)
    .type(String)
    .default("")
    .validatorPipeline(
        new SchemaFieldValidatorPipeline(
            new CharacterLengthValidator(0, characterLimit, descriptionFieldName),
            new NoControlCharactersValidator(descriptionFieldName)
        )
    )
    .generateSchemaFieldObject();
};

export default descriptionField;