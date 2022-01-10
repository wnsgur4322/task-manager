import mongoose from "mongoose";
const mongooseValidationErrorTransform = require("mongoose-validation-error-transform");
import logger from "./logger";

// plugin that allows for human friendly mongoose errors
// mongoose.plugin(mongooseValidationErrorTransform, {
//     capitalize: true,
//     humanize: true,
//     transform: (messages: string[]) => messages.join(",")
// });

// env variables
const { MONGODB_CONNECT } = process.env;

/**
 * @returns A Promise containing void is returned and an error message is logged if the connection failed.
 */
async function connectToDatabase(): Promise<void> {
    try {
        if (MONGODB_CONNECT === undefined) throw new Error("The MONGODB_CONNECT env variable is not defined.");
        await mongoose.connect(MONGODB_CONNECT, { useUnifiedTopology: true, useNewUrlParser: true });
        logger("Connected to Database Successfully!");
    } catch (err) {
        logger(`Database Connection Failed! ${err}`);
    }
}

export { connectToDatabase };