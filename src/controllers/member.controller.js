import jwt from 'jsonwebtoken'
import ENVIRONMENT from '../config/environment.config.js'
import MemberWorkspaceService from '../services/memberWorkspace.service.js'


class MemberController {
    static async confirmInvitation(request, response) {
        try {
            const {invitation_token} = request.params

            await MemberWorkspaceService.confirmInvitation(invitation_token)
            response.redirect(`${ENVIRONMENT.URL_FRONTEND}/login`)

        } 
        catch (error) {
            if(error instanceof jwt.JsonWebTokenError){
                return response.status(400).json(
                    {
                        ok: false,
                        message: 'Token invalido',
                        status: error.status
                    }
                )
            }
            if(error instanceof jwt.TokenExpiredError){
                return response.status(400).json(
                    {
                        ok: false,
                        message: 'Token expirado',
                        status: error.status
                    }
                )
            }
            else if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message,
                    status: error.status,
                })
            } 
            else {
                console.error(
                    "ERROR al confirmar invitación", error
                )
                return response.status(500).json({
                    ok: false,
                    message: "Error interno de servidor",
                    status: 500,
                })
            }
        }
    }
}

export default MemberController;
