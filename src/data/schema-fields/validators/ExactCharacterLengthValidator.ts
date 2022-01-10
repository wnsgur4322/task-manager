import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

export default class ExactCharacterLengthValidator extends SchemaFieldValidator<string> {

    private _exactChars: number;

    public constructor(exactChars: number, fieldName?: string) {
        super(fieldName);
        if (exactChars < 1) throw new Error("exactChars must be a positive integer");
        this._exactChars = parseInt(`${exactChars}`);
    }

    public validate(field: string) : ValidatorData {
        if (field.length !== this._exactChars) return { success: false, errorMessage: `The ${this.fieldName} must be exactly ${this._exactChars} characters long.`};
        return { success: true, errorMessage: ""};
    }
}