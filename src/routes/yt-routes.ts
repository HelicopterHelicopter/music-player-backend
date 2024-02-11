import { Router } from "express";
import { searchYT, ytStreamer } from "../controllers/youTube-controller";


const yt_routes = Router();

yt_routes.get("/search",searchYT);
yt_routes.get("/play",ytStreamer);

export default yt_routes;