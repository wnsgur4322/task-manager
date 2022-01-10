import { MagicFormInputFieldConstructor, magicFormInputFieldsConstructors } from "../magic-form-template-input-fields/MagicFormTemplateInputConstructorsMap";
import { MagicFormTemplateInputField } from "../magic-form-template-input-fields/MagicFormTemplateInputField";
import { MagicFormTemplateObject } from "../MagicFormTemplateObject";
import { MagicFormTemplateMongoDoc } from "../MagicFormTemplateSchema";
import inputFieldValidationFunctions from "../validation/inputFieldValidationFunctions";


export default class MagicFormTemplateFieldsConverter {

    // Keeps track of all validator functions used with input fields
    private _validatorFunctionsMap: Record<string, Function> = inputFieldValidationFunctions;
    // Ensures field names are unique
    private _fieldNamesSet = new Set<string>();
    private _magicFormTemplateObject: MagicFormTemplateObject | undefined;
    private _magicFormTemplateDatabaseDoc: MagicFormTemplateMongoDoc | undefined;

    public constructor(
        magicFormTemplateObject: MagicFormTemplateObject | undefined = undefined,
        magicFormTemplateDatabaseDoc: MagicFormTemplateMongoDoc | undefined = undefined
    ) {
        this._magicFormTemplateObject = magicFormTemplateObject;
        this._magicFormTemplateDatabaseDoc = magicFormTemplateDatabaseDoc;
    }

    public async convertFromRequestObjectFieldsToConstructorFields(): Promise<MagicFormTemplateInputField<any>[]> {
        try {
            const fields: MagicFormTemplateInputField<any>[] = [];
            if (this._magicFormTemplateObject === undefined) throw new Error("this._magicFormTemplateObject is not defined.");
            for (const order in this._magicFormTemplateObject.fields) {
                const baseFieldObject = this._magicFormTemplateObject.fields[order];
                if (!magicFormInputFieldsConstructors.has(baseFieldObject.inputFieldType))
                    throw new Error(`The input field type "${baseFieldObject.inputFieldType}" does not exist.`);
                const magicFormTemplateInputField =
                await (magicFormInputFieldsConstructors
                .get(baseFieldObject.inputFieldType) as MagicFormInputFieldConstructor)(baseFieldObject, parseInt(order) as any, this._fieldNamesSet, this._validatorFunctionsMap);
                fields.push(magicFormTemplateInputField);
            }
            if (fields.length === 0) throw new Error("There must be at least one input field for the magic form template.");
            return fields;
        } catch (err) {
            throw err;
        }
    }

    public static convertConstructorFieldsToDatabaseFields(constructorFieldsArr: MagicFormTemplateInputField<any>[])
    : Record<string, object> {
        const databaseFieldsMap: Record<string, object> = {};
        constructorFieldsArr.forEach(field => {
            const rawObject: any = field.getRawObject();
            const fieldName = rawObject.fieldName;
            delete rawObject.fieldName;
            databaseFieldsMap[fieldName] = rawObject;
        });
        return databaseFieldsMap;
    }

    public async convertDatabaseFieldsToConstructorFields()
    : Promise<MagicFormTemplateInputField<any>[]> {
        try {
            if (this._magicFormTemplateDatabaseDoc === undefined) throw new Error("this._magicFormTemplateDatabaseDoc is not defined.");
            const constructorFieldArr: MagicFormTemplateInputField<any>[] = [];
            const fieldNames = Object.keys(this._magicFormTemplateDatabaseDoc.fields);
            for (const fieldName of fieldNames) {
                const baseFieldObject: Record<string, string> = this._magicFormTemplateDatabaseDoc.fields[fieldName];
                baseFieldObject.fieldName = fieldName;
                const magicFormTemplateInputField =
                await (magicFormInputFieldsConstructors
                .get(baseFieldObject.inputFieldType) as MagicFormInputFieldConstructor)(baseFieldObject, baseFieldObject["order"] as any, this._fieldNamesSet, this._validatorFunctionsMap);
                constructorFieldArr.push(magicFormTemplateInputField);
            }
            return constructorFieldArr;
        } catch (err) {
            throw err;
        }
    }
}