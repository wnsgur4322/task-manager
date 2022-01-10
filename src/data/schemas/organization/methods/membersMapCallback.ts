import { User } from "../../user/User";

/** converts each username in the members object of an organization account to
 * an object with firstName, lastName, and _id */
const fullNameAndIdMembersMapCallback = (organizationAccount: any) => {
    return async (memberUsername: string) => {
        try {
            // use the id to retrieve the user and get their full name
            const user = await User.findById(organizationAccount.members[memberUsername].toString());
            if (user !== null) {
                return {
                    firstName: (user as any).firstName,
                    lastName: (user as any).lastName,
                    roles: Object.keys((user as any).roles).slice(1),
                    id: (user as any)._id
                };
            }
            return null;
        } catch (err) {
            return err;
        }
    };
};

export { fullNameAndIdMembersMapCallback };