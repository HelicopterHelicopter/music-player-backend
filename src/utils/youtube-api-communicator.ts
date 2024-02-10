import axios from 'axios';

export const GetYTSearchResults = async (searchKeyword:string)=> {
    const ytAccessKey = process.env.YT_ACCESS_KEY;

        const apiUrl = "https://www.googleapis.com/youtube/v3/search";
        
        const response = await axios.get(apiUrl,{
            params:{
                "part":"snippet",
                "q":searchKeyword,
                "key":ytAccessKey,
                "type":"video"
            }
        });

        if(response.status!=200){
            throw new Error("Unable to fetch search results");
        }

        const data = await response.data;
        return data;
}