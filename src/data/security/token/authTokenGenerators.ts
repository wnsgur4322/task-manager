import crypto from "crypto";

interface AuthTokenGenerator {

    /** generates a token to use for account authentication */
    generate(): string;
}


class AuthTokenGenerator64 implements AuthTokenGenerator {

    public constructor() {}

    public generate(): string {
        return crypto.randomBytes(64).toString("hex");
    }
}

export { AuthTokenGenerator64 };