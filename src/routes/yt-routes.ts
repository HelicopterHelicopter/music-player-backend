import { Router } from "express";
import { searchYT } from "../controllers/youTube-controller";


const yt_routes = Router();

yt_routes.get("/search",searchYT);

export default yt_routes;