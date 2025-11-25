import { ServerError } from "../error.js"
import ChannelRepository from "../repositories/channel.repository.js"

async function channelMiddleware (request, response, next) {
    try {
        const { workspace_selected, member, user } = request
        const { workspace_id, channel_id } = request.params
        const channel_selected = await ChannelRepository.getByIdAndWorkspaceId(workspace_id, channel_id)
        if (!channel_selected) {
            throw new ServerError(404, 'Channel no encontrado')
        }
        request.channel_selected = channel_selected
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
                'ERROR en el channelMiddleware', error
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

export default channelMiddleware