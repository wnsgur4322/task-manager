import mongoose from "mongoose";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";
import OrgField from "./OrgField";


export default class OrgMemberLimit extends OrgField {
    /** This is a map of all the available options for member limits */
    private static _memberLimitMap: Record<string, number> = {
        10: 10,
        25: 25,
        50: 50,
        100: 100,
        1000: 1000,
        none: Number.MAX_SAFE_INTEGER
    };
    private _memberLimit: number;

    public static async create(organizationId: string, memberLimitKey: string | undefined) {
        try {
            const organization = await super.getOrganization(organizationId);
            if (!memberLimitKey) throw new HTTPBadRequest400("The member limit is required.");
            return new OrgMemberLimit(organization, memberLimitKey);
        } catch (err) {
            throw err;
        }
    }

    /** Creates a new OrgMemberLimit instance that verifies the member limit specified is a valid option given the
     * organization member count.
     */
    public constructor(organization: mongoose.Document<any, any, unknown>, memberLimitKey: string) {
        super("memberLimit", organization);
        if (!(memberLimitKey in OrgMemberLimit._memberLimitMap)) throw new Error(`${memberLimitKey} is not a valid limit.`);
        const memberLimit = OrgMemberLimit._memberLimitMap[memberLimitKey];
        if (memberLimit < (organization as any).memberCount) throw new Error(`You cannot set a member limit lower than the number of members currently in your organization.`);
        this._memberLimit = memberLimit;
    }

    public async save() {
        try {
            (this._organization as any).memberLimit = this._memberLimit;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}