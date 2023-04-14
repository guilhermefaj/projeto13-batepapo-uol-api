import express from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"

// Criação do App Servidor
const app = express()

// Configurações
app.use(cors()) // Acessar a API em um front-end
app.use(express.json()) // Os dados que trocarem com o cliente estarão em formato json
dotenv.config()

// Listas

// Conexão com banco de dados
let db
const mongoClient = new MongoClient("mongodb://localhost:27017/batePapoUol")
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// Endpoints
app.post("/participants", async (req, res) => {
    const { name } = req.body

    const newUser = { name, lastStatus: Date.now() }
    try {
        await db.collection("participants").insertOne(newUser)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/participants", async (req, res) => {

    try {
        const participants = await db.collection("participants").find().toArray()
        res.send(participants)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/messages", async (req, res) => {
    const { to, text, type } = req.body
    const from = req.headers.user
    console.log(req.headers)
    const newMessage = { from, to, text, type, time: dayjs().format('HH:mm:ss') }
    try {
        await db.collection("messages").insertOne(newMessage)
        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.get("/messages", async (req, res) => {
    const limit = parseInt(req.query.limit)
    try {
        const messages = await db.collection("messages").find().toArray()
        res.send(messages)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/status", (req, res) => {
    res.send(console.log(req.headers))
})

const PORT = 5000 // Disponíveis: 3000 à 5999
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))