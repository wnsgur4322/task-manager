// the authorizationTokenField is a generic field used for various types of authentication (i.e., password reset, email verification, etc...)
const authenticationTokenField = (tokenName: string) : object => {
    return {
        type: String,
        required: [true, `The ${tokenName} token is required.`]
    };
};

// the time in ms for when the authenticationTokenField expires
const authenticationTokenExpiration = (tokenName: string) : object => {
    return {
        type: Number,
        required: [true, `The ${tokenName} token expiration time is required.`]
    }
}

export { authenticationTokenField, authenticationTokenExpiration };