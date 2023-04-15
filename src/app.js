import express from "express"
import cors from "cors"
import dayjs from "dayjs"
import { MongoClient, ObjectId } from "mongodb"
import dotenv from "dotenv"
import joi from "joi"

// Criação do App Servidor
const app = express()

// Configurações
app.use(cors()) // Acessar a API em um front-end
app.use(express.json()) // Os dados que trocarem com o cliente estarão em formato json
dotenv.config()

// Listas

// Conexão com banco de dados
let db
const mongoClient = new MongoClient(process.env.DATABASE_URL)
mongoClient.connect()
    .then(() => db = mongoClient.db())
    .catch((err) => console.log(err.message))

// Endpoints
app.post("/participants", async (req, res) => {
    req.body.lastStatus = Date.now()

    const participantsSchema = joi.object({
        name: joi.string().required(),
        lastStatus: joi.date().required()
    })

    const validation = participantsSchema.validate(req.body, { abortEarly: false })

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message)
        return res.status(422).send(errors)
    }

    try {
        const existingParticipant = await db.collection("participants").findOne({ name: req.body.name })
        if (existingParticipant) {
            return res.status(409).send("Esse nome já existe.")
        }

        await db.collection("participants").insertOne(req.body)
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
    try {
        const messages = await db.collection("messages").find().toArray()
        res.send(messages)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

app.post("/status", (req, res) => {
    const { user } = req.headers

    if (!user) {
        res.sendStatus(404)
    }
})

//remoção automática de usuários inativos

const removeParticipants = async () => {
    try {
        const cutoffTime = Date.now() - 10000
        const result = await db.collection("participants").deleteMany({ lastStatus: { $lt: cutoffTime } })
    } catch (err) {
        console.log(err.message)
    }
}

setInterval(removeParticipants, 15000)

const PORT = 5000 // Disponíveis: 3000 à 5999
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))