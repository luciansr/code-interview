using System;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using PeerJs.Models;

namespace PeerJs.Helpers
{
    public static class WebSocketExtensions
    {
        public static Task SendMessageAsync(this WebSocket socket, Message msg, CancellationToken cancellationToken = default)
        {
            var value = new ArraySegment<byte>(GetSerializedMessage(msg));

            return socket.SendAsync(value, WebSocketMessageType.Text, true, cancellationToken);
        }

        public static Task CloseAsync(this WebSocket socket, string description)
        {
            if (socket == null 
                || socket.State == WebSocketState.Closed 
                || socket.State == WebSocketState.Aborted)
            {
                return Task.CompletedTask;
            }
            
            return socket.CloseAsync(WebSocketCloseStatus.Empty, null!, CancellationToken.None);
        }

        private static byte[] GetSerializedMessage(Message msg)
        {
            var serialized = JsonConvert.SerializeObject(msg,
                Formatting.None,
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore,
                });

            return Encoding.UTF8.GetBytes(serialized);
        }
    }
}