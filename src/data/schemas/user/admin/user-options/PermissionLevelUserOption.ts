import { permissions } from "../../fields/permissionLevelField";
import UserOption from "./UserOption";
import mongoose from "mongoose";
import { getSimpleErrorMsg } from "../../../../../errorHandler";
import assertError from "../../../../../assertError";


export default class PermissionLevelUserOption extends UserOption {

    private static _permissionLevelMap: Record<string, number> = {
        member: permissions.MEMBER,
        moderator: permissions.MODERATOR,
        admin: permissions.ADMIN
    };
    private _permissionLevel: number;

    public static async create(
        userId: string,
        admin: mongoose.Document<any, any, unknown>,
        requestBody: Record<string, string>
    ) {
        try {
            const permissionLevel: string | undefined = requestBody["permissionLevel"];
            if (!permissionLevel) throw new Error("The permission level is required.");
            if (!(permissionLevel in PermissionLevelUserOption._permissionLevelMap))
                throw new Error(`The permission level "${permissionLevel}" does not exist.`);
            const instanceWasCreated = await super.createOption(
                userId,
                admin,
                "permissionLevel",
                PermissionLevelUserOption,
                this._permissionLevelMap[permissionLevel]
            ); 
            assertError(instanceWasCreated);
            return (instanceWasCreated as UserOption) as PermissionLevelUserOption;
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    public constructor(
        user: mongoose.Document<any, any, unknown>,
        admin: mongoose.Document<any, any, unknown>,
        optionName: string,
        permissionLevel: number
    ) {
        super(user, admin, optionName);
        this._permissionLevel = permissionLevel;
    }
    /** saves the new permission level so long as the admin is not updating them self. */
    public async save() {
        try {
            if (this._user._id.toString() === this._admin._id.toString())
                throw new Error(`You cannot change your own permission level. If you want to transfer the ownership of ${(this._admin as any).organizationName} you must do so on the organization page.`);
            (this._user as any).permissionLevel = this._permissionLevel;
            const saveUser = await super.saveUser();
            assertError(saveUser);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    public async remove() {
        try {
            if (this._user._id.toString() === this._admin._id.toString())
                throw new Error(`You cannot change your own permission level. If you want to transfer the ownership of ${(this._admin as any).organizationName} you must do so on the organization page.`);
            (this._user as any).permissionLevel = permissions.MEMBER;
            const saveUser = await super.saveUser();
            assertError(saveUser);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }
};