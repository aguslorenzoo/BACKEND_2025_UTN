import ChannelService from "../services/channel.service.js"

class ChannelController {
    static async create(request, response) {
        try{
            const {workspace_selected} = request
            const {name} = request.body

            if(!name){
                return response.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido'
                })
            }

            const channel_created = await ChannelService.create(workspace_selected._id, name)
            response.status(201).json(
                { 
                    ok: true,
                    status: 201,
                    message: 'Canal creado con exito',
                    data: {
                        channel: channel_created
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
                    'ERROR al crear canal', error
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

    static async deleteById (request, response){
        try{
            const {channel_selected} = request
    
            const channel_delete = await ChannelService.deleteById (channel_selected._id)
            response.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal eliminado correctamente',
                    data: {
                        channel_deleted: channel_selected
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
                    'ERROR al eliminar canal', error
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

export default ChannelController