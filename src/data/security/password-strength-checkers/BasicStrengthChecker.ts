import { PasswordCheckerData, PasswordStrengthChecker } from "./PasswordStrengthChecker";

/** This PasswordStrengthChecker implementation requires one capital letter, one number, and one non-alphanumeric character */
export default class BasicStrengthChecker implements PasswordStrengthChecker {

    public constructor() {}

    public checkStrength(password: string) : PasswordCheckerData {
        let hasSpecialChar: boolean = false;
        let hasNumber: boolean = false;
        let hasCapitalLetter = false;
        for (let i = 0; i < password.length; i++) {
            const code = password.charCodeAt(i);
            if (code > 47 && code < 58) {
                hasNumber = true;
            } else if (code < 48 || (code > 57 && code < 65) ||
            (code > 90 && code < 97) || code > 122) {
                hasSpecialChar = true;
            } else if (code > 64 && code < 91) {
                hasCapitalLetter = true;
            }
        }
        if (hasCapitalLetter && hasSpecialChar && hasNumber) return { passwordIsStrong: true, errorMessage: "" };
        return { passwordIsStrong: false, errorMessage: "The password must contain one capital letter, one number, and one special character." };
    }
}