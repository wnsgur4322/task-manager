import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

/** NoSpacesValidator checks to make sure all characters in a field are not the
 * ascii code 32 (i.e a space).
 */
export default class NoSpacesValidator extends SchemaFieldValidator<string> {

    public constructor(fieldName?: string) {
        super(fieldName);
    }

    private characterIsASpace(charCode: number) : boolean {
        if (charCode === 32) return true;
        return false;
    }

    public validate(field: string) : ValidatorData {
        // iterate through field to determine if there are any spaces
        for (let i = 0; i < field.length; i++) {
            if (this.characterIsASpace(field.charCodeAt(i)))
                return { success: false, errorMessage: `The ${this.fieldName} cannot contain spaces.` };
        }
        return { success: true, errorMessage: "" };
    }
}