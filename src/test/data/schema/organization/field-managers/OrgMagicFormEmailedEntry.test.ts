import { OrgMagicFormEmailedEntry } from "../../../../../data/schemas/organization/field-managers/OrgMagicFormEmailedEntry";
import { getSimpleErrorMsg } from "../../../../../errorHandler";

const magicFormEmailedRequestObject1: any = {
    magicFormTemplateName: "should not work",
    roles: [ "zombie", "initialized", "zombie" ],
    emailListNamesForFormRecipients: [ "Test List", "Test List 2", "Test List 3", "Test List 2" ],
    emailListNamesForSubmissionNotifications: [ "Test List", "Test List 2", "Test List 3", "Test List 2" ]
};

const magicFormEmailedRequestObject2: any = {};

const magicFormEmailedRequestObject3: any = {
    magicFormTemplateName: "demo form",
    roles: [ "role2", "role1", "vampire", "role2", "role1" ],
    emailListNamesForFormRecipients: [ "Test List", "Test List 2", "initialized", "Test List 2" ],
    emailListNamesForSubmissionNotifications: [ "Test List", "Test List 2", "not a list", "Test List 2" ]
};

const dummyOrg: Record<string, any> = {
    name: "MWI",
    magicFormTemplateMap: {
        initialized: true
    },
    roles: {
        zombie: true,
        vampire: true,
        role1: true,
        role2: true
    },
    emailListsMap: {
        initialized: true,
        "Test List": true,
        "Test List 2": true,
        "Test List 3": true
    }
};

dummyOrg.magicFormTemplateMap["demo form"] = {};

// test for OrgMagicFormEmailedEntry.validateMagicFormTemplateName

test("Validation of the magic form template name fails because it was not found in the (dummyOrg as any).", async () => {
    try {
        await OrgMagicFormEmailedEntry.validateMagicFormTemplateName(magicFormEmailedRequestObject1, (dummyOrg as any));
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(`The magic form template named "should not work" does not exist.`);
    }
});

test("Validation of the magic form template name fails because it is not defined", async () => {
    try {
        await OrgMagicFormEmailedEntry.validateMagicFormTemplateName(magicFormEmailedRequestObject2, (dummyOrg as any));
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(`The magic form template name is required.`);
    }
});

test("Validation of the magic form template name succeeds because it is in the (dummyOrg as any)", async () => {
    try {
        await OrgMagicFormEmailedEntry.validateMagicFormTemplateName(magicFormEmailedRequestObject3, (dummyOrg as any));
        expect(true).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(``);
    }
});

// test for OrgMagicFormEmailedEntry.getValidatedRoles

test("Validation of the roles fails because \"initialized\" is not in the organization roles", async () => {
    try {
        const roles = await OrgMagicFormEmailedEntry.getValidatedRoles(magicFormEmailedRequestObject1, dummyOrg as any);
        expect(roles instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(`The role named "initialized" does not exist in MWI.`);
    }
});

test("Validation of the roles succeeds because all roles are in the organization", async () => {
    try {
        const roles = await OrgMagicFormEmailedEntry.getValidatedRoles(magicFormEmailedRequestObject3, dummyOrg as any);
        expect(roles instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(``);
    }
});

// test for OrgMagicFormEmailedEntry.getValidatedEmailListNames

test("Validation of the email list names succeeds", async () => {
    try {
        const validatedEmailLists = await OrgMagicFormEmailedEntry.getValidatedEmailListNames(magicFormEmailedRequestObject1.emailListNamesForFormRecipients, dummyOrg as any);
        expect(validatedEmailLists instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe("");
    }
});

test("Validation of the email list names fails", async () => {
    try {
        const validatedEmailLists = await OrgMagicFormEmailedEntry.getValidatedEmailListNames(magicFormEmailedRequestObject3.emailListNamesForFormRecipients, dummyOrg as any);
        expect(validatedEmailLists instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(`The email list named "initialized" does not exist in MWI.`);
    }
});

test("Validation of the email list names succeeds", async () => {
    try {
        const validatedEmailLists = await OrgMagicFormEmailedEntry.getValidatedEmailListNames(magicFormEmailedRequestObject1.emailListNamesForSubmissionNotifications, dummyOrg as any);
        expect(validatedEmailLists instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe("");
    }
});

test("Validation of the email list names fails", async () => {
    try {
        const validatedEmailLists = await OrgMagicFormEmailedEntry.getValidatedEmailListNames(magicFormEmailedRequestObject3.emailListNamesForSubmissionNotifications, dummyOrg as any);
        expect(validatedEmailLists instanceof Array).toBe(true);
    } catch (err) {
        expect(getSimpleErrorMsg(err)).toBe(`The email list named "not a list" does not exist in MWI.`);
    }
});