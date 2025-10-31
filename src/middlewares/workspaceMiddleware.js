import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"

function workspaceMiddleware (valid_member_roles = []) {
    return async function (request, response, next){
        try{   
            const { workspace_id } = request.params
            const user = request.user

            // chequear que el workspace con x id exista
            const workspace_selected = await WorkspaceRepository.getById(workspace_id)
            if(!workspace_selected){
                throw new ServerError(404, 'Workspace no encontrado')
            }

            // chequear si el cliente es un miembro de ese workspace
            const member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user.id, workspace_id)
            if(!member){
                throw new ServerError(403, 'No tienes acceso a este workspace')
            }
            
            // chequear si el miembro cuenta con el rol permitido
            if(valid_member_roles.length > 0 && !valid_member_roles.includes(member.role)){
                throw new ServerError(403, 'No puede realizar esta operación')
            }

            // guardamos en la request los datos del miembro y del espacio de trabajo
            request.member = member
            request.workspace_selected = workspace_selected
            next()
        }
        catch(error){
            if(error.status){
                response.status(error.status).json(
                    {
                        ok: false,
                        message: error.message,
                        status: error.status
                    }
                )
            }
            else{
                console.error(
                    'ERROR en workspaceMiddleware', error
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

export default workspaceMiddleware