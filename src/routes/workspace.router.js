import express from 'express'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import workspaceMiddleware from '../middlewares/workspaceMiddleware.js'
import ChannelController from '../controllers/channel.controller.js'
import channelMiddleware from '../middlewares/channelMiddleware.js'
import MessagesChannelController from '../controllers/messagesChannel.controller.js'
import MemberController from '../controllers/member.controller.js'

const workspaceRouter = express.Router()

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

workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    workspaceMiddleware(['admin']), 
    WorkspaceController.deleteById
)

workspaceRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(),
    WorkspaceController.getById
)

workspaceRouter.post(
    '/:workspace_id/channels',
    authMiddleware,
    workspaceMiddleware(['admin']), 
    ChannelController.create
)

workspaceRouter.delete(
    '/:workspace_id/channels/:channel_id',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    ChannelController.deleteById
)

workspaceRouter.get(
    '/:workspace_id/current-member',
    authMiddleware,
    workspaceMiddleware(),
    MemberController.getCurrentMember
)

workspaceRouter.post(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesChannelController.create
)

workspaceRouter.get(
    '/:workspace_id/channels/:channel_id/messages',
    authMiddleware,
    workspaceMiddleware(),
    channelMiddleware,
    MessagesChannelController.getAllByChannelId
)

workspaceRouter.post(
    '/:workspace_id/invite',
    authMiddleware,
    workspaceMiddleware(['admin']),
    WorkspaceController.invite
)
export default workspaceRouter