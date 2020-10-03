using System;
using System.Net.WebSockets;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using PeerJs.Helpers;
using PeerJs.Models;

namespace PeerJs.Middleware
{
    public class PeerJsMiddleware
    {
        private readonly ILogger<PeerJsMiddleware> _logger;
        private readonly RequestDelegate _next;
        private readonly IPeerJsServer _webSocketServer;

        public PeerJsMiddleware(
            RequestDelegate next,
            IPeerJsServer webSocketServer,
            ILogger<PeerJsMiddleware> logger)
        {
            _next = next;
            _logger = logger;
            _webSocketServer = webSocketServer;
        }

        public async Task Invoke(HttpContext context)
        {
            var path = context.Request.Path.ToString();

            if (path.EndsWith("/api/peerjs/id"))
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 200;
                await context.Response.WriteAsync(Guid.NewGuid().ToString());
                return;
            }

            if (!path.Contains("/peerjs"))
            {
                await _next.Invoke(context);

                return;
            }

            if (!context.WebSockets.IsWebSocketRequest)
            {
                // TODO API: handle xhr requests
                context.Response.StatusCode = 200;

                return;
            }

            using var socket = await context.WebSockets.AcceptWebSocketAsync();

            try
            {
                var requestCompletedTcs = new TaskCompletionSource<object>();


                var credentials = GetCredentials(context.Request.Query);

                await _webSocketServer.RegisterClientAsync(credentials, socket, requestCompletedTcs, context.RequestAborted);

                await requestCompletedTcs.Task;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                await socket.CloseAsync(ex.Message);
            }
            finally
            {
                socket?.Dispose();
            }
        }

        private static IClientCredentals GetCredentials(IQueryCollection queryString)
        {
            return new ClientCredentials(
                clientId: GetQueryStringValue(queryString, "id"),
                token: GetQueryStringValue(queryString, "token"),
                key: GetQueryStringValue(queryString, "key"));
        }

        private static string GetQueryStringValue(IQueryCollection queryString, string key)
        {
            if (queryString.TryGetValue(key, out var value))
            {
                return  value.ToString();
            }

            return string.Empty;
        }
    }
}