import { Router } from "express"

import { 
    getUsers,
    getUserData,
    registerUser,
    login,
    verififySecurityCode,
    updatePassword,
 } from "../controllers/userController.js"
import { verifyToken } from "../middlewares/jwt.js"
const router = Router()

router.get("/", getUsers)
router.get('/get-data', verifyToken, getUserData)
router.post('/register', registerUser)
router.post('/login', login)
router.post('/verify-code', verififySecurityCode)
router.patch('/update-pass', updatePassword)

export default router