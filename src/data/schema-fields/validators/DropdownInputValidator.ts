import { SchemaFieldValidator, ValidatorData } from "./SchemaFieldValidator";


export default class DropdownInputValidator extends SchemaFieldValidator<string> {

    /** Ensures each dropdown option is unique in method validate */
    private _dropdownOptionsSet: Set<string>;

    public constructor(fieldName: string = "dropdown", dropdownOptionsSet: Set<string>) {
        super(fieldName);
        this._dropdownOptionsSet = dropdownOptionsSet;
    }

    public validate(dropdownOption: string) : ValidatorData {
        if (!this._dropdownOptionsSet.has(dropdownOption))
            return { success: false, errorMessage: `The dropdown option "${dropdownOption}" is not a valid option.`};
        return { success: true, errorMessage: "" };
    }
}