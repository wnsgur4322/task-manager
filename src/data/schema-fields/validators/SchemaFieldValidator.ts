
interface ValidatorData {
    success: boolean,
    errorMessage: string 
}

/** An interface that validates the input of a SchemaField<T> instance */
abstract class SchemaFieldValidator<T> {

    // the name of the field used for validation error messages
    private _fieldName: string;

    protected constructor(fieldName: string = "field") {
        this._fieldName = fieldName;
    }

    /** @returns a boolean and a string. The boolean is true if validation was successful and false if it was not.
     * If the validation failed the string is an error message otherwise it is empty
    */
    public abstract validate(field: T): ValidatorData;

    public get fieldName() : string {
        return this._fieldName;
    }
}

export { ValidatorData, SchemaFieldValidator };