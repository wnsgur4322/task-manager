import { MagicFormTemplateObject, BaseFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";

/** TimeInputField encapsulates the data for an html input[type=time] on a magic form*/
export default class TimeInputField extends MagicFormTemplateInputField<string> {

    public static create(
        timeFieldObject: BaseFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : TimeInputField {
        const { fieldName } = timeFieldObject;
        super.validateFieldName(fieldName, fieldNameSet);
        return new TimeInputField(fieldName, order, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "inputTime",
            order,
            1,
            [ "time" ],
            [ [ fieldName ] ],
            validatorFunctionsMap
        );
    }
}