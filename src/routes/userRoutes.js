import { Router } from "express"

import { 
    getUsers,
    getUserData,
    registerUser,
    login,
    verififySecurityCode,
    AddFavorite,
    updatePassword,
    RemoveFavorite
 } from "../controllers/userController.js"
import { verifyToken } from "../middlewares/jwt.js"
const router = Router()

router.get("/", getUsers)
router.get('/get-data', verifyToken, getUserData)
router.post('/register', registerUser)
router.post('/login', login)
router.post('/verify-code', verififySecurityCode)
router.post('/add-favorite',verifyToken, AddFavorite)
router.patch('/update-pass', verifyToken, updatePassword)
router.delete('/remove-favorite', verifyToken,RemoveFavorite)
export default router