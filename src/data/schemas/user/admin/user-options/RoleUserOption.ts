import UserOption from "./UserOption";
import mongoose from "mongoose";
import { getSimpleErrorMsg } from "../../../../../errorHandler";
import assertError from "../../../../../assertError";
import SchemaFieldValidatorPipeline from "../../../../schema-fields/validators/pipeline/SchemaFieldValidatorPipeline";
import NoControlCharactersValidator from "../../../../schema-fields/validators/NoControlCharactersValidator";
import { userInfo } from "os";
import { OrganizationAccount } from "../../../organization/OrganizationAccountSchema";


/** This derivation of UserOption allows a role to be added to or removed from a user profile */
export default class RoleUserOption extends UserOption {

    private _roleName: string;
    private _userOrganization: mongoose.Document<any, any, unknown>;

    private static validateRoleName(roleName: string) {
        const roleNameValidator =
        new SchemaFieldValidatorPipeline(
            new NoControlCharactersValidator("role name")
        );
        const { success, errorMessage } = roleNameValidator.pipe(roleName);
        if (!success) throw new Error(errorMessage);
        if (roleName === "initialized") throw new Error(`The name "initialized" is reserved and cannot be used.`);
    }

    public static async create(
        userId: string,
        admin: mongoose.Document<any, any, unknown>,
        requestBody: Record<string, string>
    ): Promise<RoleUserOption | Error> {
        try {
            const roleName: string | undefined = requestBody["roleName"];
            if (!roleName) throw new Error("The role is required.");
            RoleUserOption.validateRoleName(roleName);
            const userOrganization = await OrganizationAccount.findById((admin as any).organizationId);
            if (!userOrganization) throw new Error("The user's organization could not be located.");
            const instanceWasCreated = await super.createOption(userId, admin, "roles", RoleUserOption, roleName, userOrganization); 
            assertError(instanceWasCreated);
            return (instanceWasCreated as UserOption) as RoleUserOption;
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    public constructor(
        user: mongoose.Document<any, any, unknown>,
        admin: mongoose.Document<any, any, unknown>,
        optionName: string,
        roleName: string,
        userOrganization: mongoose.Document<any, any, unknown>
    ) {
        super(user, admin, optionName);
        this._roleName = roleName;
        this._userOrganization = userOrganization;
    }

    public async save() : Promise<void | Error> {
        try {
            if (this._roleName in (this._user as any).roles)
                throw new Error(`The role "${this._roleName}" already exists on this user.`);
            if (!(this._roleName in (this._userOrganization as any).roles))
                throw new Error(`Cannot assign a nonexistent role. To create the role "${this._roleName}", you first must create the role for the ${(this._userOrganization as any).name} organization account.`);
            (this._user as any).roles[this._roleName] = true;
            const saveUser = await super.saveUser();
            assertError(saveUser);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    public async remove() : Promise<void | Error> {
        try {
            if (!(this._roleName in (this._user as any).roles))
                throw new Error(`The role "${this._roleName}" does not exist on this user.`);
            delete (this._user as any).roles[this._roleName];
            const saveUser = await super.saveUser();
            assertError(saveUser);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

}