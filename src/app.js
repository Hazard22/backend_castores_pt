import express from "express"
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app = express()
const apiPrefix = '/api/v1'
//Importacion de rutas


//Usuario
import userRoutes from "./routes/userRoutes.js"
//Videos
import videRoutes from "./routes/videoRoutes.js"


app.use(cors({
    origin: "http://localhost:5173",
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