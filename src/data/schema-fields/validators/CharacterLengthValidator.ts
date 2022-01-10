import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

/** The CharacterLengthValidator class validates that the recieved field's length is between _minChars and _maxChars */
export default class CharacterLengthValidator extends SchemaFieldValidator<string> {

    private _minChars: number;
    private _maxChars: number;

    public constructor(minChars: number, maxChars: number, fieldName? : string) {
        super(fieldName);
        if (minChars < 0 || maxChars < 0) throw new Error("minChars and maxChars must be strictly nonnegative.");
        if (minChars > maxChars) throw new Error("minChars must be less than or equal to maxChars.");
        this._minChars = parseInt(`${minChars}`);
        this._maxChars = parseInt(`${maxChars}`);
    }

    public validate(field: string) : ValidatorData {
        if (field.length < this._minChars)
            return { success: false, errorMessage: `The ${this.fieldName} must contain a minimum of ${this._minChars} characters.` };
        else if (field.length > this._maxChars)
            return { success: false, errorMessage: `The ${this.fieldName} must contain a maximum of ${this._maxChars} characters.` };
        return { success: true, errorMessage: "" };
    }
}