import { MagicFormTemplateObject, BaseFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";

/** CheckboxInputField gets the data asscoiated with an html checkbox input field and validates the value
 * specified by the user (either true or false)
*/
export default class CheckboxInputField extends MagicFormTemplateInputField<boolean> {
    public static create(
        checkboxFieldObject: BaseFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : CheckboxInputField {
        const { fieldName } = checkboxFieldObject;
        // ensure that the field name and order are unique
        super.validateFieldName(fieldName, fieldNameSet);
        return new CheckboxInputField(fieldName, order, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "inputCheckbox",
            order,
            1,
            [ "checkbox" ],
            [ [ fieldName ] ],
            validatorFunctionsMap
        );
    }
}