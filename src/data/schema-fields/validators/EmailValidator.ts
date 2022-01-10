import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";
import emailValidator from "email-validator";

/** The EmailValidator validates that the email follows standard email formatting */
export default class EmailValidator extends SchemaFieldValidator<string> {

    public constructor(fieldName: string = "email address") {
        super(fieldName);
    }

    public validate(field: string) : ValidatorData {
        if (emailValidator.validate(field)) return { success: true, errorMessage: "" };
        return { success: false, errorMessage: `The ${this.fieldName} is not valid.` };
    }
}