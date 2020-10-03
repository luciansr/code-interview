using System;
using Microsoft.AspNetCore.Builder;

namespace PeerJs.Middleware
{
    public static class MiddlewareExtensions
    {
        public static IApplicationBuilder UsePeerJsServer(this IApplicationBuilder builder)
        {
            var webSocketOptions = new WebSocketOptions()
            {
                KeepAliveInterval = TimeSpan.FromSeconds(120),
                ReceiveBufferSize = 16 * 1024,
            };

            builder.UseWebSockets(webSocketOptions);

            return builder
                .UseWebSockets(webSocketOptions)
                .UseMiddleware<PeerJsMiddleware>();
        }
    }
}
