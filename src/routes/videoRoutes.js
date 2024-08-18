import { Router } from "express"

import { 
    GetSearchedVideos,
    GetFavoriteVideos
 } from "../controllers/videoController.js"
import { verifyToken } from "../middlewares/jwt.js"
const router = Router()

router.get("/", verifyToken, GetSearchedVideos)
router.get('/favorites', verifyToken, GetFavoriteVideos)
export default router