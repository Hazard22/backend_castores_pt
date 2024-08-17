import { Router } from "express"

import { 
    getUsers,
    registerUser,
    login
 } from "../controllers/userController.js"
const router = Router()

router.get("/", getUsers)
router.post('/register', registerUser)
router.post('/login', login)

export default router