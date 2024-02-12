import { Router } from "express";
import { getYtPresignedUrl, searchYT, ytStreamer } from "../controllers/youTube-controller";


const yt_routes = Router();

yt_routes.get("/search",searchYT);
yt_routes.get("/play",ytStreamer);
yt_routes.get("/getYtURL",getYtPresignedUrl);

export default yt_routes;