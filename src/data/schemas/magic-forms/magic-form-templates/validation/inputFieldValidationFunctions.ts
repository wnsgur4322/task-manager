import AlphanumericValidator from "../../../../schema-fields/validators/AlphanumericValidator";
import CharacterLengthValidator from "../../../../schema-fields/validators/CharacterLengthValidator";
import DateValidator from "../../../../schema-fields/validators/DateValidator";
import DropdownInputValidator from "../../../../schema-fields/validators/DropdownInputValidator";
import EmailValidator from "../../../../schema-fields/validators/EmailValidator";
import ExactCharacterLengthValidator from "../../../../schema-fields/validators/ExactCharacterLengthValidator";
import NationalPhoneNumberValidator from "../../../../schema-fields/validators/NationalPhoneNumberValidator";
import NoControlCharactersValidator from "../../../../schema-fields/validators/NoControlCharactersValidator";
import NoSpacesValidator from "../../../../schema-fields/validators/NoSpacesValidator";
import PasswordValidator from "../../../../schema-fields/validators/PasswordValidator";
import StateFieldValidator from "../../../../schema-fields/validators/StateFieldValidator";
import TimeValidator from "../../../../schema-fields/validators/TimeValidator";
import BasicStrengthChecker from "../../../../security/password-strength-checkers/BasicStrengthChecker";

const alphanumeric = (fieldName: string | undefined) => new AlphanumericValidator(fieldName);
const characterLength = (minChars: number, maxChars: number, fieldName: string | undefined) => new CharacterLengthValidator(minChars, maxChars, fieldName);
const emailAddress = (fieldName: string | undefined) => new EmailValidator(fieldName);
const exactCharacterLength = (exactChars: number, fieldName: string | undefined) => new ExactCharacterLengthValidator(exactChars, fieldName);
const nationalPhoneNumber = (fieldName: string | undefined) => new NationalPhoneNumberValidator(fieldName);
const noControlCharacters = (fieldName: string | undefined) => new NoControlCharactersValidator(fieldName);
const noSpaces = (fieldName: string | undefined) => new NoSpacesValidator(fieldName);
const password = (fieldName: string | undefined) => new PasswordValidator(new BasicStrengthChecker(), fieldName);
const date = (fieldName: string | undefined, dateMustBeTodayOrAfter: boolean) => new DateValidator(fieldName, dateMustBeTodayOrAfter);
const time = (fieldName: string | undefined) => new TimeValidator(fieldName);
const dropdownOption = (fieldName: string | undefined, dropdownOptionsSet: Set<string>) => new DropdownInputValidator(fieldName, dropdownOptionsSet);
const checkbox = (fieldName: string | undefined) => new StateFieldValidator(fieldName);

export default {
    alphanumeric,
    characterLength,
    emailAddress,
    exactCharacterLength,
    nationalPhoneNumber,
    noControlCharacters,
    noSpaces,
    password,
    date,
    time,
    dropdownOption,
    checkbox
};