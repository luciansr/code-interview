using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Workspace
{
    public class WorkspaceUser
    {
        [Required]
        [JsonPropertyName("id")]
        public string Id { get; set; }
        [Required]
        [JsonPropertyName("name")]
        public string Name { get; set; }
        [Required]
        [JsonPropertyName("connectionId")]
        public string ConnectionId { get; set; }
    }
}