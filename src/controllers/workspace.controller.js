import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import ChannelRepository from "../repositories/channel.repository.js"
import ChannelService from "../services/channel.service.js"
import WorkspaceService from "../services/workspace.service.js"
import jwt from 'jsonwebtoken'

class WorkspaceController {
    static async getAll (request, response){
        try{
            const user = request.user
            
            const workspaces = await WorkspaceService.getAll(user.id)

            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo obetnidos exitosamente',
                    data: {
                        workspaces: workspaces
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'ERROR AL OBTENER WORKSPACES', error
                )
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno de servidor',
                        status: 500
                    }
                )
            }
        }
    }

    static async deleteById (request, response) {
        try{
            const {workspace_selected} = request
            const workspace_delete = await WorkspaceService.deleteById(workspace_selected._id)
            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo eliminado correctamente',
                    data: {
                        workspace_deleted: workspace_selected,
                    }
                }
            )
        
        }
        catch (error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'Error al eliminar espacio de trabajo', error
                )
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno de servidor',
                        status: 500
                    }
                )
            }
        }
    }
    

    static async getById (request, response){
        try{
            const {workspace_selected, member} = request
            
            const channels = await ChannelService.getAllByWorkspaceId(workspace_selected._id)

            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace_detail: workspace_selected,
                        channels: channels
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'ERROR al obtener detalles del workspace', error
                )
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno de servidor',
                        status: 500
                    }
                )
            }
        }
    }

    static async create (request, response){
        try{
            const user = request.user
            const {name, url_image} = request.body

            const workspace_created = await WorkspaceService.create(user.id, name, url_image)

            response.status(201).json(
                {
                    ok: true,
                    message: 'Workspace creado con exito',
                    data: {
                        workspace_created
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'ERROR AL OBTENER WORKSPACES', error
                )
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno de servidor',
                        status: 500
                    }
                )
            }
        }  
    }

    static async invite(request, response){
        try{
            const { member, workspace_selected, user} = request
            const { email_invited, role_invited} = request.body 

            await WorkspaceService.invite(member, workspace_selected, email_invited, role_invited)
            
            response.json({
                status: 200,
                message: 'Invitacion enviada',
                ok: true
            })

        }
        catch(error){
            if(error.status){
                return response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'ERROR al invitar', error
                )
                return response.status(500).json(
                    {
                        ok: false,
                        message: 'Error interno de servidor',
                        status: 500
                    }
                )
            }
        }
    }
}

export default WorkspaceController