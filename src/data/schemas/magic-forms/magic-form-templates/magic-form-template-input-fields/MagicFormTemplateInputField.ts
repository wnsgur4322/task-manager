import SchemaFieldValidatorPipeline from "../../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import { BaseFieldObject } from "../MagicFormTemplateObject";
/** This class defines all functionality shared across all MagicFormTemplateInputField instances.
 * Each derivation has a name, the order it falls in the magic form, the validation function keys to access the functions,
 * and a reference to the validator functions map itself.
 */
abstract class MagicFormTemplateInputField<T> {
    protected _fieldName: string;
    protected _inputFieldType: string;
    protected _order: number;
    protected _width: number;
    protected _validatorFuncKeys: string[];
    protected _validatorFuncArgs: any[][];
    protected readonly _validatorFuncsMap: Record<string, Function>;

    /** The order of an input must be unique because it represents its flow in the form. */
    private static ensureOrderIsUnique(order: number, ordersSet: Set<number>) {
        if (ordersSet.has(order)) throw new Error(`The order "${order}" appears more than once.`);
        ordersSet.add(order);
    }
    /** The input field name must be unique because its name is how it is identified.  */
    private static ensureFieldNameIsUnique(fieldName: string, fieldNameSet: Set<string>) {
        if (fieldNameSet.has(fieldName)) throw new Error(`There can only be one input field named "${fieldName}".`);
        fieldNameSet.add(fieldName);
    }
    /** Both the field name and order number are required fields for every input */
    protected static validateFieldName(
        fieldName: string | undefined,
        fieldNameSet: Set<string>
    ) {
        if (!fieldName) throw new Error("The field name is required.");
        if (typeof fieldName !== "string") throw new Error("The field name is invalid.");
        this.ensureFieldNameIsUnique(fieldName, fieldNameSet);
    }

    protected constructor(
        fieldName: string,
        inputFieldType: string,
        order: number,
        width: number,
        validatorFuncKeys: string[],
        validatorFuncArgs: any[][],
        validatorFuncsMap: Record<string, Function>
    ) {
        this._fieldName = fieldName;
        this._inputFieldType = inputFieldType;
        this._order = order;
        this._validatorFuncKeys = validatorFuncKeys;
        this._validatorFuncArgs = validatorFuncArgs;
        this._validatorFuncsMap = validatorFuncsMap;
        this._width = width;
    }

    public validateInput(input: T | undefined) {

        if (input === undefined) throw new Error(`The "${this._fieldName}" is required.`);
        const validators = this._validatorFuncKeys.map((funcKey, index) => {
            const validator = this._validatorFuncsMap[funcKey](...this._validatorFuncArgs[index]);
            return validator;
        });
        const validatorPipeline =
        new SchemaFieldValidatorPipeline<T>(
            ...validators
        );
        const { success, errorMessage } = validatorPipeline.pipe(input);
        if (!success) throw new Error(errorMessage);
    }

    public getRawObject() : BaseFieldObject {
        return {
            fieldName: this._fieldName,
            inputFieldType: this._inputFieldType,
            width: this._width,
            order: this._order
        };
    }
}

export {  MagicFormTemplateInputField };