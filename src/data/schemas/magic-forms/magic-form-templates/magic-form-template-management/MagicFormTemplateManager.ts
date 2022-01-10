import { MagicFormTemplateObject } from "../MagicFormTemplateObject";
import inputFieldValidationFunctions from "../validation/inputFieldValidationFunctions";
import mongoose from "mongoose";
import { MagicFormTemplate, MagicFormTemplateMongoDoc } from "../MagicFormTemplateSchema";
import assertError from "../../../../../assertError";
import { MagicFormTemplateInputField } from "../magic-form-template-input-fields/MagicFormTemplateInputField";
import { MagicFormInputFieldConstructor } from "../magic-form-template-input-fields/MagicFormTemplateInputConstructorsMap";
import MagicFormTemplateFieldsConverter from "./MagicFormTemplateFieldsConverter";

class MagicFormTemplateManager {

    private _magicFormName: string;
    private _description: string;

    private _fields: MagicFormTemplateInputField<any>[];

    // the magic form document to save to the database
    private _magicFormTemplateDocument: mongoose.Document<any, any, unknown>;

    private getDatabaseDoc(): MagicFormTemplateMongoDoc {
        return {
            magicFormName: this._magicFormName,
            description: this._description,
            fields: MagicFormTemplateFieldsConverter.convertConstructorFieldsToDatabaseFields(this._fields),
            fieldsCount: this._fields.length
        };
    }

    private getResponseObject() : MagicFormTemplateObject {
        return {
            magicFormName: this._magicFormName,
            description: this._description,
            fields: this._fields.map(field => field.getRawObject())
        };
    }


    private constructor(
        magicFormName: string,
        description: string,
        fields: MagicFormTemplateInputField<any>[],
        magicFormTemplateDoc?: mongoose.Document<any, any, unknown>
    ) {
        this._magicFormName = magicFormName;
        this._description = description;
        this._fields = fields;
        if (!magicFormTemplateDoc) {
            const document = this.getDatabaseDoc();
            this._magicFormTemplateDocument = new MagicFormTemplate(document);
        } else {
            this._magicFormTemplateDocument = magicFormTemplateDoc;
        }
    }

    public static async create(magicFormTemplateObject: MagicFormTemplateObject) {
        try {
            const magicFormTemplateFieldsConverter = new MagicFormTemplateFieldsConverter(magicFormTemplateObject);
            const fields = await magicFormTemplateFieldsConverter.convertFromRequestObjectFieldsToConstructorFields();
            const { magicFormName, description } = magicFormTemplateObject;
            const magicFormTemplateManager = new MagicFormTemplateManager(magicFormName, description, fields);
            return magicFormTemplateManager;
        } catch (err) {
            throw err;
        }
    }

    /** Loads a magic form template from the database using its unique id */
    public static async load(magicFormTemplateDocId: string) {
        try {
            const magicFormTemplateDocument = await MagicFormTemplate.findById(magicFormTemplateDocId);
            if (!magicFormTemplateDocument) throw new Error("The magic form template id is invalid.");
            const magicFormTemplateFieldsConverter = new MagicFormTemplateFieldsConverter(undefined, (magicFormTemplateDocument as any));
            const fields = await magicFormTemplateFieldsConverter.convertDatabaseFieldsToConstructorFields();
            const { magicFormName, description } = (magicFormTemplateDocument as any);
            return new MagicFormTemplateManager(magicFormName, description, fields, magicFormTemplateDocument);
        } catch (err) {
            throw err;
        }
    }

    /** Saves a magic form template to the database */
    public async save() {
        try {
            const saveMagicFormTemplateDocument = await this._magicFormTemplateDocument.save();
            assertError(saveMagicFormTemplateDocument);
        } catch (err) {
            throw err;
        }
    }

    public async remove() {
        try {
            const removeMagicFormTempateDocument = await this._magicFormTemplateDocument.remove();
            assertError(removeMagicFormTempateDocument);
        } catch (err) {
            throw err;
        }
    }

    public getMagicFormTemplateObject() : MagicFormTemplateObject {
        return {
            magicFormName: this._magicFormName,
            description: this._description,
            fields: this._fields.map(field => field.getRawObject())
        }
    }

    public getId() { return this._magicFormTemplateDocument._id; }
    public getName() { return this._magicFormName; }
    public getDescription() { return this._description; }

    public getFields() {
        return this._fields;
    }

}

export { MagicFormTemplateManager };