import { PasswordStrengthChecker } from "../../security/password-strength-checkers/PasswordStrengthChecker";
import { ValidatorData, SchemaFieldValidator } from "./SchemaFieldValidator";

/** This validator is used to validate passwords when registering a user */
export default class PasswordValidator extends SchemaFieldValidator<string> {

    private _passwordStrengthChecker: PasswordStrengthChecker;

    public constructor(passwordStrengthChecker: PasswordStrengthChecker, fieldName: string = "password") {
        super(fieldName);
        this._passwordStrengthChecker = passwordStrengthChecker;
    }

    public validate(password: string) : ValidatorData {
        const { passwordIsStrong, errorMessage } = this._passwordStrengthChecker.checkStrength(password);
        if (passwordIsStrong) return { success: true, errorMessage };
        return { success: false, errorMessage };
    }
}