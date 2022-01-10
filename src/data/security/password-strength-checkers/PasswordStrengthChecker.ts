
interface PasswordCheckerData {
    passwordIsStrong: boolean,
    errorMessage: string
}

/** interface that allows implementations to customize how stringent password strength requirements are */
interface PasswordStrengthChecker {

    /** If the password is strong enough, [true, ""] is returned. Otherwise [false, "error message"] is returned instead
     */
    checkStrength(password: string): PasswordCheckerData;
}

export { PasswordCheckerData, PasswordStrengthChecker };