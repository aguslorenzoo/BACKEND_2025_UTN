import MemberWorkspaceRepository from "../repositories/memberWorkspace.repository.js"
import WorkspaceRepository from "../repositories/workspace.repository.js"

class WorkspaceService {
    static async getAll(user_id){
        const members = await MemberWorkspaceRepository.getAllByUserId(user_id)
        return members
    }
    static async create(user_id, name, url_image){
        // crear el espascio de trabajo 
        const worksapce_created = await WorkspaceRepository.create(name, url_image)
        // crear al miembro con rol de admin ya que es el creador
        await MemberWorkspaceRepository.create(user_id, worksapce_created, 'admin')
        return worksapce_created
    }
}

export default WorkspaceService