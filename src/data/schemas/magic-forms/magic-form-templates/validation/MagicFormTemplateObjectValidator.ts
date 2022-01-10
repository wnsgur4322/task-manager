import CharacterLengthValidator from "../../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../../schema-fields/validators/NoControlCharactersValidator";
import SchemaFieldValidatorPipeline from "../../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { MagicFormTemplateObject } from "../MagicFormTemplateObject";


export default class MagicFormTemplateObjectValidator {

    private static _magicFormTemplateNameValidator: SchemaFieldValidatorPipeline<string> =
    new SchemaFieldValidatorPipeline(
        new CharacterLengthValidator(1, 200, "magic form name"),
        new NoControlCharactersValidator("magic form name")
    );
    private static _descriptionValidator: SchemaFieldValidatorPipeline<string> =
    new SchemaFieldValidatorPipeline(
        new CharacterLengthValidator(0, 10000, "magic form description"),
        new NoControlCharactersValidator("magic form description")
    );

    public static async validate(magicFormTemplateObject: MagicFormTemplateObject) : Promise<void> {
        try {
            let { magicFormName, description } = magicFormTemplateObject;
            // verify that the name isn't empty
            if (!magicFormName) throw new Error("The magic form template name is required.");
            if (magicFormName == "initialized") throw new Error("The word \"initialized\" is reserved and cannot be used.");
            // set the description property to empty string if it is not defined 
            if (!description) description = "";
            // validate both fields
            const magicFormNameValidation = this._magicFormTemplateNameValidator.pipe(magicFormName);
            if (!magicFormNameValidation.success) throw new Error(magicFormNameValidation.errorMessage);
            const magicFormDescriptionValidation = this._descriptionValidator.pipe(description);
            if (!magicFormDescriptionValidation.success) throw new Error(magicFormDescriptionValidation.errorMessage);
        } catch (err) {
            throw err;
        }
    }
}