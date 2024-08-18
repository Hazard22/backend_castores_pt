import fetch from 'node-fetch'
import dotenv from 'dotenv'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'
import { UserFavorites } from '../models/UserFavorites.js';
dotenv.config()

export async function GetSearchedVideos(req, res) {
    try {
        console.log('Searching...');
        const token = req.cookies.authToken

        if (!token) {
            return res.status(401).json({ error: 'Token no encontrado' });
        }

        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            const secret = process.env.YT_API_KEY
            const { searched } = req.query
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=20&regionCode=MX&q=${searched}&key=${secret}`, 
                {
                method: 'GET',
                }
            );
            const data = await response.json();
            const finalData = await Promise.all(data.items.map(async (item) => {
                const isFavorite = await verifyFavorite(decoded.id, item.id.videoId);
                return {
                    id: item.id.videoId,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.medium.url,
                    isFavorite
                };
            }));
            console.log('Search successfull');
            return res.status(200).json(finalData)
         })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

export async function GetFavoriteVideos(req, res) {
    try {
        console.log('Searching...');
        const token = req.cookies.authToken

        if (!token) {
            return res.status(401).json({ error: 'Token no encontrado' });
        }

        jwt.verify(token, process.env.SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'Token inválido' });
            }
            const userFavorites = await UserFavorites.findAll({
                attributes: ['video_id'],
                where: {userId: decoded.id},
            })
            const videoIds = userFavorites.map(favorite => favorite.video_id);
            const secret = process.env.YT_API_KEY
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${secret}`, 
                {
                method: 'GET',
                }
            );
            const data = await response.json();
            const finalData = await Promise.all(data.items.map(async (item) => {
                const isFavorite = await verifyFavorite(decoded.id, item.id);
                return {
                    id: item.id,
                    title: item.snippet.title,
                    description: item.snippet.description.split('\n')[0],
                    thumbnail: item.snippet.thumbnails.medium.url,
                    isFavorite
                };
            }));
            console.log('Search successfull');
            return res.status(200).json(finalData)
         })
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

async function verifyFavorite(userId, video_id){
    try {
        const count = await UserFavorites.count({
            where: {
                [Op.and]: [
                    { userId: userId },
                    { video_id: video_id }
                ]
            }
        });
        
        if(count<1){
            return false
        }
        return true
    } catch (error) {
        return false
    }
}