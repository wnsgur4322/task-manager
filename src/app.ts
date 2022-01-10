import dotenv from "dotenv";
// configure environment variables before we run any other modules
dotenv.config();
import startExpressApp from "./express";
import { connectToDatabase } from "./databaseConnect";
import { getValidatedStartAndEndDates } from "./utils/dates-and-times/dateAndTimeValidators";

async function main() : Promise<void> {

    try {
        await startExpressApp();
        await connectToDatabase();
    } catch (err) {
    }
}

main()
.then()
.catch();


