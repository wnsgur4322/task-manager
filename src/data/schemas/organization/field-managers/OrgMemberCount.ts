import OrgField from "./OrgField";
import mongoose from "mongoose";
import { HTTPBadRequest400 } from "../../../../utils/errors/http/httpErrors";


export default class OrgMemberCount extends OrgField {

    private _memberCount: number;
    private _memberLimit: number;

    public static async create(organizationId: string) {
        try {
            const organization = await super.getOrganization(organizationId);
            return new OrgMemberCount(organization);
        } catch (err) {
            throw err;
        }
    }

    public constructor(organization: mongoose.Document<any, any, unknown>) {
        super("memberCount", organization);
        this._memberCount = (organization as any).memberCount;
        this._memberLimit = (organization as any).memberLimit;
    }

    public throwErrorIfMemberCannotBeAdded() {
        if (this._memberCount === this._memberLimit)
            throw new HTTPBadRequest400(`${(this._organization as any).name} has reached its maximum number of members.`);
    }

    public async increment() {
        try {
            this.throwErrorIfMemberCannotBeAdded();
            (this._organization as any).memberCount += 1;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }

    public async decrement() {
        try {
            (this._organization as any).memberCount -= 1;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}