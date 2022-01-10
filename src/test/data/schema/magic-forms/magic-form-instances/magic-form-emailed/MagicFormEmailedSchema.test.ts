import { MagicFormEmailed, IMagicFormEmailed } from "../../../../../../data/schemas/magic-forms/magic-form-instances/magic-form-emailed/MagicFormEmailedSchema";
import { getSimpleErrorMsg } from "../../../../../../errorHandler";

const magicFormEmailed1: IMagicFormEmailed = {
    magicFormTemplateId: "610af647b46b7d4b488248ac",
    roles: ["zombie", "vampire"],
    emailListNamesForFormRecipients: [ "list1", "list2" ],
    emailListNamesForSubmissionNotifications: [ "list3", "list4" ],
    onlyOneSubmissionPerPerson: true
};

const magicFormEmailed2: IMagicFormEmailed = {
    magicFormTemplateId: "610af647b46b7d4!488248ac",
    roles: ["zombie", "vampire"],
    emailListNamesForFormRecipients: [ "list1", "list2" ],
    emailListNamesForSubmissionNotifications: [ "list3", "list4" ],
    onlyOneSubmissionPerPerson: true
};

const magicFormEmailed3: IMagicFormEmailed = {
    magicFormTemplateId: "hello",
    roles: ["zombie", "vampire"],
    emailListNamesForFormRecipients: [ "list1", "list2" ],
    emailListNamesForSubmissionNotifications: [ "list3", "list4" ],
    onlyOneSubmissionPerPerson: true
};

const magicFormEmailed4: IMagicFormEmailed = ({
    magicFormTemplateId: "610af647b46b7d45488248ac",
    roles: ["zombie", "vampire"],
    emailListNamesForFormRecipients: [ "list1", "list2" ],
    emailListNamesForSubmissionNotifications: [ "list3", "list4" ],
} as any);

const successMsg = "The magic form emailed document was created successfully.";
const createMagicFormEmailed = async (iMagicFormEmailed: IMagicFormEmailed) => {
    try {
        const magicFormEmailedDoc = new MagicFormEmailed(iMagicFormEmailed);
        await magicFormEmailedDoc.validate();
        return successMsg;
    } catch (err) {
        return getSimpleErrorMsg(err);
    }
};

test("MagicFormEmailed Document is successfully created", async () => {
    const message = await createMagicFormEmailed(magicFormEmailed1);
    expect(message).toBe(successMsg);
});

test("MagicFormEmailed Document throws error because id is invalid", async () => {
    const message = await createMagicFormEmailed(magicFormEmailed2);
    expect(message).toBe("MagicFormEmailed validation failed: magicFormTemplateId: The object id must only contain alphanumeric characters.");
});

test("MagicFormEmailed Document throws error because id is invalid", async () => {
    const message = await createMagicFormEmailed(magicFormEmailed3);
    expect(message).toBe("MagicFormEmailed validation failed: magicFormTemplateId: The object id must be exactly 24 characters long.");
});

test("MagicFormEmailed Document is successfully created", async () => {
    const message = await createMagicFormEmailed(magicFormEmailed4);
    expect(message).toBe(successMsg);
});