import mongoose from "mongoose";
import descriptionField from "../../common/fields/descriptionField";

interface MagicFormTemplateMongoDoc {
    magicFormName: string;
    description: string;
    fields: Record<string, Record<string, any>>;
    fieldsCount: number;
}


const magicFormTemplateInputs =  {

    magicFormName: { type: String, required: true },
    description: descriptionField(10000, "description"),
    // the key is the name of the field and the value is an object
    fields: {
        type: Object,
        default: { initialized: true }
    },
    fieldsCount: {
        type: Number,
        required: true
    }
};

const MagicFormTemplateSchema = new mongoose.Schema(magicFormTemplateInputs);

const MagicFormTemplate: mongoose.Model<unknown> = mongoose.model("MagicFormTemplate", MagicFormTemplateSchema);

export { MagicFormTemplate, MagicFormTemplateSchema, MagicFormTemplateMongoDoc };

