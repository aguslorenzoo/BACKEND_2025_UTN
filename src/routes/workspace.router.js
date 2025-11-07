import express from 'express'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js'
import ChannelController from '../controllers/channel.controller.js'
import channelMiddleware from '../middlewares/channelMiddleware.js'
import MessagesChannelController from '../controllers/messagesChannel.controller.js'

const workspaceRouter = express.Router()

// Obtener la lista de espacios de trabajo DEL CLIENTE QUE ME ESTA CONSULTANDO
workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)

// Crear un workspace
workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)

// Obtener espacio de trabajo especifico para mostrar los channels
workspaceRouter.get(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

// Crear nuevo canal
workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']), //solo admin pueden crear canales
    ChannelController.create
)

// CONSIGNA:
// Crear los controladores para crear mensajes y obtener mensajes
// Siempre qeu se creer o obetenga la lista el servidor debera responde con la lista de mensajes

// Crear mensajes
workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesChannelController.create
)

// Obtener mensajes
workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesChannelController.getAllByChannelId
)


workspaceRouter.get(
    '/:workspace_id/test',
    authMiddleware,
    workspaceMiddleware(['admin']),
    (request, response) => {
        console.log(request.workspace_selected)
        console.log(request.member)
        response.json({
            ok: true,
            status: 200,
            message: 'test'
        })
    }
)


workspaceRouter.post(
    '/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)
export default workspaceRouter