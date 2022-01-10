import Hasher from "./Hasher";
import bcrypt from "bcrypt";

/** @class BasicHasher uses a medium level bcrypt saltRounds number for its hashing implementation */
export default class BasicHasher implements Hasher {

    public constructor() {}

    public async hash(contentToHash: string) : Promise<string | any> {
        try {
            const hashedContent: string = await bcrypt.hash(contentToHash, 12);
            return hashedContent;
        } catch (err) {
            return err;
        }
    }

    public async compare(contentToHash: string, hashedContent: string) : Promise<boolean> {
        const passwordsMatch = await bcrypt.compare(contentToHash, hashedContent);
        return passwordsMatch;
    }
}