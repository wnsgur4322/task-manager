import SchemaFieldValidatorPipeline from "./validators/pipeline/SchemaFieldValidatorPipeline";

/** SchemaFieldBuilder allows for building cutomizeable fields with various options. This allows for code
 * reusablility since some fields will be shared across schemas (i.e. names, emails, etc.)
 */
export default class SchemaFieldBuilder<T> {

    private _fieldName: string;
    private _fieldType: Function | null | any[] = null;
    private _required: [boolean, string] = [false, ""];
    private _unique: [boolean, string] = [false, ""];
    private _validatorFunction: Function | null = null;
    private _validatorMessage: Function | null = null;
    private _defaultValue: T | null = null;

    public constructor(fieldName: string) {
        this._fieldName = fieldName;
    }

    public default(fieldValue: T) : SchemaFieldBuilder<T> {
        this._defaultValue = fieldValue;
        return this;
    }

    public required() : SchemaFieldBuilder<T> {
        this._required = [true, `The ${this._fieldName} is required.`];
        return this;
    }

    public type(fieldType: Function | any[]) : SchemaFieldBuilder<T> {
        this._fieldType = fieldType;
        return this;
    }

    public validatorPipeline(validatorPipeline: SchemaFieldValidatorPipeline<T>) : SchemaFieldBuilder<T> {
        this._validatorFunction = (field: T) => validatorPipeline.pipe(field).success;
        // in this instance field is an any type because the object passed in has a value property
        this._validatorMessage = (field: any) => validatorPipeline.pipe(field.value).errorMessage;
        return this;
    }

    public unique() : SchemaFieldBuilder<T> {
        this._unique = [true, `The ${this._fieldName} specified already exists.`];
        return this;
    }

    public generateSchemaFieldObject() : object {
        return {
            type: this._fieldType,
            validate: {
                validator: this._validatorFunction,
                message: this._validatorMessage
            },
            required: this._required,
            unique: this._unique,
            default: this._defaultValue
        };
    }

}