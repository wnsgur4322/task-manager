import mongoose from "mongoose";
import BasicHasher from "../../../security/hashers/BasicHasher";
import { User } from "../User";


export default class UserAuthenticator {

    public static async login(
        username: string | undefined,
        password: string | undefined
    ) : Promise<mongoose.Document<any, any, unknown>> {
        try {
            if (!username || !password) throw new Error("The username and password are required.");
            const user = await User.findOne({ username });
            if (!user) throw new Error("The username or password is incorrect.");
            const hasher = new BasicHasher();
            const passwordIsCorrect = await hasher.compare(password, (user as any).password);
            if (!passwordIsCorrect) throw new Error("The username or password is incorrect.");
            return user;
        } catch (err) {
            throw err;
        }
    }

    public static async verifyUserWhoIsLoggedInMatchesUserWhoAuthenticated(
        userLoggedIn: mongoose.Document<any, any, unknown>,
        userJustAuthenticated: mongoose.Document<any, any, unknown>
    ) {
        try {
            if (userLoggedIn._id.toString() !== userJustAuthenticated._id.toString())
                throw new Error("The username or password is incorrect.");
        } catch (err) {
            throw err;
        }
    }
}