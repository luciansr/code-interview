using Microsoft.AspNetCore.Mvc;
using Models.Workspace;
using Services;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/workspace")]
    public class WorkspaceController : ControllerBase
    {
        private readonly ICodeWorkspaceManager _codeWorkspaceManager;

        public WorkspaceController(ICodeWorkspaceManager codeWorkspaceManager)
        {
            _codeWorkspaceManager = codeWorkspaceManager;
        }

        [HttpPost]
        [Route("create")]
        public CodeWorkspace CreateCodeWorkspace(UserConnection userConnection)
        {
            return _codeWorkspaceManager.CreateCodeWorkspace(userConnection);
        }

        [HttpPost]
        [Route("update")]
        public CodeWorkspace UpdateWorkspace(UserConnectionOnWorkspace userConnectionOnWorkspace)
        {
            return _codeWorkspaceManager.UpdateWorkspace(userConnectionOnWorkspace);
        }
    }
}