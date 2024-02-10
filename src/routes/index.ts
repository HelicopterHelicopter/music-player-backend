import { Router } from "express";
import awsS3Routes from "./awsS3-routes";
import yt_routes from "./yt-routes";

const appRouter = Router();

appRouter.use("/awsS3",awsS3Routes);
appRouter.use("/yt",yt_routes);

export default appRouter;