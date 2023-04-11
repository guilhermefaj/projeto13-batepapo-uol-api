import express from "express"
import cors from "cors"

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
        id: participants.length + 1,
        name
    }
    participants.push(newUser)
    res.send("OK")
})

app.get("/participants", (req, res) => {
    res.send(participants)
})

app.post("/messages", (req, res) => {
    const { to, text, type } = req.body

    const newMessage = { id: messages.length + 1, to, text, type }

    messages.push(newMessage)

    res.send("OK")
})

app.get("/messages", (req, res) => {
    res.send(messages)
})

const PORT = 5000 // Disponíveis: 3000 à 5999
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))