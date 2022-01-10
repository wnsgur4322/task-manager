import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

/** NoControlCharactersValidator checks to make sure all characters in a field are greater than or equal to the
 * ascii code 32 (i.e a space).
 */
export default class NoControlCharactersValidator extends SchemaFieldValidator<string> {

    public constructor(fieldName?: string) {
        super(fieldName);
    }

    private characterIsNotValid(charCode: number) : boolean {
        if (charCode < 32) return true;
        return false;
    }

    public validate(field: string) : ValidatorData {
        // iterate through field to determine if there are any invalid characters
        for (let i = 0; i < field.length; i++) {
            if (this.characterIsNotValid(field.charCodeAt(i)))
                return { success: false, errorMessage: `The ${this.fieldName} cannot contain control characters.` };
        }
        return { success: true, errorMessage: "" };
    }
}