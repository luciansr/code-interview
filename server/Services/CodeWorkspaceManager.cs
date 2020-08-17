using System;
using System.Collections.Generic;
using System.Text;
using Models.Workspace;
using Repositories;

namespace Services
{
    public interface ICodeWorkspaceManager
    {
        CodeWorkspace CreateCodeWorkspace(UserConnection userConnection);
        CodeWorkspace UpdateWorkspace(UserConnectionOnWorkspace userConnectionOnWorkspace);
    }

    public class CodeWorkspaceManager : ICodeWorkspaceManager
    {
        private readonly ICodeWorkspaceRepository _codeWorkspaceRepository;

        public CodeWorkspaceManager(ICodeWorkspaceRepository codeWorkspaceRepository)
        {
            _codeWorkspaceRepository = codeWorkspaceRepository;
        }

        private static string GetNewId() => Guid.NewGuid().ToString("N");

        public CodeWorkspace CreateCodeWorkspace(UserConnection userConnection)
        {
            return CreateCodeWorkspaceWithId(
                new UserConnectionOnWorkspace
                {
                    ConnectionId = userConnection.ConnectionId,
                    UserId = userConnection.UserId,
                    Name = userConnection.Name,
                    WorkspaceId = GetNewId()
                });
        }

        private CodeWorkspace CreateCodeWorkspaceWithId(UserConnectionOnWorkspace userConnectionOnWorkspace)
        {
            var codeWorkspace = new CodeWorkspace
            {
                Id = userConnectionOnWorkspace.WorkspaceId,
                Users = new Dictionary<string, WorkspaceUser>
                {
                    [userConnectionOnWorkspace.UserId] = GetWorkspaceUser(userConnectionOnWorkspace)
                }
            };

            return _codeWorkspaceRepository.Save(codeWorkspace);
        }

        private WorkspaceUser GetWorkspaceUser(UserConnection userConnection)
        {
            return new WorkspaceUser
            {
                Id = userConnection.UserId,
                ConnectionId = userConnection.ConnectionId,
                Name = string.IsNullOrWhiteSpace(userConnection.Name) ? $"User {userConnection.UserId}" : userConnection.Name.Trim()
            };
        }

        public CodeWorkspace UpdateWorkspace(UserConnectionOnWorkspace userConnectionOnWorkspace)
        {
            var workspace = _codeWorkspaceRepository.Get(userConnectionOnWorkspace.WorkspaceId);
            if (workspace == null)
            {
                return CreateCodeWorkspaceWithId(userConnectionOnWorkspace);
            }

            workspace.Users[userConnectionOnWorkspace.UserId] = GetWorkspaceUser(userConnectionOnWorkspace);

            return _codeWorkspaceRepository.Save(workspace);
        }
    }
}