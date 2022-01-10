import CharacterLengthValidator from "../../../../schema-fields/validators/CharacterLengthValidator";
import NoControlCharactersValidator from "../../../../schema-fields/validators/NoControlCharactersValidator";
import SchemaFieldValidatorPipeline from "../../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";
import { MagicFormTemplateObject, DropdownInputFieldObject, BaseFieldObject } from "../MagicFormTemplateObject";
/** DropdownInputField contains the data from an html dropdown input and validates data sent to ensure it is a valid
 * option from within the dropdown itself.
 */
class DropdownInputField extends MagicFormTemplateInputField<string> {
    
    /** Ensures each dropdown option is unique in method validate */
    private _dropdownOptionsSet: Set<string>;
    /** This pipeline validates each dropdown option */
    private static _validatorPipeline: SchemaFieldValidatorPipeline<string> =
    new SchemaFieldValidatorPipeline<string>(
        new CharacterLengthValidator(1, 100, "dropdown option"),
        new NoControlCharactersValidator("dropdown option")
    );
    /** Iterates through dropdown options and checks for duplicates or dropdown options that are are invalid.
     * If all options are valid then a set is returned.
     */
    private static getDropdownOptionsSet(dropdownOptions: string[]) {
        const dropdownOptionsSet: Set<string> = new Set();
        for (const dropdownOption of dropdownOptions) {
            const { success, errorMessage } = this._validatorPipeline.pipe(dropdownOption);
            if (!success) throw new Error(errorMessage);
            if (dropdownOptionsSet.has(dropdownOption))
                throw new Error(`The dropdown option "${dropdownOption}" must be unique.`);
            dropdownOptionsSet.add(dropdownOption);
        }
        if (dropdownOptionsSet.size === 0)
            throw new Error(`There must be at least one dropdown option.`);
        return dropdownOptionsSet;
    }

    public static create(
        dropdownFieldObject: DropdownInputFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : DropdownInputField {
        const { fieldName, dropdownOptions } = dropdownFieldObject;
        if (dropdownOptions === undefined || !(dropdownOptions instanceof Array))
            throw new Error(`The dropdown options for "${fieldName}" are invalid.`);
        const dropdownOptionsSet = this.getDropdownOptionsSet(dropdownOptions);
        super.validateFieldName(fieldName, fieldNameSet);
        return new DropdownInputField(fieldName, order, dropdownOptionsSet, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        dropdownOptionsSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "selectWithOptions",
            order,
            1,
            [ "dropdownOption" ],
            [ [ fieldName, dropdownOptionsSet ] ],
            validatorFunctionsMap
        );
        this._dropdownOptionsSet = dropdownOptionsSet;
    }

    public getRawObject() : BaseFieldObject {
        return Object.assign({ dropdownOptions: [...this._dropdownOptionsSet.keys()] }, super.getRawObject());
    }
}

export { DropdownInputField, DropdownInputFieldObject };