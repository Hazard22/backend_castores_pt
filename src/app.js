import express from "express"
import cors from 'cors'

const app = express()
const apiPrefix = '/api/v1'
//Importacion de rutas


//Administrador
import userRoutes from "./routes/userRoutes.js"


app.use(cors({
    origin: "*"
}))
app.use(express.json())

//Iniciacion de rutas

//---Administrador---
app.use(`${apiPrefix}/users`, userRoutes)



export default app