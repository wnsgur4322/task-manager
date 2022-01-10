
// env variables
const { NODE_ENV } = process.env;

// a function that logs messages in development mode
export default function logger(message: string) : void {
    if (NODE_ENV === "development") {
        const date: Date = new Date();
        console.log(`${date}: ${message}`);
    }
}