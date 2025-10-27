import WorkspaceRepository from "../repositories/workspace.repository.js"
import WorkspaceService from "../services/workspace.service.js"

class WorkspaceController {
    static async getAll (request, response){
        try{
            
            // MUESTRO LOS DATOS DE SESION DEL USUARIO
            const user = request.user
            
            // Necesito saber el user_id del cliente para saber exactamente quien es y que lista debo darle
            const workspaces = await WorkspaceService.getAll(user.id)

            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo obetenidos exitosamente',
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
                return response.stauts(500).json(
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

            const workspace_created = await     WorkspaceService.create(user.id, name, url_image)

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
                return response.stauts(500).json(
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