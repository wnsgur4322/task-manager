interface SchemaWithEmail {
    email: string
}

const validatorFunc: Function = function (this: SchemaWithEmail, emailConfirm: string) {
    return this.email === emailConfirm;
}

/** unlike other fields, password confirm must access an external field for its validation (i.e. password) */
const emailConfirmField: object = {
    type: String,
    required: [true, "The confirmed email is required."],
    validate: {
        validator: validatorFunc,
        message: () => "The confirmed email must match the email."
    }
};

export default emailConfirmField;