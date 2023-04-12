import express from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient } from "mongodb"
import dotenv from "dotenv"

// Criação do App Servidor
const app = express()

// Configurações
app.use(cors()) // Acessar a API em um front-end
app.use(express.json()) // Os dados que trocarem com o cliente estarão em formato json
dotenv.config()

// Listas
const messages = []

// Conexão com banco de dados
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// Endpoints
app.post("/participants", (req, res) => {
    const { name } = req.body

    const newUser = { name, lastStatus: Date.now() }

    db.collection("participants").insertOne(newUser)
        .then(() => res.sendStatus(201))
        .catch((err) => res.status(500).send(err.message))
})

app.get("/participants", (req, res) => {
    db.collection("participants").find().toArray()
        .then(participants => res.send(participants))
        .catch((err) => res.status(500).send(err.message))
})

app.post("/messages", (req, res) => {
    const { to, text, type } = req.body

    const newMessage = {
        to,
        text,
        type,
        time: dayjs().format('HH:mm:ss')
    }

    messages.push(newMessage)

    res.sendStatus(201)
})

app.get("/messages", (req, res) => {
    res.send(messages)
})

app.post("/status", (req, res) => {
    res.send(console.log(req.headers))
})

const PORT = 5000 // Disponíveis: 3000 à 5999
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))