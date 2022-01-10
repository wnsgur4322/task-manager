import { BaseFieldObject, DateInputFieldObject, DropdownInputFieldObject, TextInputFieldObject } from "../MagicFormTemplateObject";
import CheckboxInputField from "./CheckboxInputField";
import DateInputField from "./DateInputField";
import { DropdownInputField } from "./DropdownInputField";
import EmailInputField from "./EmailInputField";
import { MagicFormTemplateInputField } from "./MagicFormTemplateInputField";
import PhoneInputField from "./PhoneInputField";
import { TextInputField } from "./TextInputField";
import TimeInputField from "./TimeInputField";

type MagicFormInputFieldConstructor =
(
    magicFormTemplateInputObject: Record<string, any>,
    order: number,
    fieldNameSet: Set<string>,
    validatorFunctionsMap: Record<string, Function>
) => Promise<MagicFormTemplateInputField<any>>;

const magicFormInputFieldsConstructors: Map<string, MagicFormInputFieldConstructor> =
new Map([
    ["inputText", 
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const inputTextField = await TextInputField
            .create((magicFormTemplateInputObject as TextInputFieldObject), "inputText", order, fieldNameSet, validatorFunctionsMap);
            return inputTextField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["textArea", 
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const textAreaField = await TextInputField
            .create((magicFormTemplateInputObject as TextInputFieldObject), "textArea", order, fieldNameSet, validatorFunctionsMap);
            return textAreaField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["inputEmail", 
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const emailField = await EmailInputField
            .create((magicFormTemplateInputObject as BaseFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return emailField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["inputTel",
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const phoneField = await PhoneInputField
            .create((magicFormTemplateInputObject as BaseFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return phoneField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["inputDate",
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const dateField = await DateInputField
            .create((magicFormTemplateInputObject as DateInputFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return dateField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["inputTime",
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const timeField = await TimeInputField
            .create((magicFormTemplateInputObject as BaseFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return timeField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["inputCheckbox",
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const checkboxField = await CheckboxInputField
            .create((magicFormTemplateInputObject as BaseFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return checkboxField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }],
    ["selectWithOptions",
    async (magicFormTemplateInputObject: Record<string, any>, order: number,
    fieldNameSet: Set<string>, validatorFunctionsMap: Record<string, Function>
    ) => {
        try {
            const dropdownField = await DropdownInputField
            .create((magicFormTemplateInputObject as DropdownInputFieldObject), order, fieldNameSet, validatorFunctionsMap);
            return dropdownField as MagicFormTemplateInputField<any>;
        } catch (err) {
            throw err;
        }
    }]
]);

export { magicFormInputFieldsConstructors, MagicFormInputFieldConstructor };