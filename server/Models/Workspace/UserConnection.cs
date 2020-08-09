using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Models.Workspace
{
    public class UserConnection
    {
        [Required]
        [JsonPropertyName("userId")]
        public string UserId { get; set; }
        [Required]
        [JsonPropertyName("connectionId")]
        public string ConnectionId { get; set; }
    }
}