import express, { Application, Request, Response, NextFunction } from "express";
import logger from "./logger";

// middleware routers
import errorRouter from "./router/errors/errorRouter";
import organizationRouter from "./router/organization/organizationRouter";
import ownerRouter from "./router/owner/ownerRouter";
import adminRouter from "./router/users/admin/adminRouter";
import userOptionsRouter from "./router/users/admin/user-options/userOptionsRouter";
import authRouter from "./router/users/auth/authRouter";
import userProfileRouter from "./router/users/user-profile/userProfileRouter";
import fileUpload from "express-fileupload";
import magicFormTemplateRouter from "./router/magic-form-templates/magicFormTemplateRouter";
import emailListsRouter from "./router/organization/email-lists/emailListsRouter";

const app: Application = express();

// basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// routers
app.use("/auth", authRouter);
app.use("/owner", ownerRouter);
app.use("/admin", adminRouter);
app.use("/user-options", userOptionsRouter);
app.use("/user-profiles", userProfileRouter);
app.use("/organizations", organizationRouter);
app.use("/magic-form-templates", magicFormTemplateRouter);
app.use("/email-lists", emailListsRouter);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Welcome to Task Manager app."});
});

// declare error router at the end of the middleware stack
app.use(errorRouter);


export default function startExpressApp() : void {

    const PORT: number = parseInt(process.env.PORT || "5000");
    app.listen(PORT, () => logger(`The server is running on port ${PORT}...`));
}