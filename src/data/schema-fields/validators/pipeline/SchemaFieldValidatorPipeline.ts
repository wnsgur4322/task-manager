import { ValidatorData, SchemaFieldValidator } from "../SchemaFieldValidator";

/** SchemaFieldValidatorPipeline allows multiple SchemaFieldValidator implementations to be chained
 * in a pipeline. This allows for a customizeable validation pipeline. The order schemaFieldValidators are passed to the
 * constructor is the order their validate methods are executed.
 */
export default class SchemaFieldValidatorPipeline<T> {

    private _schemaFieldValidators: SchemaFieldValidator<T>[];

    public constructor(...schemaFieldValidators: SchemaFieldValidator<T>[]) {
        this._schemaFieldValidators = schemaFieldValidators;
    }

    public pipe(field: T) : ValidatorData {
        for (const schemaFieldValidator of this._schemaFieldValidators) {
            const { success, errorMessage } = schemaFieldValidator.validate(field);
            if (!success) return { success, errorMessage };
        }
        return { success: true, errorMessage: "" };
    }
}