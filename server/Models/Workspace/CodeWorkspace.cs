using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Workspace
{
    public class CodeWorkspace
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [Required]
        [JsonPropertyName("users")]
        public Dictionary<string, WorkspaceUser> Users { get; set; }
    }
}