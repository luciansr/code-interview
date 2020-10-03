using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using PeerJs.Helpers;
using PeerJs.Models;

namespace PeerJs
{
    public interface IPeerJsServer
    {
        IReadOnlyCollection<KeyValuePair<string, IRealm>> GetRealms();

        Task RegisterClientAsync(IClientCredentals credentials, WebSocket socket, TaskCompletionSource<object> requestCompletedTcs, CancellationToken cancellationToken = default);
    }

    public class PeerJsServer : IPeerJsServer
    {
        private readonly ConcurrentDictionary<string, IRealm> _world;

        public PeerJsServer()
        {
            _world = new ConcurrentDictionary<string, IRealm>();
        }

        public IReadOnlyCollection<KeyValuePair<string, IRealm>> GetRealms()
        {
            return _world;
        }

        public async Task RegisterClientAsync(IClientCredentals credentials, WebSocket socket, TaskCompletionSource<object> requestCompletedTcs, CancellationToken cancellationToken = default)
        {
            if (!credentials.Valid)
            {
                await socket.SendMessageAsync(Message.Error(Errors.InvalidWsParameters), cancellationToken);

                await socket.CloseAsync(Errors.InvalidWsParameters);

                requestCompletedTcs.TrySetResult(null);

                return;
            }

            if (!_world.TryGetValue(credentials.Key, out var realm))
            {
                realm = new Realm();

                _world.TryAdd(credentials.Key, realm);
            }

            var client = realm.GetClient(credentials.ClientId);

            if (client != null)
            {
                if (credentials.Token != client.GetToken())
                {
                    await socket.SendMessageAsync(Message.Create(MessageType.IdTaken, "Id is already used!"), cancellationToken);

                    await socket.CloseAsync(Errors.InvalidToken);

                    requestCompletedTcs.TrySetResult(null);

                    return;
                }

                client.SetSocket(socket);

                // TODO send queued messages
            }
            else
            {
                // TODO check concurrent limit options

                client = new Client(credentials, socket);

                realm.SetClient(client);

                await client.SendAsync(
                    new Message
                    {
                        Type = MessageType.Open
                    },
                    cancellationToken);
            }

            // listen for incoming messages
            await AwaitReceiveAsync(client, realm, cancellationToken);

            // clean-up after socket close
            realm.RemoveClientById(client.GetId());

            requestCompletedTcs.TrySetResult(null);
        }

        private async Task AwaitReceiveAsync(IClient client, IRealm realm, CancellationToken cancellationToken = default)
        {
            var socket = client.GetSocket();
            var clientBuffer = WebSocket.CreateClientBuffer(1024 * 16, 1024 * 16);

            WebSocketReceiveResult result;

            do
            {
                var (readResult, message) = await ReadAsync(socket, clientBuffer, cancellationToken);

                await HandleMessageAsync(client, message, realm, cancellationToken);

                result = readResult;
            } while (!result.CloseStatus.HasValue);

            if (socket.State != WebSocketState.Closed && socket.State != WebSocketState.Aborted)
            {
                await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, cancellationToken);
            }
        }

        private async Task<(WebSocketReceiveResult, string)> ReadAsync(WebSocket socket, ArraySegment<byte> clientBuffer, CancellationToken cancellationToken = default)
        {
            WebSocketReceiveResult result;
            using var ms = new MemoryStream();

            do
            {
                result = await socket.ReceiveAsync(clientBuffer, cancellationToken);
                await ms.WriteAsync(clientBuffer.Array, clientBuffer.Offset, result.Count, cancellationToken);
            } while (!result.EndOfMessage);

            ms.Seek(0, SeekOrigin.Begin);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                using var reader = new StreamReader(ms, Encoding.UTF8);

                return (result, await reader.ReadToEndAsync());
            }

            return (result, string.Empty);
        }

        private async Task HandleMessageAsync(IClient client, string text, IRealm realm, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(text))
            {
                return;
            }

            var message = JsonConvert.DeserializeObject<Message>(text);

            await realm.HandleMessageAsync(client, message, cancellationToken);
        }
    }
}