import { Router } from "express"

import { 
    GetSearchedVideos,
 } from "../controllers/videoController.js"
const router = Router()

router.get("/", GetSearchedVideos)

export default router