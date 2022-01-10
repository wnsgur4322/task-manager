import mongoose from "mongoose";
import assertError from "../../../../assertError";
import { getSimpleErrorMsg } from "../../../../errorHandler";
import OrgField from "./OrgField";

/** This is a class that locally represents a role for an organization, and allows for CRUD database operations to
 * be performed on it.
 */
export default class OrgRole extends OrgField {

    private _roleName: string;

    /** Determines if the role name is reserved since "initialized" is taken */
    private static roleNameIsReserved(roleName: string) : boolean {
        return roleName === "initialized";
    }

    /** @returns a new OrgRole instance that can perform CRUD operations with the database */
    public static async create(roleName: string, organizationId: string) : Promise<OrgRole | Error> {
        try {
            const organization = await super.getOrganization(organizationId);
            if (roleName === undefined) throw new Error("The role name is required.");
            if (this.roleNameIsReserved(roleName)) throw new Error(`The role name "${roleName}" is reserved.`);
            return new OrgRole(organization, roleName);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    /** Constructor is only used in the static create method */
    private constructor(organization: mongoose.Document<any, any, unknown>, roleName: string) {
        super("roles", organization);
        this._roleName = roleName;
    }

    /** Saves the role to the organization document in the database */
    public async save() : Promise<void | Error> {
        try {
            if (this._roleName in (this._organization as any).roles)
                throw new Error(`The role "${this._roleName}" already exists.`);
            (this._organization as any).roles[this._roleName] = true;
            await super.saveOrganization();
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    /** Removes the role from the organization document in the database */
    public async remove() : Promise<void | Error> {
        try {
            if (!(this._roleName in (this._organization as any).roles))
                throw new Error(`The role "${this._roleName}" does not exist.`);
            delete (this._organization as any).roles[this._roleName];
            await super.saveOrganization();
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }
}