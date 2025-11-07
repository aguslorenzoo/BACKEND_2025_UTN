import MessageChannelService from "../services/messageChannel.service.js"

class MessagesChannelController {
    static async create (request, response) {
        try{
            const {channel_selected, member, user} = request
            const {content} =  request.body

            const {messages, message_created} = await MessageChannelService.create(channel_selected._id, member._id, content)
            return response.status(201).json({
                ok: true,
                status: 201,
                message: 'Messages created',
                data: {
                    messages: messages,
                    message_created: message_created
                }
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
                    'ERROR al crear el mensaje', error
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
    
    static async getAllByChannelId (request, response) {
        try{
            const {channel_selected} = request
            const {messages} = await MessageChannelService.getAllByChannelId(channel_selected._id)
    
            response.status(200).json({
                ok: true,
                status: 200,
                message: 'Messages',
                data: {
                    messages: messages,
                }
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
                    'ERROR al obtener la lista de mensajes', error
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

export default MessagesChannelController