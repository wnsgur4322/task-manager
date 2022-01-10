import { SchemaFieldValidator, ValidatorData } from "./SchemaFieldValidator";


export default class TimeValidator extends SchemaFieldValidator<string> {

    private static _timeRegex = /^\d{2}:\d{2}$/g;

    public constructor(fieldName: string = "time") {
        super(fieldName);
    }

    public validate(field: string) : ValidatorData {
        if (field.search(field) !== -1) {
            const splitData = field.split(':');
            if (parseInt(splitData[0]) <= 23 && parseInt(splitData[1]) <= 59) {
                return { success: true, errorMessage: "" };
            }
        }
        return { success: false, errorMessage: `The ${this.fieldName} is not a valid time.` };
    }
}