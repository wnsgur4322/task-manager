import { SchemaFieldValidator, ValidatorData } from "./SchemaFieldValidator";

const oneDay = 1000*24*3600;

export default class DateValidator extends SchemaFieldValidator<string> {

    private static _dateRegex = /^\d{4}-\d{2}-\d{2}$/g;
    private _dateMustBeTodayOrAfter: boolean;

    public constructor(fieldName: string = "date", dateMustBeTodayOrAfter: boolean = false) {
        super(fieldName);
        if (dateMustBeTodayOrAfter !== undefined && typeof dateMustBeTodayOrAfter !== "boolean")
            throw new Error("The dateMustBeTodayOrAfter property must be a boolean.");
        this._dateMustBeTodayOrAfter = dateMustBeTodayOrAfter;
    }

    public validate(field: string) : ValidatorData {
        if (field.search(DateValidator._dateRegex) !== -1) {
            const splitData: string[] = field.split('-');
            if (parseInt(splitData[1]) <= 12 && parseInt(splitData[2]) <= 31) {
                const date = new Date(field).getTime() + oneDay;
                const now = new Date();
                now.setHours(0,0,0,0);
                if (this._dateMustBeTodayOrAfter && date < now.getTime()) {
                    return { success: false, errorMessage: `The ${this.fieldName} must be today or after.` };
                }
                return { success: true, errorMessage: "" };
            }
        }
        return { success: false, errorMessage: `The ${this.fieldName} is not a valid date.`};
    }
}