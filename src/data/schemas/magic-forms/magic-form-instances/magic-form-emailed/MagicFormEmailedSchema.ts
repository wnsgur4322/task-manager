import mongoose from "mongoose";
import objectIdField from "../../../common/fields/objectIdField";

// represents the schema of a magic form that was created and sent via email
interface IMagicFormEmailed {
    magicFormTemplateId: string;
    roles: string[];
    emailListNamesForFormRecipients: string[];
    emailListNamesForSubmissionNotifications: string[];
    onlyOneSubmissionPerPerson: boolean;
}

const MagicFormEmailedSchema = new mongoose.Schema({
    magicFormTemplateId: objectIdField,
    roles: { type: Array, required: true },
    emailListNamesForFormRecipients: { type: Array, required: true },
    emailListNamesForSubmissionNotifications: { type: Array, required: true },
    onlyOneSubmissionPerPerson: { type: Boolean, default: false }
});

const MagicFormEmailed: mongoose.Model<unknown> = mongoose.model("MagicFormEmailed", MagicFormEmailedSchema);

export { MagicFormEmailed, IMagicFormEmailed };