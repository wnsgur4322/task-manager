import { MagicFormTemplateObject, BaseFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField"

export default class PhoneInputField extends MagicFormTemplateInputField<string> {
    public static create(
        phoneFieldObject: BaseFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : PhoneInputField {
        const { fieldName } = phoneFieldObject;
        super.validateFieldName(fieldName, fieldNameSet);
        return new PhoneInputField(fieldName, order, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "inputTel",
            order,
            1,
            [ "nationalPhoneNumber" ],
            [ [ fieldName ] ],
            validatorFunctionsMap
        );
    }
}