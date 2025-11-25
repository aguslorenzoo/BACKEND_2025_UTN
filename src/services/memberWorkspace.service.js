import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import MemberWorkspaceRepository from '../repositories/memberWorkspace.repository.js'
import { ServerError } from '../error.js'

class MemberWorkspaceService {
    static async confirmInvitation (invitacion_token) {
        const invitation_token_decoded = jwt.verify(invitacion_token, ENVIRONMENT.JWT_SECRET)   
        const {
            id_invited,
            id_workspace,
            invited_role
        } = invitation_token_decoded

        const is_already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(id_invited,id_workspace)
        if(is_already_member){
            throw new ServerError(400, 'Usuario ya es miembro del espacio de trabajo')
        }
        
        await MemberWorkspaceRepository.create(id_invited, id_workspace, invited_role)
    }
}

export default MemberWorkspaceService