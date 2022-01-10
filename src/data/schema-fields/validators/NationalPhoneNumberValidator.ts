import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

export default class NationalPhoneNumberValidator extends SchemaFieldValidator<string> {

    public constructor(fieldName: string = "phone number") {
        super(fieldName);
    }

    public removeSpacesAndExtraCharacters(phoneNumber: string) : string {
        return phoneNumber.replace(/\s|\(|\)|-|\./g, "");
    }

    public validate(field: string) : ValidatorData {
        field = this.removeSpacesAndExtraCharacters(field);
        if (field.search(/^\d{10}$/g) !== -1) return { success: true, errorMessage: "" };
        return { success: false, errorMessage: `The ${this.fieldName} format is incorrect.` };
    }
}