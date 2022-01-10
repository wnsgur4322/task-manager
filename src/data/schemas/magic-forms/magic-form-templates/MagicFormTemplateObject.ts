
interface BaseFieldObject {
    /** the label displayed by the input field */
    fieldName: string;
    /** The type of the input represented by a string */
    inputFieldType: string;
    order: number;
    width: number;
}

interface TextInputFieldObject extends BaseFieldObject {
    characterLimit: number | undefined;
}

interface DropdownInputFieldObject extends BaseFieldObject {
    dropdownOptions: string[];
}

interface DateInputFieldObject extends BaseFieldObject {
    dateMustBeTodayOrAfter: boolean | undefined;
}


/** Defines the structure of the raw magic form template data */
interface MagicFormTemplateObject {
    magicFormName: string;
    description: string;
    fields: BaseFieldObject[];
}

export { MagicFormTemplateObject, BaseFieldObject, DateInputFieldObject, TextInputFieldObject, DropdownInputFieldObject };