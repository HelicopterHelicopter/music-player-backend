import { Router } from "express";
import awsS3Routes from "./awsS3-routes";

const appRouter = Router();

appRouter.use("/awsS3",awsS3Routes);

export default appRouter;