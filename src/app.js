import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const apiPrefix = '/api/v1'
//Importacion de rutas


//Usuario
import userRoutes from "./routes/userRoutes.js"
//Videos
import videRoutes from "./routes/videoRoutes.js"

const client_host = process.env.CLIENT_HOST
app.use(cors({
    origin: `${client_host}`,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

//Iniciacion de rutas

//---Usuario---
app.use(`${apiPrefix}/users`, userRoutes)
//---Videos---
app.use(`${apiPrefix}/videos`, videRoutes)


export default app