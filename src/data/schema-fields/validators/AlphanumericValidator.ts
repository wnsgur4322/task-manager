import { ValidatorData, SchemaFieldValidator} from "./SchemaFieldValidator";

/** The AlphanumericValidator validates that the field only contains letters or numbers */
export default class AlphanumericValidator extends SchemaFieldValidator<string> {

    public constructor(fieldName?: string) {
        super(fieldName);
    }

    public validate(field: string) : ValidatorData {
        if (field.search(/^([a-z]|[A-Z]|[0-9])+$/g) !== -1) return { success: true, errorMessage: "" };
        return { success: false, errorMessage: `The ${this.fieldName} must only contain alphanumeric characters.` };
    }
}