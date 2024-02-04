import { Router } from "express";
import { generatePresignedUrl, getAllBucketObjects } from "../controllers/awsS3-controller";

const awsS3Routes = Router();

awsS3Routes.get("/Bucket",getAllBucketObjects);
awsS3Routes.post("/GetSignedUrl",generatePresignedUrl);

export default awsS3Routes;