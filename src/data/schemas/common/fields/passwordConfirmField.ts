
interface SchemaWithPassword {
    password: string
}

const validatorFunc: Function = function (this: SchemaWithPassword, passwordConfirm: string) {
    return this.password === passwordConfirm;
}

/** unlike other fields, password confirm must access an external field for its validation (i.e. password) */
const passwordConfirmField: object = {
    type: String,
    required: [true, "The confirmed password is required."],
    validate: {
        validator: validatorFunc,
        message: () => "The confirmed password must match the password."
    }
};

export default passwordConfirmField;