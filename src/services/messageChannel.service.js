import MessagesChannelRepository from "../repositories/messageChannel.repository.js";

class MessageChannelService {
    static async create (channel_id, member_id, content){
        const message_created = await MessagesChannelRepository.create(channel_id, member_id, content)
        const messages = await MessagesChannelRepository.getAllByChannelId(channel_id)
        return {
            message_created: message_created,
            messages: messages
        }
    }

    static async getAllByChannelId (channel_id){
        const messages = await MessagesChannelRepository.getAllByChannelId(channel_id)
        return {
            messages: messages
        }
    }
}

export default MessageChannelService