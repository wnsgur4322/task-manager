import { MagicFormTemplateObject, DateInputFieldObject, BaseFieldObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";

/** DateInputField contains all the data concerning an html date input and validates the date
 * specified by the client.
 */
export default class DateInputField extends MagicFormTemplateInputField<string> {
    
    private _dateMustBeTodayOrAfter: boolean;
    
    public static create(
        dateFieldObject: DateInputFieldObject,
        order: number,
        fieldNameSet: Set<string>,
        validatorFunctionsMap: Record<string, Function>
    ) : DateInputField {
        const { fieldName, dateMustBeTodayOrAfter } = dateFieldObject;
        super.validateFieldName(fieldName, fieldNameSet);
        return new DateInputField(fieldName, order, dateMustBeTodayOrAfter, validatorFunctionsMap);
    }

    private constructor(
        fieldName: string,
        order: number,
        dateMustBeTodayOrAfter: boolean = false,
        validatorFunctionsMap: Record<string, Function>
    ) {
        super(
            fieldName,
            "inputDate",
            order,
            1,
            [ "date" ],
            [ [ fieldName, dateMustBeTodayOrAfter ] ],
            validatorFunctionsMap
        );
        this._dateMustBeTodayOrAfter = dateMustBeTodayOrAfter;
    }

    public getRawObject() : BaseFieldObject {
        return Object.assign({ dateMustBeTodayOrAfter: this._dateMustBeTodayOrAfter }, super.getRawObject());
    }
}