
import { getValidatedStartAndEndDates } from "../../../utils/dates-and-times/dateAndTimeValidators";

test("getValidatedStartAndEndDates throws an error for an invalid start date", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "hello", "12:30", "hi", "18:00").message)
    .toBe("The start date is not valid.");
});
test("getValidatedStartAndEndDates throws an error for an invalid start time", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "2021-07-20", "29:45", "2021-07-21", "18:00").message)
    .toBe("The start time is not a valid time.");
});
test("getValidatedStartAndEndDates throws an error for an invalid start time", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "2021-07-20", "000:0", "2021-07-21", "18:00").message)
    .toBe("The start time is not a valid time.");
});
test("getValidatedStartAndEndDates throws an error for an invalid deadline date", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "2021-07-20", "08:00", "yo waddup", "14:00").message)
    .toBe("The deadline date is not valid.");
});
test("getValidatedStartAndEndDates throws an error for an invalid deadline time", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "2021-07-20", "08:00", "2021-07-21", "56").message)
    .toBe("The deadline time is not a valid time.");
});
test("getValidatedStartAndEndDates throws an error for deadline date being before start date", () => {
    expect(getValidatedStartAndEndDates("start", "deadline", "2021-07-21", "06:00", "2021-07-20", "03:00").message)
    .toBe("The start date and time must be before the deadline date and time.");
});