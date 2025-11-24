import ChannelRepository from "../repositories/channel.repository.js";

class ChannelService { 
    static async create (workspace_id, name){
        await ChannelRepository.create(workspace_id, name) 
        return await ChannelRepository.getAllByWorkspaceId(workspace_id)
    }

    static async getAllByWorkspaceId(workspace_id){
        return await ChannelRepository.getAllByWorkspaceId(workspace_id)
    }

    static async deleteById(channel_id){
        return await ChannelRepository.deleteById(channel_id)
    }
}

export default ChannelService