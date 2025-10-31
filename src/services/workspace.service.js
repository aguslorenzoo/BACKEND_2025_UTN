import ENVIRONMENT from "../config/environment.config.js"
import { ServerError } from "../error.js"
import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import UserRepository from "../repositories/user.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"
import jwt from 'jsonwebtoken'
import mailTransporter from "../config/mailTransporter.config.js";


class WorkspaceService {
    static async getAll(user_id){
        const members = await MemberWorkspaceRepository.getAllByUserId(user_id)
        return members
    }

    static async create(user_id, name, url_image){
        // crear el espacio de trabajo 
        const worksapce_created = await WorkspaceRepository.create(name, url_image)
        // crear al miembro con rol de admin ya que es el creador
        await MemberWorkspaceRepository.create(user_id, worksapce_created, 'admin')
        return worksapce_created
    }

    static async invite (member, workspace_selected, email_invited, role_invited){
        const user_invited = await UserRepository.getByEmail(email_invited)
        if(!user_invited){
            throw new ServerError(404,'No existe el usuario')
        }

        const already_member = await MemberWorkspaceRepository.getByUserIdAndWorkspaceId(user_invited._id, workspace_selected._id)
        if(already_member){
            throw new ServerError(400, 'El usuario que quiere agregar ya es miembro de este workspace')
        }
        
        const invitation_token = jwt.sign(
            {
                id_invited: user_invited._id,
                id_inviter: member._id,
                id_workspace: workspace_selected._id,
                invited_role: role_invited

            },
            ENVIRONMENT.JWT_SECRET,
            {
                expiresIn:'7d'
            }
        )

        await mailTransporter.sendMail({
            to: email_invited,
            from: ENVIRONMENT.GMAIL_USER,
            subject: "Te han invitado a un espacio de trabajo",
            html: `
                    <h1>Has sido invitado al workspace: ${workspace_selected.name}</h1>
                    <a href="${ENVIRONMENT.URL_BACKEND}/api/member/confirm/${invitation_token}">Aceptar</a>
                `
        })
    }
}

export default WorkspaceService