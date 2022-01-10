
interface SchemaWithSave {
    save(): Promise<void>;
    set(key: string, state: boolean) : void;
}

const saveWithoutValidation = async (schema: SchemaWithSave) : Promise<void | any> => {
    try {
        // turn validation off temporarily, save, then turn it back on
        schema.set("validateBeforeSave", false);
        await schema.save();
        schema.set("validateBeforeSave", true);
    } catch (err) {
        return err;
    }
};

export { saveWithoutValidation };