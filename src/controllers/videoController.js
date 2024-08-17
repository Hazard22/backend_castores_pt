import fetch from 'node-fetch'
import dotenv from 'dotenv'
dotenv.config()

export async function GetSearchedVideos(req, res) {
    try {
        console.log('Searching...');
        
        const secret = process.env.YT_API_KEY
        const { searched } = req.query
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&regionCode=MX&q=${searched}&key=${secret}`, 
            {
            method: 'GET',
            }
        );
        const data = await response.json();
        const finalData = data.items.map(item => {
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                description: item.snippet.description,
            }
        })
        console.log('Search successfull');
        return res.status(200).json(finalData)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}