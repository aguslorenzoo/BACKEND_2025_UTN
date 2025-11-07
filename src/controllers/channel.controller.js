import ChannelService from "../services/channel.service.js"

class ChannelController {
    static async create(request, response) {
        try{
            const {workspace_selected} = request
            // hasta aca ya se valido qeu sea miembro, admin y en que espacio de trabajo quiere crear el canal
            const {name} = request.body
            // validar que haya nombre del canal
            if(!name){
                return response.status(400).json({
                    ok: false,
                    message: 'El nombre del canal es requerido'
                })
            }

            // creamos el canal
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
}

export default ChannelController