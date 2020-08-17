
interface UserConnection {
    userId: string
    connectionId: string
    name?: string
}

export interface WorkspaceUser extends UserConnection {
     
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
    private static url: string = process.env.REACT_APP_BACKEND ?? `http://localhost:5000`;

    public async CreateWorkspace(userConnection: UserConnection): Promise<CodeWorkspace> {
        const response = await fetch(
            `${CodeClient.url}/api/workspace/create`,
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

    public async UpdateWorkspace(workspaceUserConnection: WorkspaceUserConnection): Promise<CodeWorkspace> {
        const response = await fetch(
            `${CodeClient.url}/api/workspace/update`,
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
