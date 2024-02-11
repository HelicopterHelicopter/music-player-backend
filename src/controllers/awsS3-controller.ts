import { GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {NextFunction, Request,Response} from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';



export const getAllBucketObjects = async(req:Request,res:Response,next:NextFunction) => {
    try{
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.S3_REGION;
        const Bucket = process.env.S3_BUCKET;
        console.log(accessKeyId);
        const client = new S3Client({
            credentials:{
                accessKeyId,
                secretAccessKey
            },
            region
        });
        
        const command = new ListObjectsCommand({Bucket:Bucket});
        const data = await client.send(command);
        if(data.$metadata.httpStatusCode===200){
            return res.status(200).json({message:"OK",objects:data.Contents}); 
        }else{
            return res.status(200).json({message:"ERROR",cause:"Unable to fetch bucket objects"})
        }

        
        
    }catch(e){
        console.log(e);
        return res.status(200).json({message:"ERROR",cause:e.Message});
    }
}

export const generatePresignedUrl = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.S3_REGION;
        const Bucket = process.env.S3_BUCKET;

        const client = new S3Client({
            credentials:{
                accessKeyId,
                secretAccessKey,
                
            },
            region
        });

        const {key} = req.body;
        
        const cmd = new GetObjectCommand({Bucket:Bucket,Key:key});
        const data = await getSignedUrl(client,cmd,{expiresIn:3000});
        return res.status(200).json({message:"OK",url:data});
    }catch(e){
        console.log(e);
        return res.status(200).json({message:"ERROR",cause:e.message});
    }
}