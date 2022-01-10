import mongoose from "mongoose";
import { getSimpleErrorMsg } from "../../../errorHandler";
import logger from "../../../logger";
import BasicHasher from "../../security/hashers/BasicHasher";
import { AuthTokenGenerator64 } from "../../security/token/authTokenGenerators";
import hashPasswordAndRemovePasswordConfirm from "./before-save/hashPasswordAndRemovePasswordConfirm";
import { authenticationTokenField, authenticationTokenExpiration } from "../common/fields/authenticationTokenField";
import commonFields from "../common/fields/commonFields";
import { permissionLevelField, permissions } from "./fields/permissionLevelField";
import useOrganizationNameToGetOrganizationAccountId from "./before-save/useOrganizationNameToGetOrganizationAccountId";
import hashTokenAndUpdateExpiration from "../common/before-save/hashTokenAndUpdateExpiration";
import emailVerifiedField from "./fields/emailVerifiedField";
import { OrganizationAccount } from "../organization/OrganizationAccountSchema";


// define what fields the user document requires
interface IUser {
    firstName: any,
    lastName: any,
    roles: any,
    organizationName: any,
    organizationId: any,
    email: any,
    emailVerified: any,
    username: any,
    password: any,
    passwordConfirm: any,
    passwordChangedAt: any,
    permissionLevel: any,
    emailVerificationToken: any,
    emailVerificationTokenExpiration: any,
    passwordResetToken: any,
    passwordResetTokenExpiration: any,
}


// the object of fields to be passed to the mongoose.Schema
const schemaObject: IUser = {
    firstName: commonFields.firstNameField,
    lastName: commonFields.lastNameField,
    roles: { type: Object, default: { initialized: true } },
    organizationName: commonFields.nameWithSpacesField,
    organizationId: { type: String, default: "" },
    email: commonFields.emailField,
    emailVerified: emailVerifiedField,
    username: commonFields.usernameField,
    password: commonFields.passwordField,
    passwordConfirm: commonFields.passwordConfirmField,
    passwordChangedAt: commonFields.timestampField("password changed at"),
    permissionLevel: permissionLevelField,
    emailVerificationToken: authenticationTokenField("email verification"),
    emailVerificationTokenExpiration: authenticationTokenExpiration("email verification"),
    passwordResetToken: authenticationTokenField("password reset"),
    passwordResetTokenExpiration: authenticationTokenExpiration("password reset"),
};

const twentyFourHours: number = 1000*3600*24;

/** mongoose schema for all users */
const UserSchema: mongoose.Schema = new mongoose.Schema(schemaObject);

// do things like password hashing, field removal, and email verification messages before save
UserSchema.pre(/save/g, async function (next: any) {
    try {
        await hashPasswordAndRemovePasswordConfirm(new BasicHasher(), (this as any));
        await hashTokenAndUpdateExpiration("emailVerificationToken", (this as any), new BasicHasher());
        await hashTokenAndUpdateExpiration("passwordResetToken", (this as any), new BasicHasher());
        await useOrganizationNameToGetOrganizationAccountId((this as any));
        return next();
    } catch (err) {
        logger(getSimpleErrorMsg(err));
        return next();
    }
});

// returns only data that should be made public about the user
UserSchema.methods.getData = function (this: any) : object {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        username: this.username
    }
}
/** Provides a simple API for creating new User Document */
const createNewUser =
async (firstName?: string, lastName?: string, organizationName?: string, email?: string,
    username?: string, password?: string, passwordConfirm?: string, permissionLevel: number = permissions.MEMBER)
: Promise<mongoose.Document<any, any, unknown> | void> => {
    try {
        const userInputs = {
            firstName,
            lastName,
            organizationName,
            email,
            username,
            password,
            passwordConfirm,
            passwordChangedAt: Date.now(),
            permissionLevel,
            emailVerificationToken: new AuthTokenGenerator64().generate(),
            emailVerificationTokenExpiration: 0,
            passwordResetToken: new AuthTokenGenerator64().generate(),
            passwordResetTokenExpiration: 0
        };
        const newUser = new User(userInputs);
        return newUser;
    } catch (err) {
        throw err;
    }
};
/** Returns an object with the public information for their unique profile */
const getUserProfileInfo =
async (viewingUser: mongoose.Document<any, any, unknown>, profileUserId: string) : Promise<object | any> => {
    try {
        const profileUser = await User.findById(profileUserId);
        const organization = await OrganizationAccount.findById((viewingUser as any).organizationId);
        if (!organization) throw new Error();
        if (!profileUser) throw new Error("404 not found");
        return {
            id: profileUser._id,
            firstName: (profileUser as any).firstName,
            lastName: (profileUser as any).lastName,
            roles: Object.keys((profileUser as any).roles).slice(1),
            email: (profileUser as any).email,
            username: (profileUser as any).username,
            organizationName: (profileUser as any).organizationName,
            organizationId: (profileUser as any).organizationId,
            permissionLevel: (profileUser as any).permissionLevel,
            isTheUserOfTheProfile: profileUser._id.toString() === viewingUser._id.toString(),
            isOwnerOfOrganization: (viewingUser._id.toString() == (organization as any).organizationOwnerId) ? true : false
        };
    } catch (err) {
        return err;
    }
};

interface UpdatedUserInfo {
    firstName: string | undefined,
    lastName: string | undefined,
    email: string | undefined,
    username: string | undefined
}

const User: mongoose.Model<unknown> = mongoose.model("User", UserSchema);

export { IUser, User, createNewUser, twentyFourHours, getUserProfileInfo, UpdatedUserInfo };