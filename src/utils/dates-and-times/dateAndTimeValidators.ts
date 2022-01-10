import assertError from "../../assertError";

const oneDay = 1000*3600*24;

/**
 * @param fieldName the name of the date and time field (i.e., "start" or "end")
 * @param dateString a GMT date string from the form
 * @param timeString a string with the military time
 * @returns the validated date object or an error
 */
 const getValidatedDate = (fieldName: string, dateString: string, timeString: string) : Date | any => {
    try {
        let date = new Date(dateString);
        date = new Date(date.getTime() + oneDay);
        // ensure the date is valid
        if (isNaN(date.getTime())) {
            throw new Error(`The ${fieldName} date is not valid.`);
        }
        // verify the time string conforms to the regex
        if (timeString.search(/^[0-2][0-9]:[0-5][0-9]$/g) === -1) {
            throw new Error(`The ${fieldName} time is not a valid time.`);
        }
        // extract the hours and minutes and make sure the hours are not over 23
        const [hours, minutes] = timeString.split(":").map((num: string) => parseInt(num));
        if (hours > 23) throw new Error(`The ${fieldName} time is not a valid time.`);
        // set the hours and minutes of the date and return it
        date.setHours(hours, minutes);
        return date;
    } catch (err) {
        return err;
    }
};

/** After the dates have been validated individually in getValidatedDate, check to see if they are valid together */
const validateStartAndEndDate = (startName: string, endName: string, startDate: Date, endDate: Date) : boolean | any => {
    try {
        if (startDate >= endDate) throw new Error(`The ${startName} date and time must be before the ${endName} date and time.`);
        return true;
    } catch (err) {
        return err;
    }
};

const getValidatedStartAndEndDates =
(startName: string, endName: string, startDateString: string, startTimeString: string, endDateString: string, endTimeString: string) : [Date, Date] | any => {
    try {
        const startDate = getValidatedDate(startName, startDateString, startTimeString);
        assertError(startDate);
        const endDate = getValidatedDate(endName, endDateString, endTimeString);
        assertError(endDate);
        const validatedDates = validateStartAndEndDate(startName, endName, startDate, endDate);
        assertError(validatedDates);
        return [startDate, endDate];
    } catch (err) {
        return err;
    }
};


export { getValidatedStartAndEndDates };