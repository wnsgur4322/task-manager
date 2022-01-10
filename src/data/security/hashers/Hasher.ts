import { getSimpleErrorMsg } from "../../../errorHandler";

/** Hasher is an abstract class that allows polymorphism to dictate what algorithm
 * the client wants to use for password/data hashing
 */
export default interface Hasher {

    hash(contentToHash: string) : Promise<string | any>;

    compare(contentToHash: string, hashedContent: string) : Promise<boolean | any>;
}