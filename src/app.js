import express from "express"
import cors from "cors"
import dayjs from "dayjs"

// Criação do App Servidor
const app = express()

// Configurações
app.use(cors()) // Acessar a API em um front-end
app.use(express.json()) // Os dados que trocarem com o cliente estarão em formato json

// Listas
const participants = []
const messages = []

// Endpoints
app.post("/participants", (req, res) => {
    const { name } = req.body

    const newUser = {
        name,
        lastStatus: Date.now()
    }
    participants.push(newUser)
    res.send("OK")
})

app.get("/participants", (req, res) => {
    res.send(participants)
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