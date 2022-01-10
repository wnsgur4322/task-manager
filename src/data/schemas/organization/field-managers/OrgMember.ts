import mongoose from "mongoose";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import { User } from "../../user/User";
import OrgField from "./OrgField";
import OrgMemberCount from "./OrgMemberCount";

/** This class allows a member to be locally created, and then CRUD operations with the member can be
 * done with it.
 */
export default class OrgMember extends OrgField {

    private _member: mongoose.Document<any, any, unknown>;

    /** @returns a new instance of OrgMember */
    public static async create(memberId: string, organizationId: string) : Promise<OrgMember> {
        try {
            const organization = await super.getOrganization(organizationId);
            if (memberId === undefined) throw new HTTPBadRequest400("The member id is required.");
            const member = await User.findById(memberId);
            if (!member) throw new HTTPBadRequest400(`There is no such member with the id \"${memberId}\"`);
            return new OrgMember(organization, member);
        } catch (err) {
           throw err;
        }
    }

    public constructor(organization: mongoose.Document<any, any, unknown>, member: mongoose.Document<any, any, unknown>) {
        super("members", organization);
        this._member = member;
    }

    /** Saves the member to the organization document on the database */
    public async save() : Promise<void> {
        try {
            const memberCount = new OrgMemberCount(this._organization);
            const username = (this._member as any).username;
            if (username in (this._organization as any).members)
                throw new HTTPBadRequest400(`The user ${username} is already a member of ${(this._organization as any).name}`);
            try {
                await memberCount.increment();
            } catch (err) {
                await this._member.remove();
                throw err;
            }
            (this._organization as any).members[username] = this._member._id;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }

    /** Uses the newUsername to update the member entry in the organization account */
    public async refreshMemberUsername(newUsername: string) : Promise<void> {
        try {
            if (newUsername in (this._organization as any).members)
                throw new HTTPBadRequest400(`There is already a member with the username "${newUsername}"`);
            // delete the old username entry
            delete (this._organization as any).members[(this._member as any).username];
            (this._organization as any).members[newUsername] = this._member._id;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }

    /** Removes the member from the organization document on the database */
    public async remove() : Promise<void> {
        try {
            const memberCount = new OrgMemberCount(this._organization);
            const username = (this._member as any).username;
            if (!(username in (this._organization as any).members))
                throw new HTTPBadRequest400(`The user ${username} is not a member of ${(this._organization as any).name}`);
            await memberCount.decrement();
            delete (this._organization as any).members[username];
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}