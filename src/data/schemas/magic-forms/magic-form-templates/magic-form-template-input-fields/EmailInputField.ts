import { BaseFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";

export default class EmailInputField extends MagicFormTemplateInputField<string> {

    public static create(
        emailFieldObject: BaseFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : EmailInputField {
        const { fieldName } = emailFieldObject;
        super.validateFieldName(fieldName, fieldNameSet);
        return new EmailInputField(fieldName, order, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "inputEmail",
            order,
            1,
            [ "characterLength", "emailAddress" ],
            [ [ 5, 320, fieldName ], [ fieldName ] ],
            validatorFunctionsMap
        );
    }
}