import axios from "axios";
import { NextFunction,Request,Response } from "express";
import { GetYTSearchResults } from "../utils/youtube-api-communicator";

export const searchYT = async (req:Request,res:Response,next:NextFunction) => {
    try{
        const searchKeyword = req.query.searchKeyword as string;
        const apiResponse = await GetYTSearchResults(searchKeyword);

        if(apiResponse.items && apiResponse.items.length>0){
            const data = apiResponse.items.map((item)=>({
                videoId:item.id.videoId,
                title:item.snippet.title,
                thumbnail:item.snippet.thumbnails.default.url
            }));
            return res.status(200).json({message:"OK",data:data})
        }
    }catch(e){
        return res.status(200).json({message:"ERROR",cause:e.message});
    }
}