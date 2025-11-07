import ENVIRONMENT from "./config/environment.config.js";
import connectToMongoDB from "./config/configMongoDB.config.js";
import express from 'express'
import authRouter from "./routes/auth.router.js";
import workspaceRouter from "./routes/workspace.router.js";
import cors from 'cors'
import memberRouter from "./routes/member.router.js";
import MessagesChannelRepository from "./repositories/messageChannel.repository.js";


connectToMongoDB()

const app = express()

//Configuro a mi API como API publica, cualquier dominio puede hacer peticiones
app.use( cors() )

app.use(express.json())

//Todas las consultas que empiezen con /api/auth va a ser gestionadas por el authRouter
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/member', memberRouter)

app.listen(
    ENVIRONMENT.PORT || 8080,
    () => {
        console.log(`Tu servidor se esta ejecutando correctamente en el puerto ${ENVIRONMENT.PORT}`)
    }
)

