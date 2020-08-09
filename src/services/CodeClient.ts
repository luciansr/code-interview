
interface UserConnection {
    userId: string
    connectionId: string
}

interface WorkspaceUser extends UserConnection {
    name: string
}


interface WorkspaceUserConnection extends UserConnection {
    workspaceId: string
}

interface CodeWorkspace {
    id: string
    users: UsersDictionary
}

interface UsersDictionary {
    [id: string]: WorkspaceUser
}


export class CodeClient {

    static async CreateWorkspace(userConnection: UserConnection): Promise<CodeWorkspace> {
        const response = await fetch(
            `/api/workspace/create`,
            {
                method: 'post',
                body: JSON.stringify(userConnection),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return await response.json()
    }

    static async UpdateWorkspace(workspaceUserConnection: WorkspaceUserConnection): Promise<CodeWorkspace> {
        const response = await fetch(
            `/api/workspace/update`,
            {
                method: 'post',
                body: JSON.stringify(workspaceUserConnection),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
        return await response.json()
    }
}
