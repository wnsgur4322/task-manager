import mongoose from "mongoose";
import { userInfo } from "os";
import { getSimpleErrorMsg } from "../../../../../errorHandler";
import { OrganizationAccount } from "../../../organization/OrganizationAccountSchema";
import { permissions } from "../../fields/permissionLevelField";
import { User } from "../../User";

type DerivedConstructor = new(
    user: mongoose.Document<any, any, unknown>,
    admin: mongoose.Document<any, any, unknown>,
    ...derivedOptionArgs: any[]
) => UserOption;


/** UserOption is the common base class of all user options used by an admin */
export default abstract class UserOption {
    /** The user whose option is being modified */
    protected _user: mongoose.Document<any, any, unknown>;
    /** The admin or higher that is modifying the user option */
    protected _admin: mongoose.Document<any, any, unknown>;
    /** The name of the option field in the user doc to save */
    private _optionName: string;

    private static userHasPermissionEqualOrGreaterThanAdmin(user: mongoose.Document<any, any, unknown>, admin: mongoose.Document<any, any, unknown>) : boolean {
        return (admin as any).permissionLevel <= (user as any).permissionLevel;
    }

    private static userIsNotTheAdminModifyingTheOptions(user: mongoose.Document<any, any, unknown>, admin: mongoose.Document<any, any, unknown>) : boolean {
        return (admin._id.toString() !== user._id.toString());
    }

    private static adminIsNotTheOrganizationOwner(admin: mongoose.Document<any, any, unknown>, organization: mongoose.Document<any, any, unknown>) : boolean {
        return admin._id.toString() !== (organization as any).organizationOwnerId;
    }

    private static userHasOwnerPermissionLevel(user: any) {
        return user.permissionLevel === permissions.OWNER;
    }
    protected static async createOption(
        userId: string,
        admin: mongoose.Document<any, any, unknown>,
        optionName: string,
        DerivedOption: DerivedConstructor,
        ...derivedOptionArgs: any[]
    ): Promise<UserOption | Error> {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error("There is no such user with the user id provided.");
            if (!admin) throw new Error("Failed to authenticate your admin privileges.");
            const organization = await OrganizationAccount.findById((admin as any).organizationId);
            if (!organization) throw new Error("Could not locate your organization.");
            if (!((user as any).username in (organization as any).members)) throw new Error("There is no such user with the user id provided.");
            if (
                this.userHasPermissionEqualOrGreaterThanAdmin(user,admin)
                && this.adminIsNotTheOrganizationOwner(admin,organization)
                && this.userIsNotTheAdminModifyingTheOptions(user,admin)
                || this.userHasOwnerPermissionLevel(user)
            )
                throw new Error("You cannot modify this user's options because you do not have a higher permission level.");
            return new DerivedOption(user, admin, optionName, ...derivedOptionArgs);
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    protected constructor(
        user: mongoose.Document<any, any, unknown>,
        admin: mongoose.Document<any, any, unknown>,
        optionName: string
    ) {
        this._user = user;
        this._admin = admin;
        this._optionName = optionName;
    }

    protected async saveUser() : Promise<void | Error> {
        try {
            this._user.markModified(this._optionName);
            await this._user.save({ validateBeforeSave: false });
        } catch (err) {
            return new Error(getSimpleErrorMsg(err));
        }
    }

    public abstract save() : Promise<void | Error>;
    public abstract remove() : Promise<void | Error>;

}
