import { Router } from "express"

import { 
    getUsers,
    registerUser,
    login,
    verififySecurityCode,
    updatePassword
 } from "../controllers/userController.js"
const router = Router()

router.get("/", getUsers)
router.post('/register', registerUser)
router.post('/login', login)
router.post('/verify-code', verififySecurityCode)
router.patch('/update-pass', updatePassword)

export default router