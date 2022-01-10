import { BaseFieldObject, MagicFormTemplateObject, TextInputFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";

enum textFieldTypes {
    INLINE_TEXT_FIELD,
    TEXT_AREA_FIELD
}

class TextInputField extends MagicFormTemplateInputField<string> {

    private _characterLimit: number;

    public static create(
        textFieldObject: TextInputFieldObject,
        inputFieldType: string,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : TextInputField {
        const { fieldName, characterLimit } = textFieldObject;
        super.validateFieldName(fieldName, fieldNameSet);
        if (characterLimit !== undefined && typeof characterLimit !== "number")
            throw new Error("The character limit must be a number.");
        return new TextInputField(fieldName, inputFieldType, order, validatorFunctionsMap, characterLimit);
    }

    private constructor(
        fieldName: string,
        inputFieldType: string,
        order: number,
        validatorFunctionsMap: Record<string, Function>,
        characterLimit: number = 2000
    ) {
        super(
            fieldName,
            inputFieldType,
            order,
            (inputFieldType === "inputText") ? 1 : 2,
            [ "characterLength", "noControlCharacters" ],
            [ [ 1, characterLimit, fieldName ], [ fieldName ] ],
            validatorFunctionsMap
        );
        this._characterLimit = characterLimit;
    }

    public getRawObject(): BaseFieldObject {
        return Object.assign({ characterLimit: this._characterLimit }, super.getRawObject());
    }
}

export { TextInputField, TextInputFieldObject, textFieldTypes };