
import { NextFunction,Request,Response } from "express";
import { GetYTSearchResults } from "../utils/youtube-api-communicator";
import ytdl, { validateID } from "ytdl-core";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
const fs = require('fs');
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const searchYT = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const searchKeyword = req.query.searchKeyword as string;
        const apiResponse = await GetYTSearchResults(searchKeyword);

        if(apiResponse.items && apiResponse.items.length>0){
            const data = apiResponse.items.map((item)=>({
                url:"https://www.youtube.com/watch?v="+item.id.videoId,
                title:item.snippet.title,
                thumbnail:item.snippet.thumbnails.default.url
            }));
            return res.status(200).json({message:"OK",data:data})
        }
    }catch(e){
        return res.status(200).json({message:"ERROR",cause:e.message});
    }
}

export const ytStreamer = async(req:Request, res:Response,next:NextFunction) => {
    try{
        const videoId = req.query.videoId as string;
        console.log(videoId);
        //const info  = await ytdl.getInfo(videoId);
        
        res.setHeader('Content-Type',"video/mp4");
        res.setHeader('Accept-Ranges',"bytes");

        ytdl(`https://www.youtube.com/watch?v=${videoId}`).pipe(res);
    }catch(e){
        console.log('Error',e);
        res.status(500).json({message:"ERROR",cause:e.message});
    }
}

export const getYtPresignedUrl = async(req:Request,res:Response) => {
    try{
        const videoId = req.query.videoId as string;

        if(!validateID(videoId)){
            return res.status(400).json({message:"BAD REQUEST"});
        }

        ytdl(`https://www.youtube.com/watch?v=${videoId}`).pipe(fs.createWriteStream(`${videoId}.mp4`));

        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        const region = process.env.S3_REGION;
        const Bucket = process.env.S3_YT_BUCKET;

        const client = new S3Client({
            credentials:{
                accessKeyId,
                secretAccessKey
            },
            region
        });

        const command = new PutObjectCommand({
            Bucket:Bucket,
            Key:`${videoId}.mp4`,
            Body:fs.createReadStream(`${videoId}.mp4`)
        });

        const data = await client.send(command);
        if(data.$metadata.httpStatusCode===200){

            const preSignCmd = new GetObjectCommand({Bucket:Bucket,Key:`${videoId}.mp4`});
            const presignedUrlResponse = await getSignedUrl(client,preSignCmd,{expiresIn:6000});

            return res.status(200).json({message:"OK",body:presignedUrlResponse});
        }else{
            return res.status(200).json({message:"ERROR",httpStatusCode:data.$metadata.httpStatusCode});
        }

    }catch(e){
        console.log(e);
        return res.status(500).json({message:"ERROR",cause:e});
    }
}