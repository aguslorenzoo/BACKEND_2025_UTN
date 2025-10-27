import express from 'express'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const workspaceRouter = express.Router()

// Obtener la lista de espacios de trabajo DEL CLIENTE QUE ME ESTA CONSULTANDO
workspaceRouter.get(
    '/',
    authMiddleware,
    WorkspaceController.getAll
)

workspaceRouter.post(
    '/',
    authMiddleware,
    WorkspaceController.create
)

export default workspaceRouter