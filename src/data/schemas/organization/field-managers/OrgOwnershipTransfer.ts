import mongoose from "mongoose";
import { HTTPInternalServerError500 } from "../../../../utils/errors/http/httpErrors";
import { permissions } from "../../user/fields/permissionLevelField";
import { User } from "../../user/User";
import OrgField from "./OrgField";

export default class OrgOwnershipTransfer extends OrgField {

    private _newOwner: mongoose.Document<any, any, unknown>;

    public static async create(
        organizationId: string,
        currentOwner: mongoose.Document<any, any, unknown>,
        newOwnerUsername: string
    ) {
        try {
            const organization = await super.getOrganization(organizationId);
            if (currentOwner._id.toString() !== (organization as any).organizationOwnerId)
                throw new Error(`You cannot transfer the ownership of ${(organization as any).name} because you are not the owner.`);
            if ((currentOwner as any).username === newOwnerUsername)
                throw new Error(`You already own ${(organization as any).name}.`);
            if (!(newOwnerUsername in (organization as any).members))
                throw new Error("There is no such user with the username specified.");
            const newOwner = await User.findById((organization as any).members[newOwnerUsername]);
            if (!newOwner) throw new HTTPInternalServerError500("The user to transfer the ownership to could not be located.");
            return new OrgOwnershipTransfer(organization, newOwner);
        } catch (err) {
            throw err;
        }
    }

    public constructor(
        organization: mongoose.Document<any, any, unknown>,
        newOwner: mongoose.Document<any, any, unknown>
    ) {
        super("organizationOwnerId", organization);
        this._newOwner = newOwner;
    }

    public async transferOwnership() {
        try {
            (this._organization as any).organizationOwnerId = this._newOwner._id.toString();
            (this._newOwner as any).permissionLevel = permissions.ADMIN;
            await super.saveOrganization();
        } catch (err) {
            throw err;
        }
    }
}