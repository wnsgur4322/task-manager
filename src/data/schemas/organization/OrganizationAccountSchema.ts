import commonFields from "../common/fields/commonFields";
import membersRosterField from "./fields/membersRosterField";
import mongoose from "mongoose";
import { deleteOrganizationToken } from "./before-save/deleteOrganizationToken";
import { fullNameAndIdMembersMapCallback } from "./methods/membersMapCallback";
import organizationOwnerIdField from "./fields/organizationOwnerIdField";

interface IOrganizationAccount {
    name: any,
    roles: any,
    bio: any,
    magicFormTemplateMap: any,
    magicFormEmailedMap: any,
    emailListsMap: any,
    memberCount: any,
    memberLimit: any,
    members: any,
    organizationOwnerId: any,
    memberInviteTokens: any,
}

const schemaObject: IOrganizationAccount = {
    // the name of the organization
    name: commonFields.nameWithSpacesField,
    roles: { type: Object, default: { initialized: true } },
    bio: { type: String, default: "" },
    // keys are the names of form templates and values are the ids of form templates
    magicFormTemplateMap: { type: Object, default: { initialized: true } },
    magicFormEmailedMap: { type: Object, default: { initialized: true } },
    // lists of emails used for sending magic forms
    emailListsMap: { type: Object, default: { initialized: true } },
    memberCount: { type: Number, required: true },
    memberLimit: { type: Number, required: true },
    // the map of users that are members of the organization
    members: membersRosterField,
    // the id of the admin that created this organization account
    organizationOwnerId: organizationOwnerIdField,
    // keys are the emails of the users invited and values are an object with the hashed token and it's expiration
    memberInviteTokens: { type: Object, default: { initialized: true } }
};

const OrganizationAccountSchema: mongoose.Schema = new mongoose.Schema(schemaObject);

OrganizationAccountSchema.pre(/save/g, async function (this: any) : Promise<void | any> {
    try {
        await deleteOrganizationToken(this);
    } catch (err) {
        return err;
    }
});


// every time a brand new admin creates an account for their organization, a document will be generated for the organization
const OrganizationAccount: mongoose.Model<unknown> = mongoose.model("OrganizationAccount", OrganizationAccountSchema);

/** Provides a simple API for creating an OrganizationAccount Document object with as little info as possible */
const createNewOrganizationAccount =
async (organizationName: string, adminCreatingTheAccount: mongoose.Document<any, any, unknown>)
: Promise<mongoose.Document<any, any, unknown> | any> => {
    try {
        // construct the data to create the document
        const organizationAccountInputs: IOrganizationAccount = {
            name: organizationName,
            roles: { initialized: true },
            bio: "",
            magicFormTemplateMap: { initialized: true },
            magicFormEmailedMap: { initialized: true },
            emailListsMap: { initialized: true },
            memberCount: 1,
            // start with no upper limit on number of members
            memberLimit: Number.MAX_SAFE_INTEGER,
            members: {},
            organizationOwnerId: adminCreatingTheAccount._id.toString(),
            memberInviteTokens: { initialized: true }
        };
        // add the admin user as the first member of the members map
        organizationAccountInputs.members[(adminCreatingTheAccount as any).username] = adminCreatingTheAccount._id;
        const newOrganization = new OrganizationAccount(organizationAccountInputs);
        return newOrganization;
    } catch (err) {
        return err;
    }
};

/** Check if an organization account exists and if it does return it (i.e., we don't want to generate an organization auth token
 * if the organization already has an account) */
const getOrganizationAccountIfExists =
async (organizationName: string) : Promise<mongoose.Document<any, any, unknown>> => {
    try {
        const organizationAccount = await OrganizationAccount.findOne({ name: organizationName });
        if (!organizationAccount) throw new Error("The organization could not be found.");
        return organizationAccount;
    } catch (err) {
        throw err;
    }
};


/** After a member's registration has been validated, they can be added to the members roster */
const addMemberToOrganizationMembers =
async (memberToAdd: mongoose.Document<any, any, unknown>, organizationAccount: mongoose.Document<any, any, unknown>)
: Promise<void | any> => {
    try {
        // add the member as a key-value entry in the members object
        (organizationAccount as any).members[(memberToAdd as any).username] = memberToAdd._id;
        
        await organizationAccount.save();
    } catch (err) {
        return err;
    }
};

/** This method retrieves all needed information for a particular organization account */
const retrieveOrganizationAccountInfo =
async (organizationAccountId: string, user: mongoose.Document<any, any, unknown> | undefined) : Promise<object | any> => {
    try {
        const organizationAccount = await OrganizationAccount.findById(organizationAccountId);
        if (!organizationAccount) throw new Error("The organization id provided does not match any existing id.");
        const arrayOfUsernames: Array<string> = Object.keys((organizationAccount as any).members);
        // map each username to an object with the user's full name and id
        let members = await Promise.all(arrayOfUsernames.map(fullNameAndIdMembersMapCallback(organizationAccount)));
        // sort the members alphabetically by first name
        members = members.sort((left: any, right: any) => (left.firstName > right.firstName) ? 1 : -1);
        const organizationInfo = {
            id: organizationAccount._id.toString(),
            name: (organizationAccount as any).name,
            bio: (organizationAccount as any).bio,
            memberCount: (organizationAccount as any).memberCount,
            memberLimit: (organizationAccount as any).memberLimit,
            members,
            roles: Object.keys((organizationAccount as any).roles).slice(1)
        };
        return organizationInfo;
    } catch (err) {
        return err;
    }
};


export {
    OrganizationAccount,
    createNewOrganizationAccount,
    getOrganizationAccountIfExists,
    addMemberToOrganizationMembers,
    retrieveOrganizationAccountInfo
};