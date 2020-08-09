using System;
using System.Threading;
using System.Threading.Tasks;
using Models.Workspace;
using Microsoft.Extensions.Caching.Memory;

namespace Repositories
{
    public interface ICodeWorkspaceRepository
    {
        CodeWorkspace Save(CodeWorkspace codeWorkspace);
        CodeWorkspace Get(string workspaceId);
    }

    public class CodeWorkspaceRepository : ICodeWorkspaceRepository
    {
        private readonly TimeSpan _cacheDuration = TimeSpan.FromHours(2);
        private readonly IMemoryCache _memoryCache;

        public CodeWorkspaceRepository(IMemoryCache memoryCache)
        {
            _memoryCache = memoryCache;
        }

        private string BuildCacheKey(string workspaceId) => $"{nameof(CodeWorkspaceRepository)}:workspace:{workspaceId}";

        public CodeWorkspace Save(CodeWorkspace codeWorkspace)
        {
            return _memoryCache.Set(BuildCacheKey(codeWorkspace.Id), codeWorkspace, _cacheDuration);
        }

        public CodeWorkspace Get(string workspaceId)
        {
            return _memoryCache.Get<CodeWorkspace>(BuildCacheKey(workspaceId));
        }
    }
}