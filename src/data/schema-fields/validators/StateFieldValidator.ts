import { SchemaFieldValidator, ValidatorData } from "./SchemaFieldValidator"


export default class StateFieldValidator extends SchemaFieldValidator<boolean> {
    public constructor(fieldName: string = "state") {
        super(fieldName);
    }

    public validate(state: boolean) : ValidatorData {
        if (state === undefined || typeof state !== "boolean")
            return { success: false, errorMessage: `The ${this.fieldName} must be true or false` };
        return { success: true, errorMessage: "" };
    }
}