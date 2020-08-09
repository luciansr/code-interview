using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Workspace
{
    public class UserConnectionOnWorkspace : UserConnection
    {
        [Required]
        [JsonPropertyName("workspaceId")]
        public string WorkspaceId { get; set; }
    }
}